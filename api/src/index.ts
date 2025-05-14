import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import classroomRouter from "./routes/classroomRoutes";
import reservationRouter from "./routes/reservationRoutes";

// Création de l'application principale
const app = new Hono();

// Middlewares globaux
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Middleware pour gérer les erreurs
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Route racine pour informer et rediriger vers /api
app.get("/", (c) => {
  return c.json({
    message:
      "Bienvenue sur l'API du système de réservation de salles de classe",
    api_url: "/api",
  });
});

// Créer une instance pour les routes de l'API avec le préfixe /api
const api = new Hono();

// Ajouter les routes à l'API
api.get("/", (c) => {
  return c.json({ message: "API Classroom fonctionne correctement!" });
});

// Routes d'authentification
api.route("/auth", authRouter);

// Routes utilisateurs (protégées)
api.route("/users", userRouter);

// Routes des salles de classe
api.route("/classrooms", classroomRouter);

// Routes des réservations
api.route("/reservations", reservationRouter);

// Monter l'API sur /api
app.route("/api", api);

// Démarrer le serveur
const port = 8000;

serve({
  fetch: app.fetch,
  port,
});
