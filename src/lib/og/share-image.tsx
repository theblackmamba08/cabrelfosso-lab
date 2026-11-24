import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "../../i18n/config";
import { shareImageSize } from "../../i18n/metadata";
import en from "../../i18n/messages/en";
import fr from "../../i18n/messages/fr";
import { instantiate } from "./instance";

/*
 * Image de partage d'une page (1200 × 630), générée au build : fond sombre du site, motif de
 * trajectoire, titre de la page et nom du site en Space Grotesk. Couleurs du thème
 * sombre (src/app/globals.css).
 */
const colors = {
  paper: "#060A14",
  ink: "#E8EDF7",
  inkMuted: "#9AA8C2",
  line: "#22304D",
  accent: "#6EA2FF",
};

const messages = { fr, en };

type Font = { name: string; data: ArrayBuffer; weight: 600; style: "normal" };
let font: Promise<Font> | undefined;

/**
 * Space Grotesk, fichier TTF officiel non modifié (licence SIL OFL 1.1,
 * src/fonts/LICENSE-space-grotesk.txt), source :
 * https://github.com/floriankarsten/space-grotesk/blob/03507d024a01282884232081fc6011c09ff4e849/fonts/ttf/SpaceGrotesk%5Bwght%5D.ttf
 * Le dépôt officiel ne publie pas de SemiBold statique : la police variable est fixée ici à la
 * graisse des titres du site (600), car le générateur ne lit pas les variations.
 * Chargée une seule fois par build.
 */
export function shareImageFont(): Promise<Font> {
  font ??= readFile(join(process.cwd(), "src/fonts/space-grotesk-wght.ttf")).then((file) => {
    const ttf = instantiate(new Uint8Array(file), { wght: 600 });
    return { name: "Space Grotesk", data: ttf.slice().buffer, weight: 600, style: "normal" };
  });
  return font;
}

/** Motif : la trajectoire du projectile (même tracé que la figure du site), et deux traces. */
function Trajectory() {
  return (
    <svg width="480" height="300" viewBox="0 0 400 250" style={{ position: "absolute", right: 56, top: 40 }}>
      <path d="M-40 220 Q120 40 280 220" fill="none" stroke={colors.line} strokeWidth="1.5" />
      <path d="M100 220 Q240 110 380 220" fill="none" stroke={colors.line} strokeWidth="1.5" />
      <line x1="24" y1="220" x2="388" y2="220" stroke={colors.line} strokeWidth="1.5" />
      <line x1="200" y1="85" x2="200" y2="220" stroke={colors.line} strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M40 220 Q200 -50 360 220" fill="none" stroke={colors.accent} strokeWidth="3" />
      <line x1="40" y1="220" x2="78" y2="156" stroke={colors.ink} strokeWidth="2" />
      <path d="M78 156 L69.5 162.6 L76.3 166.6 Z" fill={colors.ink} />
      <circle cx="360" cy="220" r="6" fill={colors.accent} />
    </svg>
  );
}

export async function shareImage({ title, lang }: { title: string; lang: Locale }): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        lang={lang}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: colors.paper,
          backgroundImage: `linear-gradient(${colors.line}33 1px, transparent 1px), linear-gradient(90deg, ${colors.line}33 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          color: colors.ink,
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        <Trajectory />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.accent }} />
          <div style={{ fontSize: 40, letterSpacing: -0.5 }}>{messages[lang].site.ogName}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 860 }}>
          <div style={{ width: 96, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
          <div style={{ fontSize: 72, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
        </div>
      </div>
    ),
    { ...shareImageSize, fonts: [await shareImageFont()] },
  );
}
