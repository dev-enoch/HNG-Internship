# Stage 0 — Profile and Cat Fact

## Description

This stage implements `/me` endpoint returning profile information and a random cat fact.

## Endpoint

`GET /me`

### Example Response

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

## Testing

- Visit `/me` in your browser or via Postman.
- Check that profile and cat fact are returned correctly.

[Back to main README](README.md)
