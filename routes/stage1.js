const express = require("express");
const axios = require("axios");
const PROFILE = require("../config/profile");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Backend Wizards Stage 1 API");
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/me", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: response.data?.fact || "No cat fact available",
    });
  } catch {
    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: "Unable to fetch a cat fact at the moment",
    });
  }
});

module.exports = router;
