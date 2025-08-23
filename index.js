import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ------------------------------
// Ruta para crear usuario (Sign Up)
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "El correo ya existe o los datos no son válidos" });
  }
});

// ------------------------------
// Ruta para login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email y password son requeridos" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ ok: false, message: "Usuario no encontrado" });
    if (user.password !== password) return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });

    return res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
});

// ------------------------------
// Ruta para crear experiencia
app.post("/experiences", async (req, res) => {
  const { title, description, location, price, date } = req.body;
  const experience = await prisma.experience.create({
    data: { title, description, location, price, date: new Date(date) },
  });
  res.json(experience);
});

// Ruta para listar experiencias
app.get("/experiences", async (req, res) => {
  const experiences = await prisma.experience.findMany();
  res.json(experiences);
});

// Ruta para hacer una reserva
app.post("/bookings", async (req, res) => {
  const { userId, experienceId } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { userId, experienceId },
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: "Usuario o experiencia no válidos" });
  }
});

// Ruta para ver reservas de un usuario
app.get("/users/:id/bookings", async (req, res) => {
  const { id } = req.params;
  const bookings = await prisma.booking.findMany({
    where: { userId: Number(id) },
    include: { experience: true },
  });
  res.json(bookings);
});

// ------------------------------
// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
