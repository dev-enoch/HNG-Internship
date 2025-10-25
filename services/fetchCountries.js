const axios = require("axios");

async function fetchCountriesData() {
  try {
    const response = await axios.get(
      "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
    );
    return response.data;
  } catch {
    throw new Error("Could not fetch data from Countries");
  }
}

module.exports = fetchCountriesData;
