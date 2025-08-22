import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Ruta para crear usuario
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "El correo ya existe o los datos no son válidos" });
  }
});

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

//  Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
