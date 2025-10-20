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

// In-memory store
const stringsStore = new Map();

// Helper: Analyze string
function analyzeString(value) {
  const lower = value.toLowerCase();
  const length = value.length;
  const is_palindrome = lower === lower.split("").reverse().join("");
  const unique_characters = new Set(value).size;
  const word_count = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");
  const character_frequency_map = {};
  for (const ch of value) {
    character_frequency_map[ch] = (character_frequency_map[ch] || 0) + 1;
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

// Helper: Apply filters
function applyFilters(data, filters) {
  let results = data;
  if (filters.is_palindrome !== undefined) {
    results = results.filter(
      (r) => r.properties.is_palindrome === filters.is_palindrome
    );
  }
  if (filters.min_length !== undefined) {
    results = results.filter((r) => r.properties.length >= filters.min_length);
  }
  if (filters.max_length !== undefined) {
    results = results.filter((r) => r.properties.length <= filters.max_length);
  }
  if (filters.word_count !== undefined) {
    results = results.filter(
      (r) => r.properties.word_count === filters.word_count
    );
  }
  if (filters.contains_character !== undefined) {
    results = results.filter((r) =>
      r.value.toLowerCase().includes(filters.contains_character.toLowerCase())
    );
  }
  return results;
}

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Backend Wizards Stage 1 API");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /me
app.get("/me", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: response.data?.fact || "No cat fact available",
    });
  } catch (error) {
    res.json({
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: "Unable to fetch a cat fact at the moment",
    });
  }
});

// GET /strings/filter-by-natural-language
app.get("/strings/filter-by-natural-language", (req, res) => {
  const query = req.query.query;
  if (!query)
    return res.status(400).json({ error: "Missing 'query' parameter" });

  try {
    const parsedFilters = parseNaturalQuery(query);
    const results = applyFilters(
      Array.from(stringsStore.values()),
      parsedFilters
    );

    res.json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error) {
    const message =
      error.message === "Unable to parse query"
        ? "Unable to parse natural language query"
        : "Query parsed but resulted in conflicting filters";
    res
      .status(error.message === "Unable to parse query" ? 400 : 422)
      .json({ error: message });
  }
});

// POST /strings
app.post("/strings", (req, res) => {
  const { value } = req.body;
  if (typeof value !== "string")
    return res.status(422).json({ error: "Value must be a string" });
  if (!value.trim())
    return res.status(400).json({ error: "Missing 'value' field" });

  const props = analyzeString(value);
  if (stringsStore.has(props.sha256_hash))
    return res.status(409).json({ error: "String already exists" });

  const record = {
    id: props.sha256_hash,
    value,
    properties: props,
    created_at: new Date().toISOString(),
  };
  stringsStore.set(props.sha256_hash, record);
  res.status(201).json(record);
});

// GET /strings/:value
app.get("/strings/:value", (req, res) => {
  const hash = crypto
    .createHash("sha256")
    .update(req.params.value)
    .digest("hex");
  const record = stringsStore.get(hash);
  if (!record) return res.status(404).json({ error: "String not found" });
  res.json(record);
});

// GET /strings with filters
app.get("/strings", (req, res) => {
  let results = Array.from(stringsStore.values());
  const filters = {};

  try {
    if (req.query.is_palindrome !== undefined) {
      filters.is_palindrome = req.query.is_palindrome === "true";
    }
    if (req.query.min_length)
      filters.min_length = parseInt(req.query.min_length);
    if (req.query.max_length)
      filters.max_length = parseInt(req.query.max_length);
    if (req.query.word_count)
      filters.word_count = parseInt(req.query.word_count);
    if (req.query.contains_character)
      filters.contains_character = req.query.contains_character;

    results = applyFilters(results, filters);
  } catch {
    return res.status(400).json({ error: "Invalid query parameter values" });
  }

  res.json({
    data: results,
    count: results.length,
    filters_applied: req.query,
  });
});

// DELETE /strings/:value
app.delete("/strings/:value", (req, res) => {
  const hash = crypto
    .createHash("sha256")
    .update(req.params.value)
    .digest("hex");
  if (!stringsStore.has(hash))
    return res.status(404).json({ error: "String not found" });
  stringsStore.delete(hash);
  res.status(204).send();
});

// Helper: parse natural language
function parseNaturalQuery(query) {
  const text = query.toLowerCase();
  const filters = {};

  if (text.includes("palindrome")) filters.is_palindrome = true;
  if (text.includes("non-palindrome")) filters.is_palindrome = false;

  if (text.includes("single word")) filters.word_count = 1;
  if (text.match(/(\d+)\s+word/)) {
    filters.word_count = parseInt(text.match(/(\d+)\s+word/)[1]);
  }

  if (text.includes("longer than")) {
    const num = parseInt(text.match(/longer than (\d+)/)?.[1]);
    if (!isNaN(num)) filters.min_length = num + 1;
  }
  if (text.includes("shorter than")) {
    const num = parseInt(text.match(/shorter than (\d+)/)?.[1]);
    if (!isNaN(num)) filters.max_length = num - 1;
  }

  if (text.includes("contain") || text.includes("containing")) {
    const match =
      text.match(/contain(?:ing)? the letter (\w)/) ||
      text.match(/contain(?:ing)? (\w)/);
    if (match) filters.contains_character = match[1];
  }

  if (Object.keys(filters).length === 0)
    throw new Error("Unable to parse query");
  return filters;
}

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
