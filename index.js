const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Basic health check route (optional for /healthz)
app.get("/", (req, res) => {
  res.send("Lyra Action Gateway is running!");
});

app.post("/make-scenario", async (req, res) => {
  const { blueprint } = req.body;
  if (!blueprint) {
    return res.status(400).json({ error: "Missing scenario blueprint" });
  }
  try {
    const response = await axios.post(
      "https://api.make.com/v2/scenarios",
      blueprint,
      {
        headers: {
          "Authorization": `Bearer ${process.env.MAKE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({ scenarioId: response.data.id, ...response.data });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lyra Action Gateway running on port ${PORT}`));
