# Backend Wizards — Stage 1

## Description

This project is a RESTful API built with Node.js and Express.
It combines the Stage 0 and Stage 1 tasks of the Backend Wizards program.

The API includes:

1. `/me` endpoint returning profile information and a random cat fact.
2. A String Analyzer Service that analyzes strings, stores their properties, and supports retrieval, filtering, and deletion.

## Stage 0 — Profile and Cat Fact

Endpoint:
`GET /me`

Example Response:

```json
{
  "status": "success",
  "user": {
    "email": "mail@enochphilip.site",
    "name": "Enoch Philip Dibal",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-15T12:34:56.789Z",
  "fact": "A random cat fact"
}
```

## Stage 1 — String Analyzer Service

### Description

The String Analyzer API processes strings, computes their properties, and stores results in memory.
Each analyzed string includes computed metrics such as length, palindrome status, unique character count, word count, hash, and character frequency.

### Computed Properties

- `length`: number of characters in the string
- `is_palindrome`: true if the string reads the same backward and forward (case-insensitive)
- `unique_characters`: number of distinct characters
- `word_count`: number of words separated by spaces
- `sha256_hash`: SHA-256 hash of the string
- `character_frequency_map`: dictionary of character occurrences

### Endpoints

#### 1. Create/Analyze String

`POST /strings`

**Request Body**

```json
{
  "value": "racecar"
}
```

**Success Response (201 Created)**

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

---

#### 2. Get Specific String

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
    /* same as above */
  },
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Error Response**

- 404: String not found

#### 3. Get All Strings with Filters

`GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`

**Example Response**

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

#### 4. Delete String

`DELETE /strings/{string_value}`

**Example**

```
DELETE /strings/racecar
```

**Response**

- 204 No Content
- 404 Not Found

## Setup Instructions

1. Clone the repository:

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

4. Run the server locally:

```bash
npm start
```

5. Test the endpoints:

```
GET http://localhost:3000/me
POST http://localhost:3000/strings
GET http://localhost:3000/strings
DELETE http://localhost:3000/strings/{string_value}
```

## Dependencies

- express
- axios
- cors
- crypto

Install:

```bash
npm install express axios cors
```

## Environment Variables

- `PORT`: Port number (default 3000)

## Testing

**Stage 0**

- Visit `/me` and check for your profile and cat fact.

**Stage 1**

- Use Postman or curl to test `/strings` endpoints.
- Verify responses match required formats.
- Check duplicate handling, validation, and deletion.

## Deployment

- Works on Railway, Render, AWS, or similar platforms.
- Vercel is not allowed.
- App runs using `npm start`.
- After deployment, confirm endpoints respond as expected.
