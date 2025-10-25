const express = require("express");
const crypto = require("crypto");
const stringsStore = require("../helpers/stringsStore");
const analyzeString = require("../helpers/analyzeString");
const applyFilters = require("../helpers/filters");
const parseNaturalQuery = require("../helpers/parseNaturalQuery");

const router = express.Router();

router.post("/strings", (req, res) => {
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

router.get("/strings/:value", (req, res) => {
  const hash = crypto
    .createHash("sha256")
    .update(req.params.value)
    .digest("hex");
  const record = stringsStore.get(hash);
  if (!record) return res.status(404).json({ error: "String not found" });
  res.json(record);
});

router.get("/strings", (req, res) => {
  let results = Array.from(stringsStore.values());
  const filters = {};

  try {
    if (req.query.is_palindrome !== undefined)
      filters.is_palindrome = req.query.is_palindrome === "true";
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

router.delete("/strings/:value", (req, res) => {
  const hash = crypto
    .createHash("sha256")
    .update(req.params.value)
    .digest("hex");
  if (!stringsStore.has(hash))
    return res.status(404).json({ error: "String not found" });
  stringsStore.delete(hash);
  res.status(204).send();
});

router.get("/strings/filter-by-natural-language", (req, res) => {
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
      interpreted_query: { original: query, parsed_filters: parsedFilters },
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

module.exports = router;
