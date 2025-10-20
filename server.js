const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const PROFILE = {
  email: "mail@enochphilip.site",
  name: "Enoch Philip Dibal",
  stack: "Node.js/Express",
};

// In-memory storage for strings
const stringsStore = new Map();

// Utility functions
function analyzeString(value) {
  const lowerValue = value.toLowerCase();
  const length = value.length;
  const is_palindrome = lowerValue === lowerValue.split("").reverse().join("");
  const unique_characters = new Set(value).size;
  const word_count = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");
  const character_frequency_map = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
}

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Backend Wizards Stage 0 API");
});

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /me endpoint
app.get("/me", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    const catFact = response.data?.fact || "No cat fact available";

    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: catFact,
    });
  } catch (error) {
    console.log("Error fetching cat fact:", error.message);
    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: "Unable to fetch a cat fact at the moment",
    });
  }
});

// POST /strings - create/analyze string
app.post("/strings", (req, res) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    return res.status(422).json({ error: "Value must be a string" });
  }
  if (!value) {
    return res.status(400).json({ error: "Missing 'value' field" });
  }

  const analysis = analyzeString(value);

  if (stringsStore.has(analysis.sha256_hash)) {
    return res.status(409).json({ error: "String already exists" });
  }

  const record = {
    id: analysis.sha256_hash,
    value,
    properties: analysis,
    created_at: new Date().toISOString(),
  };

  stringsStore.set(analysis.sha256_hash, record);

  res.status(201).json(record);
});

// GET /strings/:value - get specific string by SHA256 hash
app.get("/strings/:value", (req, res) => {
  const { value } = req.params;
  const hash = crypto.createHash("sha256").update(value).digest("hex");
  const record = stringsStore.get(hash);
  if (!record) {
    return res.status(404).json({ error: "String not found" });
  }
  res.json(record);
});

// GET /strings - get all strings with optional filters
app.get("/strings", (req, res) => {
  let results = Array.from(stringsStore.values());

  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  if (is_palindrome !== undefined) {
    const boolValue = is_palindrome === "true";
    results = results.filter((r) => r.properties.is_palindrome === boolValue);
  }
  if (min_length !== undefined) {
    results = results.filter(
      (r) => r.properties.length >= parseInt(min_length, 10)
    );
  }
  if (max_length !== undefined) {
    results = results.filter(
      (r) => r.properties.length <= parseInt(max_length, 10)
    );
  }
  if (word_count !== undefined) {
    results = results.filter(
      (r) => r.properties.word_count === parseInt(word_count, 10)
    );
  }
  if (contains_character !== undefined) {
    results = results.filter((r) => r.value.includes(contains_character));
  }

  res.json({
    data: results,
    count: results.length,
    filters_applied: req.query,
  });
});

// DELETE /strings/:value - delete string
app.delete("/strings/:value", (req, res) => {
  const { value } = req.params;
  const hash = crypto.createHash("sha256").update(value).digest("hex");
  if (!stringsStore.has(hash)) {
    return res.status(404).json({ error: "String not found" });
  }
  stringsStore.delete(hash);
  res.status(204).send();
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
