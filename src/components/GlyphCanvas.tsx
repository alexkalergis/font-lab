"use client";

import type opentype from "opentype.js";
import { getGlyphPathData, buildSvgTransform } from "@/lib/font-utils";
import type { GlyphTransform, GlobalTransform } from "@/lib/types";

interface GlyphCanvasProps {
  font: opentype.Font;
  glyphIndex: number;
  glyphTransform?: GlyphTransform;
  globalTransform: GlobalTransform;
}

export default function GlyphCanvas({
  font,
  glyphIndex,
  glyphTransform,
  globalTransform,
}: GlyphCanvasProps) {
  const glyph = font.glyphs.get(glyphIndex);
  const upm = font.unitsPerEm;
  const ascender = font.ascender;
  const descender = font.descender;
  const totalHeight = ascender - descender;
  const advWidth = glyph.advanceWidth || upm * 0.5;

  // Render at full UPM size for precision
  const pathD = getGlyphPathData(glyph, font, upm);
  const svgTransform = buildSvgTransform(glyph, font, globalTransform, glyphTransform);

  // ViewBox with padding
  const pad = upm * 0.2;
  const vbX = -pad;
  const vbY = -pad;
  const vbW = Math.max(advWidth, upm) + pad * 2;
  const vbH = totalHeight + pad * 2;

  const char = glyph.unicode !== undefined ? String.fromCodePoint(glyph.unicode) : "?";
  const hex = (glyph.unicode || 0).toString(16).toUpperCase().padStart(4, "0");

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        className="w-full h-full max-w-[550px] max-h-[450px]"
        style={{ overflow: "visible" }}
      >
        {/* Guide lines */}
        <line x1={vbX} y1={0} x2={vbX + vbW} y2={0} stroke="#444" strokeWidth="1" opacity="0.5" />
        <line x1={vbX} y1={ascender} x2={vbX + vbW} y2={ascender} stroke="#3a7a3a" strokeWidth="1" opacity="0.4" />
        <line x1={vbX} y1={totalHeight} x2={vbX + vbW} y2={totalHeight} stroke="#7a3a3a" strokeWidth="1" opacity="0.4" />
        <line x1={0} y1={vbY} x2={0} y2={vbY + vbH} stroke="#333" strokeWidth="1" opacity="0.3" />
        <line x1={advWidth} y1={vbY} x2={advWidth} y2={vbY + vbH} stroke="#333" strokeWidth="1" opacity="0.3" />

        {/* Guide labels */}
        <text x={vbX + vbW - pad / 2} y={-6} fill="#666" fontSize={upm * 0.035} textAnchor="end" fontFamily="system-ui">
          top
        </text>
        <text x={vbX + vbW - pad / 2} y={ascender - 6} fill="#3a7a3a" fontSize={upm * 0.035} textAnchor="end" fontFamily="system-ui">
          baseline
        </text>
        <text x={vbX + vbW - pad / 2} y={totalHeight - 6} fill="#7a3a3a" fontSize={upm * 0.035} textAnchor="end" fontFamily="system-ui">
          descender
        </text>

        {/* Original glyph (faded) */}
        <path d={pathD} fill="white" fillOpacity={0.08} />

        {/* Transformed glyph */}
        <g transform={svgTransform}>
          <path d={pathD} fill="white" fillOpacity={0.9} />
        </g>
      </svg>

      {/* Info bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[11px] text-white/30">
        <div className="flex gap-4">
          <span>{char} &middot; U+{hex}</span>
          <span>{glyph.name}</span>
        </div>
        <div className="flex gap-4">
          <span>width: {advWidth}</span>
          <span>UPM: {upm}</span>
        </div>
      </div>
    </div>
  );
}
