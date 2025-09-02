import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path"; // <-- Asegúrate de importar path

const app = express();
const prisma = new PrismaClient();

app.use(express.static(path.join(process.cwd())));
console.log("RUTA DE LA BASE DE DATOS:", path.resolve("./prisma/dev.db"));

app.use(cors());
app.use(express.json());
 
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Datos recibidos:", { name, email, password }); // <-- verifica que llegan los datos

  if (!name || !email || !password) {
    console.log("Faltan campos"); 
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.create({ data: { name, email, password } });
    console.log("Usuario creado en la DB:", user); // <-- log del resultado real
    res.json(user);
  } catch (error) {
    console.error("Error creando usuario:", error); // <-- log del error real
    res.status(400).json({ error: "Email already exists or data is invalid" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: "Please fill in both fields." });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ ok: false, message: "User not found." });
    if (user.password !== password) return res.status(401).json({ ok: false, message: "Incorrect password." });
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otpToken.create({
      data: {
        otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    res.json({ message: "OTP generated!", otp }); // Aquí mandamos el OTP al front
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and code are required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = await prisma.otpToken.findFirst({
      where: { userId: user.id, otp, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!token) return res.status(400).json({ message: "Invalid or expired code" });

    await prisma.otpToken.delete({ where: { id: token.id } });

    res.json({ message: "Code verified successfully", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying code" });
  }
});

app.post("/experiences", async (req, res) => {
  const { title, description, location, price, date } = req.body;
  try {
    const experience = await prisma.experience.create({
      data: { title, description, location, price, date: new Date(date) },
    });
    res.json(experience);
  } catch (err) {
    res.status(400).json({ error: "Invalid data for experience" });
  }
});

app.get("/experiences", async (req, res) => {
  const experiences = await prisma.experience.findMany();
  res.json(experiences);
});

app.post("/bookings", async (req, res) => {
  const { userId, experienceId } = req.body;
  try {
    const booking = await prisma.booking.create({ data: { userId, experienceId } });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid user or experience" });
  }
});

app.get("/users/:id/bookings", async (req, res) => {
  const { id } = req.params;
  const bookings = await prisma.booking.findMany({
    where: { userId: Number(id) },
    include: { experience: true },
  });
  res.json(bookings);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


