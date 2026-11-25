import { buttonClassName, type ButtonVariant } from "@/components/ui/button";

/**
 * Bouton qui garde le focus quand il devient indisponible : `aria-disabled` et non `disabled`,
 * car « Arrêter » ou « Effacer » se désactivent juste après le clic.
 */
export function ActionButton({
  variant = "outline",
  unavailable = false,
  onPress,
  children,
}: {
  variant?: ButtonVariant;
  unavailable?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-disabled={unavailable || undefined}
      onClick={unavailable ? undefined : onPress}
      className={`${buttonClassName(variant)} aria-disabled:cursor-not-allowed aria-disabled:opacity-60`}
    >
      {children}
    </button>
  );
}
