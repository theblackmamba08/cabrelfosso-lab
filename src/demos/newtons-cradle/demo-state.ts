import { advance, releaseState, type Cradle } from "./motion";

export type Settings = { pulled: number; angle: number; restitution: number };

export type DemoState = Settings & {
  phase: "ready" | "running" | "paused";
  cradle: Cradle;
};

export type DemoAction =
  | { type: "release" | "togglePause" | "reset" }
  | { type: "frame"; seconds: number }
  | { type: "adjust"; settings: Partial<Settings> };

/** Une image ne fait jamais avancer le temps de plus de 100 ms, même après un long blocage. */
const longestFrame = 100;
const slowMotion = 0.1;

/** Temps simulé pour une image, à partir du temps écoulé en millisecondes. */
export function frameSeconds(elapsed: number, slow: boolean): number {
  return (Math.min(elapsed, longestFrame) / 1000) * (slow ? slowMotion : 1);
}

function atStart({ pulled, angle, restitution }: Settings): DemoState {
  return {
    pulled,
    angle,
    restitution,
    phase: "ready",
    cradle: releaseState(pulled, angle),
  };
}

export const initialDemo = atStart({ pulled: 1, angle: 30, restitution: 1 });

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "release":
      return { ...atStart(state), phase: "running" };
    case "togglePause":
      if (state.phase === "ready") return state;
      return { ...state, phase: state.phase === "running" ? "paused" : "running" };
    case "reset":
      return atStart(state);
    case "adjust":
      return atStart({ ...state, ...action.settings });
    case "frame":
      if (state.phase !== "running") return state;
      return { ...state, cradle: advance(state.cradle, action.seconds, state.restitution) };
  }
}
