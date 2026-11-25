import { describe, expect, it } from "vitest";
import { CurveRunner, type CurveRequest, type WorkerLike } from "./curve-runner";
import { alphaCount } from "./puzzle";
import { initialRun, runReducer, shownCurves, type RunAction } from "./run-state";
import type { AlphaPoint } from "./statistics";

const point = (k: number): AlphaPoint => ({ k, satisfiable: 10, total: 20, median: k + 1 });

const message = (k: number) => ({ data: point(k) }) as MessageEvent<AlphaPoint>;

class FakeWorker implements WorkerLike {
  requests: CurveRequest[] = [];
  terminated = false;
  onmessage: WorkerLike["onmessage"] = null;
  onerror: WorkerLike["onerror"] = null;
  postMessage(request: CurveRequest) {
    this.requests.push(request);
  }
  terminate() {
    this.terminated = true;
  }
  /** Répond à la dernière demande. */
  answer() {
    this.onmessage?.(message(this.requests.at(-1)!.k));
  }
}

function setup() {
  const workers: FakeWorker[] = [];
  const points: number[] = [];
  let failures = 0;
  const runner = new CurveRunner(
    () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker;
    },
    { onPoint: ({ k }) => points.push(k), onError: () => failures++ },
  );
  return { workers, points, runner, failures: () => failures };
}

const settings = { seed: 2026, n: 40, puzzles: 20 } as const;

describe("CurveRunner (dialogue avec le Web Worker)", () => {
  it("ne crée aucun Worker avant « Lancer »", () => {
    expect(setup().workers).toHaveLength(0);
  });

  it("demande une valeur de α à la fois, jusqu'à la dernière, puis termine le Worker", () => {
    const { workers, points, runner } = setup();
    runner.start(settings);
    const [worker] = workers;
    expect(worker.requests).toEqual([{ ...settings, k: 0 }]);
    for (let k = 0; k < alphaCount; k++) {
      expect(worker.requests).toHaveLength(k + 1);
      expect(worker.terminated).toBe(false);
      worker.answer();
    }
    expect(points).toEqual(Array.from({ length: alphaCount }, (_, k) => k));
    expect(worker.requests).toHaveLength(alphaCount);
    expect(worker.terminated).toBe(true);
  });

  it("Pause : la valeur en cours se termine, la suivante n'est pas demandée avant Reprendre", () => {
    const { workers, points, runner } = setup();
    runner.start(settings);
    runner.pause();
    workers[0].answer();
    expect(points).toEqual([0]);
    expect(workers[0].requests).toHaveLength(1);
    runner.resume();
    expect(workers[0].requests.map(({ k }) => k)).toEqual([0, 1]);
  });

  it("Pause puis Reprendre avant la fin de la valeur : aucune demande en double", () => {
    const { workers, runner } = setup();
    runner.start(settings);
    runner.pause();
    runner.resume();
    expect(workers[0].requests).toHaveLength(1);
    workers[0].answer();
    expect(workers[0].requests.map(({ k }) => k)).toEqual([0, 1]);
  });

  it("Pause pendant la dernière valeur : le calcul se termine quand même", () => {
    const { workers, points, runner } = setup();
    runner.start(settings);
    for (let k = 0; k < alphaCount - 1; k++) workers[0].answer();
    runner.pause();
    workers[0].answer();
    expect(points).toHaveLength(alphaCount);
    expect(workers[0].terminated).toBe(true);
  });

  it("Arrêter termine le Worker ; une réponse tardive est ignorée ; le calcul suivant a un nouveau Worker", () => {
    const { workers, points, runner } = setup();
    runner.start(settings);
    const late = workers[0].onmessage;
    runner.stop();
    expect(workers[0].terminated).toBe(true);
    late?.(message(0));
    expect(points).toEqual([]);
    runner.start(settings);
    expect(workers).toHaveLength(2);
    expect(workers[1].requests).toEqual([{ ...settings, k: 0 }]);
  });

  it("une erreur du Worker le termine et le signale", () => {
    const { workers, runner, failures } = setup();
    runner.start(settings);
    workers[0].onerror?.({} as ErrorEvent);
    expect(workers[0].terminated).toBe(true);
    expect(failures()).toBe(1);
  });
});

describe("état du calcul", () => {
  const play = (...actions: RunAction[]) => actions.reduce(runReducer, initialRun);
  const start = (n: 20 | 40 = 40): RunAction => ({ type: "start", settings: { ...settings, n } });
  const points = (count: number): RunAction[] =>
    Array.from({ length: count }, (_, k) => ({ type: "point", point: point(k) }));
  const complete = (n: 20 | 40 = 40) => [start(n), ...points(alphaCount)];

  it("au départ : rien de calculé, aucune annonce", () => {
    expect(initialRun).toMatchObject({ status: "idle", run: null, curves: [], notice: null });
    expect(shownCurves(initialRun)).toEqual([]);
  });

  it("la courbe se dessine au fur et à mesure, sans annonce", () => {
    const state = play(start(), ...points(3));
    expect(state.status).toBe("running");
    expect(state.notice).toBeNull();
    expect(shownCurves(state)).toMatchObject([{ n: 40, points: [{ k: 0 }, { k: 1 }, { k: 2 }] }]);
  });

  it("la dernière valeur termine le calcul et l'annonce", () => {
    const state = play(...complete());
    expect(state.status).toBe("idle");
    expect(state.notice).toEqual({ kind: "done", n: 40, total: 520 });
    expect(state.curves).toHaveLength(1);
    expect(state.run).toBeNull();
  });

  it("pause et reprise", () => {
    expect(play(start(), { type: "pause" }).status).toBe("paused");
    expect(play(start(), { type: "pause" }, ...points(1)).status).toBe("paused");
    expect(play(start(), { type: "pause" }, { type: "resume" }).status).toBe("running");
    expect(play({ type: "pause" }).status).toBe("idle");
  });

  it("un nouveau départ efface l'annonce précédente", () => {
    expect(play(...complete(), start(20)).notice).toBeNull();
  });

  it("arrêt : la courbe partielle est retirée, les autres restent", () => {
    const state = play(...complete(20), start(40), ...points(5), { type: "stop" });
    expect(state.status).toBe("idle");
    expect(state.notice).toEqual({ kind: "stopped" });
    expect(shownCurves(state).map(({ n }) => n)).toEqual([20]);
  });

  it("relancer un n remplace sa courbe", () => {
    const again = play(...complete(40), ...complete(20), start(40), ...points(2));
    expect(shownCurves(again).map((curve) => [curve.n, curve.points.length])).toEqual([
      [20, alphaCount],
      [40, 2],
    ]);
    expect(play(...complete(40), ...complete(40)).curves).toHaveLength(1);
  });

  it("effacer retire toutes les courbes et l'annonce", () => {
    expect(play(...complete(40), ...complete(20), { type: "clear" })).toEqual(initialRun);
  });

  it("les courbes sont rangées par n", () => {
    expect(play(...complete(40), ...complete(20)).curves.map(({ n }) => n)).toEqual([20, 40]);
  });
});
