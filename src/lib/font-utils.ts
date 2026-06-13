import * as opentype from "opentype.js";
import type { GlyphTransform, GlobalTransform } from "./types";
import { DEFAULT_GLYPH_TRANSFORM } from "./types";

export function getDisplayGlyphs(font: opentype.Font): opentype.Glyph[] {
  const glyphs: opentype.Glyph[] = [];
  for (let i = 0; i < font.glyphs.length; i++) {
    const glyph = font.glyphs.get(i);
    if (glyph.unicode !== undefined && glyph.unicode > 31) {
      glyphs.push(glyph);
    }
  }
  return glyphs;
}

/** Get the SVG path "d" attribute for a glyph rendered at given size */
export function getGlyphPathData(
  glyph: opentype.Glyph,
  font: opentype.Font,
  size: number
): string {
  const path = glyph.getPath(0, font.ascender * (size / font.unitsPerEm), size);
  const svg = path.toSVG(2);
  const match = svg.match(/d="([^"]+)"/);
  return match ? match[1] : "";
}

/** Build an SVG transform string from global + per-glyph transforms */
export function buildSvgTransform(
  glyph: opentype.Glyph,
  font: opentype.Font,
  globalTransform: GlobalTransform,
  glyphTransform?: GlyphTransform
): string {
  const gt = glyphTransform || DEFAULT_GLYPH_TRANSFORM;
  const upm = font.unitsPerEm;
  const cx = (glyph.advanceWidth || upm * 0.5) / 2;
  const cy = upm / 2;
  const transforms: string[] = [];

  // Move to center for transforms
  transforms.push(`translate(${cx}, ${cy})`);

  // Global slant
  if (globalTransform.slant !== 0) {
    transforms.push(`skewX(${-globalTransform.slant})`);
  }

  // Global width
  if (globalTransform.width !== 1) {
    transforms.push(`scale(${globalTransform.width}, 1)`);
  }

  // Per-glyph rotation
  if (gt.rotation !== 0) {
    transforms.push(`rotate(${gt.rotation})`);
  }

  // Per-glyph scale
  if (gt.scaleX !== 1 || gt.scaleY !== 1) {
    transforms.push(`scale(${gt.scaleX}, ${gt.scaleY})`);
  }

  // Per-glyph flip
  if (gt.flipH || gt.flipV) {
    transforms.push(`scale(${gt.flipH ? -1 : 1}, ${gt.flipV ? -1 : 1})`);
  }

  // Move back from center
  transforms.push(`translate(${-cx}, ${-cy})`);

  // Per-glyph offset
  if (gt.offsetX !== 0 || gt.offsetY !== 0) {
    transforms.push(`translate(${gt.offsetX}, ${gt.offsetY})`);
  }

  return transforms.join(" ");
}

function transformPathCommands(
  commands: opentype.PathCommand[],
  globalTransform: GlobalTransform,
  glyphTransform: GlyphTransform | undefined,
  cx: number,
  cy: number
): opentype.PathCommand[] {
  const gt = glyphTransform || DEFAULT_GLYPH_TRANSFORM;

  const transform = (x: number, y: number): [number, number] => {
    // Center
    x -= cx;
    y -= cy;

    // Global width
    x *= globalTransform.width;

    // Global slant
    if (globalTransform.slant !== 0) {
      const slantRad = (globalTransform.slant * Math.PI) / 180;
      x += y * Math.tan(slantRad);
    }

    // Flip
    if (gt.flipH) x = -x;
    if (gt.flipV) y = -y;

    // Scale
    x *= gt.scaleX;
    y *= gt.scaleY;

    // Rotate
    if (gt.rotation !== 0) {
      const rad = (gt.rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const nx = x * cos - y * sin;
      const ny = x * sin + y * cos;
      x = nx;
      y = ny;
    }

    // Uncenter + offset
    x += cx + gt.offsetX;
    y += cy + gt.offsetY;

    return [Math.round(x), Math.round(y)];
  };

  return commands.map((cmd) => {
    if (cmd.type === "Z") return cmd;
    if (cmd.type === "M" || cmd.type === "L") {
      const [x, y] = transform(cmd.x, cmd.y);
      return { type: cmd.type, x, y };
    }
    if (cmd.type === "Q") {
      const [x, y] = transform(cmd.x, cmd.y);
      const [x1, y1] = transform(cmd.x1, cmd.y1);
      return { type: "Q" as const, x, y, x1, y1 };
    }
    if (cmd.type === "C") {
      const [x, y] = transform(cmd.x, cmd.y);
      const [x1, y1] = transform(cmd.x1, cmd.y1);
      const [x2, y2] = transform(cmd.x2, cmd.y2);
      return { type: "C" as const, x, y, x1, y1, x2, y2 };
    }
    return cmd;
  });
}

/** Build a modified font and return as a Blob URL for CSS @font-face preview */
export function buildModifiedFontUrl(
  originalFont: opentype.Font,
  glyphTransforms: Map<number, GlyphTransform>,
  globalTransform: GlobalTransform,
  fontName: string
): string {
  const font = buildModifiedFont(originalFont, glyphTransforms, globalTransform, fontName);
  const buffer = font.toArrayBuffer();
  const blob = new Blob([buffer], { type: "font/opentype" });
  return URL.createObjectURL(blob);
}

function buildModifiedFont(
  originalFont: opentype.Font,
  glyphTransforms: Map<number, GlyphTransform>,
  globalTransform: GlobalTransform,
  fontName: string
): opentype.Font {
  const upm = originalFont.unitsPerEm;

  const notdefGlyph = new opentype.Glyph({
    name: ".notdef",
    unicode: 0,
    advanceWidth: upm * 0.5,
    path: new opentype.Path(),
  });

  const newGlyphs: opentype.Glyph[] = [notdefGlyph];

  for (let i = 0; i < originalFont.glyphs.length; i++) {
    const origGlyph = originalFont.glyphs.get(i);
    if (origGlyph.unicode === undefined || origGlyph.name === ".notdef") continue;

    const origPath = origGlyph.getPath(0, 0, upm);
    const gt = glyphTransforms.get(origGlyph.index);
    const cx = (origGlyph.advanceWidth || upm * 0.5) / 2;
    const cy = upm / 2;

    const newPath = new opentype.Path();
    const transformed = transformPathCommands(origPath.commands, globalTransform, gt, cx, cy);
    newPath.commands = transformed;

    let advWidth = origGlyph.advanceWidth || upm * 0.5;
    advWidth = advWidth * globalTransform.width + globalTransform.tracking;
    if (gt) advWidth *= gt.scaleX;

    newGlyphs.push(
      new opentype.Glyph({
        name: origGlyph.name || `uni${origGlyph.unicode?.toString(16).padStart(4, "0")}`,
        unicode: origGlyph.unicode,
        advanceWidth: Math.round(Math.max(advWidth, 0)),
        path: newPath,
      })
    );
  }

  return new opentype.Font({
    familyName: fontName,
    styleName: "Regular",
    unitsPerEm: upm,
    ascender: originalFont.ascender,
    descender: originalFont.descender,
    glyphs: newGlyphs,
  });
}

/** Trigger download of the modified font */
export function downloadFont(
  originalFont: opentype.Font,
  glyphTransforms: Map<number, GlyphTransform>,
  globalTransform: GlobalTransform,
  fontName: string
) {
  const font = buildModifiedFont(originalFont, glyphTransforms, globalTransform, fontName);
  const buffer = font.toArrayBuffer();
  const blob = new Blob([buffer], { type: "font/opentype" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fontName.replace(/\s+/g, "-")}.otf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
