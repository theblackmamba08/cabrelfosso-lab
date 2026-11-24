// Compile le site, le sert avec le vrai Worker (wrangler dev) sur un port libre,
// lance les tests d'intégration, puis arrête le serveur.
import { spawn } from "node:child_process";
import { constants } from "node:os";
import { fileURLToPath } from "node:url";
import {
  findFreePort,
  resolvePort,
  runIntegration,
  waitForReady,
} from "./lib/integration-run.mjs";
import { sendStop, stopProcessTree, treeOptions } from "./lib/process-tree.mjs";

const SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP", "SIGPIPE", "SIGBREAK"];

const root = fileURLToPath(new URL("..", import.meta.url));
const port = process.env.PORT ? resolvePort(process.env.PORT) : await findFreePort();
const runningPids = new Set();
let interrupted = false;

// `npx` est un fichier .cmd sous Windows : il ne se lance que via un shell.
function launch(command, options) {
  const child = spawn(command, {
    cwd: root,
    shell: true,
    ...treeOptions(),
    ...options,
  });
  runningPids.add(child.pid);
  return child;
}

function runToEnd(command, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = launch(command, {
      env,
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      runningPids.delete(child.pid);
      resolve(code ?? 1);
    });
  });
}

function startServer() {
  const child = launch(`npx wrangler dev --port ${port}`, {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  let exited = false;
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  child.once("exit", () => (exited = true));

  return {
    waitUntilReady: () =>
      waitForReady({
        isReady: () => output.includes("Ready on"),
        hasExited: () => exited,
      }),
    output: () => output,
    stop: async () => {
      await stopProcessTree(child.pid);
      runningPids.delete(child.pid);
    },
  };
}

async function interrupt(signal) {
  if (interrupted) return;
  interrupted = true;
  await Promise.all([...runningPids].map((pid) => stopProcessTree(pid)));
  process.exit(128 + constants.signals[signal]);
}

for (const signal of SIGNALS) {
  if (signal in constants.signals) process.on(signal, () => interrupt(signal));
}

// Dernier filet en cas d'erreur imprévue : `exit` n'accepte que du synchrone.
process.on("exit", () => {
  for (const pid of runningPids) sendStop(pid, { force: true });
});

try {
  const code = await runIntegration({
    build: () => runToEnd("npm run build"),
    startServer,
    runTests: () =>
      runToEnd("npx vitest run --config vitest.integration.config.mts", {
        ...process.env,
        TEST_SITE_URL: `http://localhost:${port}`,
      }),
    report: (message) => console.error(message),
  });
  if (!interrupted) process.exit(code);
} catch (error) {
  console.error(error);
  if (!interrupted) process.exit(1);
}
