const fetchCountriesData = require("../services/fetchCountries");
const fetchExchangeRates = require("../services/fetchExchangeRates");
const generateImage = require("../services/generateImage");
const countryModel = require("../models/countryModel");

function randomMultiplier() {
  return Math.floor(Math.random() * 1001) + 1000; // 1000-2000
}

async function refreshCountries(req, res) {
  try {
    const countries = await fetchCountriesData();
    const rates = await fetchExchangeRates();
    const now = new Date().toISOString();

    for (const c of countries) {
      const currency_code = c.currencies?.[0]?.code || null;
      const exchange_rate = currency_code ? rates[currency_code] || null : null;
      const estimated_gdp = exchange_rate
        ? (c.population * randomMultiplier()) / exchange_rate
        : 0;

      await countryModel.upsertCountry({
        name: c.name,
        capital: c.capital || null,
        region: c.region || null,
        population: c.population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url: c.flag || null,
        last_refreshed_at: now,
      });
    }

    await generateImage();
    res.json({ status: "success", refreshed_at: now });
  } catch (err) {
    res.status(503).json({
      error: "External data source unavailable",
      details: err.message,
    });
  }
}

module.exports = { refreshCountries };
