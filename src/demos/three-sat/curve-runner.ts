import { alphaCount } from "./puzzle";
import type { AlphaPoint } from "./statistics";

export type RunSettings = { seed: number; n: number; puzzles: number };

/** Demande au Worker : une valeur de α (indice k). */
export type CurveRequest = RunSettings & { k: number };

/** Ce que le calcul utilise d'un Worker ; les tests en donnent un faux. */
export type WorkerLike = {
  onmessage: ((event: MessageEvent<AlphaPoint>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage: (request: CurveRequest) => void;
  terminate: () => void;
};

/**
 * Calcul d'une courbe dans un Web Worker : une valeur de α demandée à la fois, si bien que « Pause »
 * prend effet à la fin de la valeur en cours. « Arrêter » termine le Worker ; chaque calcul a le sien.
 */
export class CurveRunner {
  private worker: WorkerLike | null = null;
  private settings: RunSettings | null = null;
  private next = 0;
  private waiting = false;
  private paused = false;

  constructor(
    private readonly createWorker: () => WorkerLike,
    private readonly events: { onPoint: (point: AlphaPoint) => void; onError: () => void },
  ) {}

  start(settings: RunSettings) {
    this.stop();
    const worker = this.createWorker();
    this.worker = worker;
    this.settings = settings;
    worker.onmessage = ({ data }) => {
      // Réponse d'un Worker déjà arrêté.
      if (this.worker !== worker) return;
      this.waiting = false;
      this.next = data.k + 1;
      if (this.next === alphaCount) this.stop();
      this.events.onPoint(data);
      this.request();
    };
    worker.onerror = () => {
      if (this.worker !== worker) return;
      this.stop();
      this.events.onError();
    };
    this.request();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.request();
  }

  stop() {
    this.worker?.terminate();
    this.worker = null;
    this.settings = null;
    this.next = 0;
    this.waiting = false;
    this.paused = false;
  }

  private request() {
    if (!this.worker || !this.settings || this.waiting || this.paused) return;
    this.waiting = true;
    this.worker.postMessage({ ...this.settings, k: this.next });
  }
}
