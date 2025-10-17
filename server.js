const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const PROFILE = {
  email: "mail@enochphilip.site",
  name: "Enoch Philip Dibal",
  stack: "Node.js/Express",
};

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

    const result = {
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: catFact,
    };

    res.json(result);
  } catch (error) {
    const fallbackResult = {
      status: "success",
      user: PROFILE,
      timestamp: new Date().toISOString(),
      fact: "Unable to fetch a cat fact at the moment",
    };
    console.log("Error fetching cat fact:", error.message);
    res.json(fallbackResult);
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
