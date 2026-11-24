// Script npm « prepare » : active les hooks versionnés dans .githooks.
import { fileURLToPath } from "node:url";
import { installHooks } from "./lib/install-hooks.mjs";

installHooks(fileURLToPath(new URL("..", import.meta.url)));
