import type { CurveRequest } from "./curve-runner";
import { alphaPoint, type AlphaPoint } from "./statistics";

/** Web Worker des courbes : une demande, une valeur de α. */
addEventListener("message", ({ data }: MessageEvent<CurveRequest>) => {
  const { k, satisfiable, total, median } = alphaPoint(data);
  postMessage({ k, satisfiable, total, median } satisfies AlphaPoint);
});
