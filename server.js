const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rg-test", async (req, res) => {
  try {
    const response = await fetch("https://www.resmigazete.gov.tr");

    res.json({
      status: response.status,
      ok: response.ok
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

app.get("/my-ip", async (req, res) => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      name: err.name
    });
  }
});

app.get("/", (req, res) => {
  res.send("LexPostHealth backend is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});