const express = require('express');
const cors = require("cors");   
const app = express();
const cookieParser = require('cookie-parser');

//middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());




//import routs
const HealthCheck = require("../src/routes/HealthCheck.routes.js")
app.use("/api/v1/healthcheck", HealthCheck)

const authRouter = require("../src/routes/auth.routes.js")
app.use("/api/v1/auth", authRouter)




module.exports = app;