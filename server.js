const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rg-test", async (req, res) => {
  try {
    const response = await fetch("https://www.resmigazete.gov.tr");
    const text = await response.text();
    res.json({
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      server: response.headers.get("server"),
      bodyStart: text.substring(0, 300),
      bodyLength: text.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message, name: err.name });
  }
});
