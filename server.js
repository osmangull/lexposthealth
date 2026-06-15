const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("LexPostHealth backend is running");
});

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

app.get("/my-ip", async (req, res) => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  res.json(data);
});

// Sadece resmigazete.gov.tr için proxy. SSRF koruması için host whitelist.
app.get("/proxy", async (req, res) => {
  try {
    const target = req.query.url;
    if (!target) return res.status(400).json({ error: "url query param required" });

    let parsed;
    try { parsed = new URL(target); }
    catch { return res.status(400).json({ error: "invalid url" }); }

    if (parsed.hostname !== "www.resmigazete.gov.tr" &&
        parsed.hostname !== "resmigazete.gov.tr") {
      return res.status(403).json({ error: "host not allowed" });
    }

    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
                      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    res.status(response.status);
    const ct = response.headers.get("content-type");
    if (ct) res.set("Content-Type", ct);

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message, name: err.name });
  }
});

app.listen(PORT, () => {
  console.log(`LexPostHealth listening on port ${PORT}`);
});
