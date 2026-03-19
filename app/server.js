const express = require("express");
const client = require("prom-client");

function createApp() {
  const app = express();

  // Use um Registry dedicado para que metricas nao sejam duplicadas em testes
  // (ou em reinicializacoes do app dentro do mesmo processo).
  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  // rota principal
  app.get("/", (req, res) => {
    res.send("Hello DevOpssss");
  });

  // rota de metricas (essencial para Prometheus/ServiceMonitor)
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
  });
}

module.exports = { createApp };