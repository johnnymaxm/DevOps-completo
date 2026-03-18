const express = require("express");
const client = require("prom-client");

const app = express();

// 🔥 Coleta métricas padrão (CPU, memória, etc)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// rota principal
app.get("/", (req, res) => {
  res.json({ message: "DevOps" });
});

// 📊 rota de métricas (IMPORTANTE)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});