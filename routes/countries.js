const express = require("express");
const fs = require("fs");
const path = require("path");
const countryModel = require("../models/countryModel");
const { refreshCountries } = require("../controllers/countriesController");

const router = express.Router();

// POST /countries/refresh
router.post("/refresh", refreshCountries);

// GET /countries
router.get("/", async (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      currency: req.query.currency,
    };
    const sort = req.query.sort || "";
    const countries = await countryModel.getAllCountries(filters, sort);
    res.json(countries);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /countries/image
router.get("/image", (req, res) => {
  const imagePath = path.join(__dirname, "../cache/summary.png");
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: "Summary image not found" });
  }
  res.sendFile(imagePath);
});

// GET /countries/:name
router.get("/:name", async (req, res) => {
  try {
    const country = await countryModel.getCountryByName(req.params.name);
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /countries/:name
router.delete("/:name", async (req, res) => {
  try {
    const country = await countryModel.getCountryByName(req.params.name);
    if (!country) return res.status(404).json({ error: "Country not found" });
    await countryModel.deleteCountryByName(req.params.name);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
