const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const { createApp } = require("../server");

async function withServer(fn) {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    return await fn({ port });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("GET / returns 200 and hello message", async () => {
  await withServer(async ({ port }) => {
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(res.status, 200);

    const text = await res.text();
    assert.match(text, /Hello DevOpssss/);
  });
});


test("GET /metrics returns Prometheus text format", async () => {
  await withServer(async ({ port }) => {
    const res = await fetch(`http://127.0.0.1:${port}/metrics`);
    assert.equal(res.status, 200);

    const contentType = res.headers.get("content-type") || "";
    assert.match(contentType, /text\/plain/i);

    const body = await res.text();
    assert.match(body, /process_cpu_user_seconds_total|process_cpu_seconds_total/);
  });
});