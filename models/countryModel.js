const db = require("../config/db");

// async function ensureTableExists() {
//   try {
//     // Drop table if it exists
//     await db.execute("DROP TABLE IF EXISTS countries");
//     console.log("Dropped existing 'countries' table (if any).");

//     // Create a new table
//     const createSql = `
//       CREATE TABLE countries (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL UNIQUE,
//         capital VARCHAR(255),
//         region VARCHAR(255),
//         population BIGINT NOT NULL,
//         currency_code VARCHAR(10),
//         exchange_rate DOUBLE,
//         estimated_gdp DOUBLE,
//         flag_url VARCHAR(500),
//         last_refreshed_at DATETIME
//       )
//     `;
//     await db.execute(createSql);
//     console.log("Table 'countries' created successfully.");
//   } catch (err) {
//     console.error("Error dropping/creating table:", err);
//   }
// }

// // Call at module load
// ensureTableExists();

async function ensureTableExists() {
  try {
    // Check if the table exists
    const [rows] = await db.execute("SHOW TABLES LIKE 'countries'");

    if (rows.length === 0) {
      // Table does not exist, create it
      const createSql = `
        CREATE TABLE countries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          capital VARCHAR(255),
          region VARCHAR(255),
          population BIGINT NOT NULL,
          currency_code VARCHAR(10),
          exchange_rate DOUBLE,
          estimated_gdp DOUBLE,
          flag_url VARCHAR(500),
          last_refreshed_at DATETIME
        )
      `;
      await db.execute(createSql);
      console.log("Table 'countries' created successfully.");
    } else {
      console.log("Table 'countries' already exists.");
    }
  } catch (err) {
    console.error("Error checking/creating table:", err);
  }
}

// Ensure table exists at module load
ensureTableExists();

// --- CRUD functions ---
async function upsertCountry(country) {
  const sql = `
    INSERT INTO countries 
      (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      capital=VALUES(capital),
      region=VALUES(region),
      population=VALUES(population),
      currency_code=VALUES(currency_code),
      exchange_rate=VALUES(exchange_rate),
      estimated_gdp=VALUES(estimated_gdp),
      flag_url=VALUES(flag_url),
      last_refreshed_at=VALUES(last_refreshed_at)
  `;
  const params = [
    country.name,
    country.capital,
    country.region,
    country.population,
    country.currency_code,
    country.exchange_rate,
    country.estimated_gdp,
    country.flag_url,
    country.last_refreshed_at,
  ];
  await db.execute(sql, params);
}

async function getAllCountries(filters = {}, sort = "") {
  let sql = "SELECT * FROM countries WHERE 1";
  const params = [];

  if (filters.region) {
    sql += " AND region=?";
    params.push(filters.region);
  }
  if (filters.currency) {
    sql += " AND currency_code=?";
    params.push(filters.currency);
  }
  if (sort === "gdp_desc") sql += " ORDER BY estimated_gdp DESC";
  return (await db.execute(sql, params))[0];
}

async function getCountryByName(name) {
  const [rows] = await db.execute(
    "SELECT * FROM countries WHERE name=? LIMIT 1",
    [name]
  );
  return rows[0];
}

async function deleteCountryByName(name) {
  await db.execute("DELETE FROM countries WHERE name=?", [name]);
}

async function getStatus() {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as total, MAX(last_refreshed_at) as last_refreshed_at FROM countries"
  );
  return rows[0];
}

module.exports = {
  upsertCountry,
  getAllCountries,
  getCountryByName,
  deleteCountryByName,
  getStatus,
};
