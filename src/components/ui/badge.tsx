/** Petite étiquette (diplôme, fonction, technologie), sur fond accent-soft. */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
      {children}
    </span>
  );
}
