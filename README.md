# Backend Wizards — Stage 0

## Description

This project is a simple RESTful API built with Node.js and Express.  
It exposes a single endpoint `/me` that returns your profile information along with a dynamic cat fact fetched from the [Cat Facts API](https://catfact.ninja/fact).

The response format strictly follows the Stage 0 requirements:

```json
{
  "status": "success",
  "user": {
    "email": "your.email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-15T12:34:56.789Z",
  "fact": "A random cat fact"
}
```

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

3. Create an `.env` file (optional) for environment variables:

```
PORT=3000
```

4. Run the server locally:

```bash
npm start
```

5. Test the endpoint:

Open your browser or Postman at `http://localhost:3000/me`.

## Dependencies

- express
- axios
- cors
- morgan

Install using:

```bash
npm install express axios cors morgan
```

## Environment Variables

- `PORT` (optional): Port number for the server. Defaults to `3000` if not set.

## Testing

- Ensure the server is running.
- Visit `/me` and check that:

  - `status` is `"success"`
  - `user` contains `email`, `name`, and `stack`
  - `timestamp` is current UTC ISO 8601
  - `fact` contains a cat fact from Cat Facts API

- The response content type should be `application/json`.

## Notes

- CORS is enabled for public access.
- Cat Facts API failures are handled gracefully with a fallback message.
- Dynamic timestamps update with every request.

## Deployment

- The project is Railway-ready.
- Railway automatically uses the `start` script in `package.json` for deployment.
- After deployment, the endpoint is accessible at: `https://your-railway-app-url/me`
