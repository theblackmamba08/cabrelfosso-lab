import { describe, expect, it } from "vitest";
import { demoReducer, frameSeconds, initialDemo, type DemoState } from "./demo-state";
import { releaseState } from "./motion";

const running = (): DemoState => demoReducer(initialDemo, { type: "release" });

describe("état de départ", () => {
  it("reprend les valeurs de départ de l'annexe C.3, sans démarrer", () => {
    expect(initialDemo).toMatchObject({ pulled: 1, angle: 30, restitution: 1, phase: "ready" });
  });

  it("dessine les billes écartées à leur angle de départ avant « Lâcher »", () => {
    expect(initialDemo.cradle).toEqual(releaseState(1, 30));
  });
});

describe("boutons", () => {
  it("« Lâcher » démarre", () => {
    expect(running().phase).toBe("running");
  });

  it("« Lâcher » repart de la position de départ, même en pleine animation", () => {
    const moved = demoReducer(running(), { type: "frame", seconds: 0.2 });
    const again = demoReducer(moved, { type: "release" });
    expect(again.cradle).toEqual(releaseState(1, 30));
    expect(again.phase).toBe("running");
  });

  it("« Pause » arrête et garde l'état, « Reprendre » repart du même état", () => {
    const moved = demoReducer(running(), { type: "frame", seconds: 0.2 });
    const paused = demoReducer(moved, { type: "togglePause" });
    expect(paused.phase).toBe("paused");
    expect(paused.cradle).toBe(moved.cradle);
    const resumed = demoReducer(paused, { type: "togglePause" });
    expect(resumed.phase).toBe("running");
    expect(resumed.cradle).toBe(moved.cradle);
  });

  it("« Pause » ne fait rien avant « Lâcher »", () => {
    expect(demoReducer(initialDemo, { type: "togglePause" })).toBe(initialDemo);
  });

  it("« Recommencer » remet les billes en position de départ, à l'arrêt", () => {
    const moved = demoReducer(running(), { type: "frame", seconds: 0.2 });
    const reset = demoReducer(moved, { type: "reset" });
    expect(reset.phase).toBe("ready");
    expect(reset.cradle).toEqual(releaseState(1, 30));
  });
});

describe("images", () => {
  it("fait avancer les billes pendant l'animation", () => {
    const moved = demoReducer(running(), { type: "frame", seconds: 0.1 });
    expect(moved.cradle.angles[0]).toBeGreaterThan(initialDemo.cradle.angles[0]);
  });

  it("ignore une image arrivée après la pause", () => {
    const paused = demoReducer(running(), { type: "togglePause" });
    expect(demoReducer(paused, { type: "frame", seconds: 0.1 })).toBe(paused);
  });

  it("ignore une image avant « Lâcher »", () => {
    expect(demoReducer(initialDemo, { type: "frame", seconds: 0.1 })).toBe(initialDemo);
  });
});

describe("réglages", () => {
  it("met à jour la position de départ avant « Lâcher »", () => {
    const state = demoReducer(initialDemo, { type: "adjust", settings: { pulled: 3 } });
    expect(state.pulled).toBe(3);
    expect(state.cradle).toEqual(releaseState(3, 30));
  });

  it.each([
    [{ pulled: 2 }, releaseState(2, 30)],
    [{ angle: 40 }, releaseState(1, 40)],
    [{ restitution: 0.8 }, releaseState(1, 30)],
  ])("%j pendant l'animation la remet en position de départ", (settings, expected) => {
    const moved = demoReducer(running(), { type: "frame", seconds: 0.2 });
    const state = demoReducer(moved, { type: "adjust", settings });
    expect(state.phase).toBe("ready");
    expect(state.cradle).toEqual(expected);
    expect(state).toMatchObject(settings);
  });

  it("remet aussi une animation en pause en position de départ", () => {
    const paused = demoReducer(running(), { type: "togglePause" });
    expect(demoReducer(paused, { type: "adjust", settings: { angle: 20 } }).phase).toBe("ready");
  });
});

describe("frameSeconds : temps simulé pour une image", () => {
  it("convertit le temps écoulé en secondes", () => {
    expect(frameSeconds(16, false)).toBeCloseTo(0.016, 12);
  });

  it("divise le temps par 10 au ralenti", () => {
    expect(frameSeconds(16, true)).toBeCloseTo(0.0016, 12);
  });

  it("borne une image très longue : les billes ne sautent pas", () => {
    expect(frameSeconds(5000, false)).toBe(0.1);
    expect(frameSeconds(5000, true)).toBeCloseTo(0.01, 12);
  });
});
