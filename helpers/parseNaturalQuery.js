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

module.exports = parseNaturalQuery;
