const axios = require("axios");

async function fetchExchangeRates() {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/USD");
    return response.data.rates;
  } catch {
    throw new Error("Could not fetch data from Exchange Rates");
  }
}

module.exports = fetchExchangeRates;
