const express = require("express");
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
// Configuration CORS pour réseau local
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (apps mobiles, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Liste des patterns autorisés
    const allowedPatterns = [
      /^http:\/\/localhost(:\d+)?$/, // localhost
      /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 192.168.x.x
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 10.x.x.x
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 172.16-31.x.x
    ];

    // Vérifier si l'origine correspond à un pattern
    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Origine CORS non autorisée: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

// Appliquer CORS
app.use(cors(corsOptions));

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
