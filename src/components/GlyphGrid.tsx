"use client";

import { useMemo } from "react";
import type opentype from "opentype.js";
import { getDisplayGlyphs, getGlyphPathData } from "@/lib/font-utils";
import type { GlyphTransform } from "@/lib/types";

interface GlyphGridProps {
  font: opentype.Font;
  selectedGlyphIndex: number | null;
  onSelectGlyph: (index: number) => void;
  glyphTransforms: Map<number, GlyphTransform>;
}

export default function GlyphGrid({
  font,
  selectedGlyphIndex,
  onSelectGlyph,
  glyphTransforms,
}: GlyphGridProps) {
  const glyphs = useMemo(() => getDisplayGlyphs(font), [font]);
  const cellSize = 56;
  const glyphSize = 32;

  return (
    <div className="grid grid-cols-4 gap-px bg-white/[0.02] p-px">
      {glyphs.map((glyph) => {
        const isSelected = selectedGlyphIndex === glyph.index;
        const hasTransform = glyphTransforms.has(glyph.index);
        const scale = glyphSize / font.unitsPerEm;
        const height = (font.ascender - font.descender) * scale;
        const width = (glyph.advanceWidth || font.unitsPerEm * 0.5) * scale;
        const pathD = getGlyphPathData(glyph, font, glyphSize);

        return (
          <button
            key={glyph.index}
            onClick={() => onSelectGlyph(glyph.index)}
            className={`
              relative flex flex-col items-center justify-center
              transition-colors duration-100
              ${isSelected ? "bg-white/10 ring-1 ring-inset ring-white/20" : "bg-[#111] hover:bg-white/[0.06]"}
            `}
            style={{ width: cellSize, height: cellSize }}
            title={`${glyph.name} — U+${(glyph.unicode || 0).toString(16).toUpperCase().padStart(4, "0")}`}
          >
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <path d={pathD} fill="white" fillOpacity={0.85} />
            </svg>
            {hasTransform && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
