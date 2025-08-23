import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Email already exists or data is invalid" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Please fill in both fields." });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ ok: false, message: "User not found." });
    if (user.password !== password) return res.status(401).json({ ok: false, message: "Incorrect password." });
    return res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error." });
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
    const booking = await prisma.booking.create({
      data: { userId, experienceId },
    });
    res.json(booking);
  } catch (error) {
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
