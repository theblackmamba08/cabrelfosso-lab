import type { RunSettings } from "./curve-runner";
import type { CurveData } from "./format";
import { alphaCount } from "./puzzle";
import type { AlphaPoint } from "./statistics";

/** Annonce aux lecteurs d'écran : seulement à la fin ou à l'arrêt. */
export type Notice = { kind: "done"; n: number; total: number } | { kind: "stopped" };

export type RunState = {
  status: "idle" | "running" | "paused";
  run: (CurveData & { puzzles: number }) | null;
  /** Courbes complètes, rangées par n. */
  curves: readonly CurveData[];
  notice: Notice | null;
};

export type RunAction =
  | { type: "start"; settings: RunSettings }
  | { type: "point"; point: AlphaPoint }
  | { type: "pause" | "resume" | "stop" | "clear" };

export const initialRun: RunState = { status: "idle", run: null, curves: [], notice: null };

const withCurve = (curves: readonly CurveData[], curve: CurveData) =>
  [...curves.filter(({ n }) => n !== curve.n), { n: curve.n, points: curve.points }].sort((a, b) => a.n - b.n);

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case "start": {
      const { n, puzzles } = action.settings;
      return { ...state, status: "running", run: { n, puzzles, points: [] }, notice: null };
    }
    case "point": {
      if (!state.run) return state;
      const run = { ...state.run, points: [...state.run.points, action.point] };
      if (run.points.length < alphaCount) return { ...state, run };
      return {
        status: "idle",
        run: null,
        curves: withCurve(state.curves, run),
        notice: { kind: "done", n: run.n, total: alphaCount * run.puzzles },
      };
    }
    case "pause":
      return state.run ? { ...state, status: "paused" } : state;
    case "resume":
      return state.run ? { ...state, status: "running" } : state;
    case "stop":
      return state.run ? { ...state, status: "idle", run: null, notice: { kind: "stopped" } } : state;
    case "clear":
      return state.run ? state : initialRun;
  }
}

/** Courbes affichées : celle du calcul en cours remplace l'ancienne du même n. */
export function shownCurves({ curves, run }: RunState): readonly CurveData[] {
  return run ? withCurve(curves, run) : curves;
}
