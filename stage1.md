# Stage 1 — String Analyzer Service

## Description

The String Analyzer API processes strings, computes their properties, and stores results in memory.  
Properties include length, palindrome status, unique characters, word count, hash, and character frequency.

## Endpoints

### 1. Create/Analyze String

`POST /strings`

**Request Body**

```json
{
  "value": "racecar"
}
```

**Response (201 Created)**

```json
{
  "id": "e2c569be17396eca2a2e3c11578123ed",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "e2c569be17396eca2a2e3c11578123ed",
    "character_frequency_map": { "r": 2, "a": 2, "c": 2, "e": 1 }
  },
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Error Responses**

- 400: Missing "value" field
- 409: String already exists
- 422: Invalid type for "value"

### 2. Get Specific String

`GET /strings/{string_value}`

**Example**

```
GET /strings/racecar
```

**Response (200 OK)**

```json
{
  "id": "e2c569be17396eca2a2e3c11578123ed",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "e2c569be17396eca2a2e3c11578123ed",
    "character_frequency_map": { "r": 2, "a": 2, "c": 2, "e": 1 }
  },
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Error Response**

- 404: String not found

### 3. Get All Strings with Filters

`GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`

**Response**

```json
{
  "data": [
    {
      "id": "hash123",
      "value": "madam anna",
      "properties": {
        /* ... */
      },
      "created_at": "2025-10-20T10:00:00Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

**Error Response**

- 400: Invalid query parameters

### 4. Delete String

`DELETE /strings/{string_value}`

**Response**

- 204 No Content
- 404 Not Found

## Setup

1. Clone repo:

```bash
git clone https://github.com/dev-enoch/HNG-Internship.git
cd HNG-Internship
```

2. Install dependencies:

```bash
npm install
```

3. Optional `.env` file:

```
PORT=3000
```

4. Run server:

```bash
npm start
```

## Testing

- Use Postman or curl for `/strings` endpoints.
- Verify responses, duplicate handling, validation, and deletion.

[Back to main README](README.md)
