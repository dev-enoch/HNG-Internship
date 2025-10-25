const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const countryModel = require("../models/countryModel");

async function generateImage() {
  const countries = await countryModel.getAllCountries();
  const total = countries.length;
  const top5 = countries
    .filter((c) => c.estimated_gdp)
    .sort((a, b) => b.estimated_gdp - a.estimated_gdp)
    .slice(0, 5);

  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#000000";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`Countries Summary`, 50, 50);

  // Total countries
  ctx.font = "12px Arial";
  ctx.fillText(`Total countries: ${total}`, 50, 100);

  // Top 5 GDP
  ctx.fillText(`Top 5 countries by estimated GDP:`, 50, 150);
  top5.forEach((c, i) => {
    ctx.fillText(
      `${i + 1}. ${c.name} → ${c.estimated_gdp.toLocaleString()}`,
      70,
      190 + i * 30
    );
  });

  // Last refreshed
  const lastRefreshed =
    countries[0]?.last_refreshed_at || new Date().toISOString();
  ctx.fillText(`Last refreshed: ${lastRefreshed}`, 50, 400);

  const buffer = canvas.toBuffer("image/png");
  const imagePath = path.join(__dirname, "../cache/summary.png");
  fs.writeFileSync(imagePath, buffer);
}

module.exports = generateImage;
