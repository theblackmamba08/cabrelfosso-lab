import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "border-accent bg-accent text-on-accent hover:brightness-110",
  outline: "border-line text-ink hover:border-accent hover:text-accent",
  ghost: "border-transparent text-ink hover:bg-accent-soft",
} as const;

export type ButtonVariant = keyof typeof variants;

/** Apparence commune aux liens-boutons et aux vrais boutons : une pilule. */
export function buttonClassName(variant: ButtonVariant) {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-base font-medium no-underline transition-[color,background-color,border-color,filter] ${variants[variant]}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className">;

/**
 * Lien présenté comme un bouton. Navigation interne → <Link> ; fichier, mailto
 * ou site externe → <a> simple (un fichier PDF ne doit pas passer par le routeur).
 */
export function ButtonLink({ href, variant = "outline", children, ...rest }: ButtonLinkProps) {
  const className = buttonClassName(variant);
  const isInternalPage = href.startsWith("/") && !/\.\w+$/.test(href);
  return isInternalPage ? (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

type ButtonProps = {
  variant?: ButtonVariant;
} & ComponentProps<"button">;

/** Vrai bouton (action sur la page), même apparence que ButtonLink. */
export function Button({ variant = "outline", type = "button", className, ...rest }: ButtonProps) {
  const classes = className ? `${buttonClassName(variant)} ${className}` : buttonClassName(variant);
  return <button type={type} className={classes} {...rest} />;
}
