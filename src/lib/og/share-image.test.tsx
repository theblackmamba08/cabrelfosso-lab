import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { instantiate } from "./instance";
import { shareImage, shareImageFont } from "./share-image";

const fontsDir = new URL("../../fonts/", import.meta.url);
const fontFile = new URL("space-grotesk-wght.ttf", fontsDir);
/**
 * Empreinte de fonts/ttf/SpaceGrotesk[wght].ttf du dépôt officiel, commit 03507d0
 * (identique à celui de la version 2.0.0).
 */
const officialTtfSha256 = "acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72";

/** Largeur et hauteur lues dans l'en-tête IHDR d'un PNG. */
function pngSize(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { signature: [...bytes.subarray(1, 4)].map((c) => String.fromCharCode(c)).join(""), width: view.getUint32(16), height: view.getUint32(20) };
}

describe("image de partage", () => {
  it("utilise le fichier TTF officiel, non modifié, et sa licence OFL", () => {
    const ttf = readFileSync(fontFile);
    expect(createHash("sha256").update(ttf).digest("hex")).toBe(officialTtfSha256);
    expect(readFileSync(new URL("LICENSE-space-grotesk.txt", fontsDir), "utf8")).toContain(
      "SIL OPEN FONT LICENSE Version 1.1",
    );
  });

  it("charge Space Grotesk du TTF officiel, instanciée à la graisse des titres (600)", async () => {
    const font = await shareImageFont();
    expect(font.name).toBe("Space Grotesk");
    expect(font.weight).toBe(600);
    const expected = instantiate(new Uint8Array(readFileSync(fontFile)), { wght: 600 });
    expect(new Uint8Array(font.data)).toEqual(expected);
  });

  it("produit un PNG de 1200 × 630", async () => {
    const response = await shareImage({ title: "Confidentialité", lang: "fr" });
    expect(response.headers.get("content-type")).toBe("image/png");
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(pngSize(bytes)).toEqual({ signature: "PNG", width: 1200, height: 630 });
  }, 30_000);
});
