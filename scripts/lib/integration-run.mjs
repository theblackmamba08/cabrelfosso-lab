/** Logique du test d'intégration, sans processus réel : voir scripts/integration.mjs. */
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_PORT = 8787;

export function resolvePort(value) {
  if (!value) return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`PORT invalide : ${value}`);
  }
  return port;
}

/** Port libre, choisi par le système. */
export function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

export async function waitForReady({
  isReady,
  hasExited,
  attempts = 120,
  intervalMs = 1_000,
  sleep = (ms) => delay(ms),
}) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (isReady()) return "ready";
    if (hasExited()) return "exited";
    await sleep(intervalMs);
  }
  return isReady() ? "ready" : "timeout";
}

export async function runIntegration({ build, startServer, runTests, report }) {
  const buildCode = await build();
  if (buildCode !== 0) return buildCode;

  const server = startServer();
  try {
    const readiness = await server.waitUntilReady();
    if (readiness === "ready") return await runTests();

    report(server.output());
    if (readiness === "timeout") report("Le serveur n’a pas démarré.");
    return 1;
  } finally {
    await server.stop();
  }
}
