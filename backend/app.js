const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import des routeurs et middlewares
const api = require("./src/routers/api.routes");
// const errorHandler = require("./source/middlewares/errorHandler");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// Middlewares Body-Parser
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Middleware pour servir les fichiers statiques (comme les images uploadées)

app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

app.use("/api/", api);

// Route Health Check simple pour les load balancers ou la surveillance
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is up and running!" });
});

// Gestion des routes non trouvées (404)
app.use("*name", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// app.use(errorHandler);

module.exports = app;
