const crypto = require("crypto");

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

module.exports = analyzeString;
