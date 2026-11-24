// Appelé par .githooks/pre-push : Git décrit l'envoi prévu sur l'entrée standard.
import { readFileSync } from "node:fs";
import { findProtectedPushes, refusalMessage } from "./lib/pre-push-policy.mjs";

if (findProtectedPushes(readFileSync(0, "utf8")).length > 0) {
  console.error(refusalMessage());
  process.exit(1);
}
