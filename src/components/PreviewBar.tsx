"use client";

import { useState, useEffect, useRef } from "react";
import type opentype from "opentype.js";
import { buildModifiedFontUrl } from "@/lib/font-utils";
import type { GlobalTransform, GlyphTransform } from "@/lib/types";

interface PreviewBarProps {
  font: opentype.Font;
  globalTransform: GlobalTransform;
  glyphTransforms: Map<number, GlyphTransform>;
}

let previewCounter = 0;

export default function PreviewBar({ font, globalTransform, glyphTransforms }: PreviewBarProps) {
  const [text, setText] = useState("Type here to preview your custom font");
  const [size, setSize] = useState(36);
  const [fontFamily, setFontFamily] = useState("");
  const prevUrlRef = useRef<string | null>(null);

  // Rebuild the modified font whenever transforms change
  useEffect(() => {
    const familyName = `font-lab-preview-${previewCounter++}`;

    try {
      const url = buildModifiedFontUrl(font, glyphTransforms, globalTransform, familyName);

      const face = new FontFace(familyName, `url(${url})`);
      face.load().then(() => {
        document.fonts.add(face);
        setFontFamily(familyName);

        // Clean up previous URL
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }
        prevUrlRef.current = url;
      });
    } catch {
      // Font generation can fail with extreme transforms — ignore
    }
  }, [font, globalTransform, glyphTransforms]);

  return (
    <div className="border-t border-white/5 bg-[#111] px-6 py-4 shrink-0">
      <div className="flex items-center gap-4 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to preview..."
          className="flex-1 bg-transparent border-b border-white/10 pb-1 text-sm text-white/70 outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
        />
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-white/30 w-8 text-right">{size}px</span>
          <input
            type="range"
            min="14"
            max="120"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
      <div
        className="text-white/90 break-words min-h-[48px] leading-normal"
        style={{
          fontFamily: fontFamily || "inherit",
          fontSize: `${size}px`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
