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

module.exports = applyFilters;
