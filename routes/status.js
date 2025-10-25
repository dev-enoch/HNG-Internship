const express = require("express");
const countryModel = require("../models/countryModel");

const router = express.Router();

// GET /status
router.get("/", async (req, res) => {
  try {
    const status = await countryModel.getStatus();
    res.json({
      total_countries: status.total || 0,
      last_refreshed_at: status.last_refreshed_at || null,
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
