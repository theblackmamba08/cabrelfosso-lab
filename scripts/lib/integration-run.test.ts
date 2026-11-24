import { describe, expect, it } from "vitest";
import {
  findFreePort,
  resolvePort,
  runIntegration,
  waitForReady,
} from "./integration-run.mjs";

describe("resolvePort", () => {
  it("prend 8787 par défaut", () => {
    expect(resolvePort(undefined)).toBe(8787);
    expect(resolvePort("")).toBe(8787);
  });

  it("accepte un port valide", () => {
    expect(resolvePort("9000")).toBe(9000);
  });

  it.each(["abc", "0", "65536", "80; rm -rf /", "12.5"])(
    "refuse la valeur %s",
    (value) => {
      expect(() => resolvePort(value)).toThrow(/PORT/);
    },
  );
});

describe("waitForReady", () => {
  const noSleep = async () => {};

  it("répond ready dès que le serveur s'annonce", async () => {
    let checks = 0;
    const status = await waitForReady({
      isReady: () => ++checks === 3,
      hasExited: () => false,
      sleep: noSleep,
    });
    expect(status).toBe("ready");
    expect(checks).toBe(3);
  });

  it("répond exited si le serveur s'arrête avant d'être prêt", async () => {
    const status = await waitForReady({
      isReady: () => false,
      hasExited: () => true,
      sleep: noSleep,
    });
    expect(status).toBe("exited");
  });

  it("répond timeout après 120 tentatives espacées d'une seconde", async () => {
    const pauses: number[] = [];
    const status = await waitForReady({
      isReady: () => false,
      hasExited: () => false,
      sleep: async (ms: number) => {
        pauses.push(ms);
      },
    });
    expect(status).toBe("timeout");
    expect(pauses).toHaveLength(120);
    expect(new Set(pauses)).toEqual(new Set([1000]));
  });

  it("retient un démarrage survenu pendant la dernière attente", async () => {
    let pauses = 0;
    const status = await waitForReady({
      isReady: () => pauses === 120,
      hasExited: () => false,
      sleep: async () => {
        pauses += 1;
      },
    });
    expect(status).toBe("ready");
  });
});

function scenario({
  buildCode = 0,
  readiness = "ready",
  testCode = 0,
  testError = undefined as Error | undefined,
} = {}) {
  const steps: string[] = [];
  const reports: string[] = [];
  const run = () =>
    runIntegration({
      build: async () => {
        steps.push("build");
        return buildCode;
      },
      startServer: () => {
        steps.push("start");
        return {
          waitUntilReady: async () => {
            steps.push("wait");
            return readiness;
          },
          output: () => "journal du serveur",
          stop: async () => {
            steps.push("stop");
          },
        };
      },
      runTests: async () => {
        steps.push("tests");
        if (testError) throw testError;
        return testCode;
      },
      report: (message: string) => reports.push(message),
    });
  return { run, steps, reports };
}

describe("runIntegration", () => {
  it("enchaîne build, démarrage, attente, tests et arrêt", async () => {
    const { run, steps } = scenario();
    await expect(run()).resolves.toBe(0);
    expect(steps).toEqual(["build", "start", "wait", "tests", "stop"]);
  });

  it("ne démarre pas le serveur si le build échoue", async () => {
    const { run, steps } = scenario({ buildCode: 3 });
    await expect(run()).resolves.toBe(3);
    expect(steps).toEqual(["build"]);
  });

  it("transmet le code de sortie des tests et arrête le serveur", async () => {
    const { run, steps } = scenario({ testCode: 2 });
    await expect(run()).resolves.toBe(2);
    expect(steps.at(-1)).toBe("stop");
  });

  it("arrête le serveur si les tests lèvent une erreur", async () => {
    const { run, steps } = scenario({ testError: new Error("boum") });
    await expect(run()).rejects.toThrow("boum");
    expect(steps.at(-1)).toBe("stop");
  });

  it("affiche le journal et arrête le serveur s'il meurt au démarrage", async () => {
    const { run, steps, reports } = scenario({ readiness: "exited" });
    await expect(run()).resolves.toBe(1);
    expect(reports).toEqual(["journal du serveur"]);
    expect(steps).toEqual(["build", "start", "wait", "stop"]);
  });

  it("signale un serveur qui ne démarre pas à temps", async () => {
    const { run, steps, reports } = scenario({ readiness: "timeout" });
    await expect(run()).resolves.toBe(1);
    expect(reports).toEqual([
      "journal du serveur",
      "Le serveur n’a pas démarré.",
    ]);
    expect(steps).toEqual(["build", "start", "wait", "stop"]);
  });
});

describe("findFreePort", () => {
  it("donne un port utilisable", async () => {
    const port = await findFreePort();
    expect(resolvePort(String(port))).toBe(port);
  });
});
