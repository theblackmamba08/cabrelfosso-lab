/**
 * En-tête de section : petite étiquette technique (JetBrains Mono), puis le titre.
 * L'étiquette est facultative : sans texte dans le cahier, il n'y en a pas.
 */
export function SectionHeading({
  id,
  eyebrow,
  level = 2,
  children,
}: {
  id: string;
  eyebrow?: string;
  level?: 2 | 3;
  children: React.ReactNode;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div>
      {eyebrow && <p className="mb-2 font-mono text-sm text-accent">{eyebrow}</p>}
      <Heading id={id} className={level === 2 ? "text-2xl md:text-3xl" : "text-xl"}>
        {children}
      </Heading>
    </div>
  );
}
