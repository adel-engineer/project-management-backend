const express = require("express")
const route = express.Router()
const HealthCheck = require("../controllers/HealthCheck.controllers.js")

route.get("/", HealthCheck);

module.exports = route