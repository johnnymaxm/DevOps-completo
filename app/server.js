const express = require("express");
const client = require("prom-client");

const app = express();
const port = 3000;

// 🔥 coleta métricas padrão (CPU, memória, etc)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// rota principal
app.get("/", (req, res) => {
  res.send("Hello DevOpssss 🚀");
});

// 🔥 ROTA DE MÉTRICAS (ESSENCIAL)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});