import { flightTime, type Launch } from "./physics";

/** Une animation ne dure jamais plus longtemps, quelle que soit la durée du vol. */
const longestAnimation = 3000;

/** Durée de l'animation en millisecondes : le temps réel, ramené à 3 secondes au plus. */
export function animationDuration(launch: Launch): number {
  return Math.min(flightTime(launch) * 1000, longestAnimation);
}

/** Part du vol parcourue après `elapsed` millisecondes, de 0 à 1. */
export function launchProgress(elapsed: number, duration: number): number {
  return duration === 0 ? 1 : Math.min(elapsed / duration, 1);
}
