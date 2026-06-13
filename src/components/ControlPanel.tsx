"use client";

import type { GlyphTransform, GlobalTransform } from "@/lib/types";
import { DEFAULT_GLYPH_TRANSFORM } from "@/lib/types";

interface ControlPanelProps {
  globalTransform: GlobalTransform;
  onGlobalChange: (transform: GlobalTransform) => void;
  glyphTransform: GlyphTransform | null;
  onGlyphChange: (transform: GlyphTransform) => void;
  onResetGlyph: () => void;
  hasSelectedGlyph: boolean;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 mb-2">
        <span>{label}</span>
        <span className="text-white/70 normal-case tracking-normal">
          {value % 1 === 0 ? value : value.toFixed(2)}
          {unit || ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-white/5">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function ControlPanel({
  globalTransform,
  onGlobalChange,
  glyphTransform,
  onGlyphChange,
  onResetGlyph,
  hasSelectedGlyph,
}: ControlPanelProps) {
  const gt = glyphTransform || DEFAULT_GLYPH_TRANSFORM;

  return (
    <div className="overflow-y-auto">
      <Section title="Global">
        <Slider
          label="Width"
          value={globalTransform.width}
          min={0.5}
          max={2}
          step={0.01}
          onChange={(v) => onGlobalChange({ ...globalTransform, width: v })}
        />
        <Slider
          label="Slant"
          value={globalTransform.slant}
          min={-30}
          max={30}
          step={1}
          unit="°"
          onChange={(v) => onGlobalChange({ ...globalTransform, slant: v })}
        />
        <Slider
          label="Tracking"
          value={globalTransform.tracking}
          min={-200}
          max={500}
          step={10}
          onChange={(v) => onGlobalChange({ ...globalTransform, tracking: v })}
        />
      </Section>

      {hasSelectedGlyph && (
        <Section title="Selected Glyph">
          <Slider
            label="Scale X"
            value={gt.scaleX}
            min={0.2}
            max={3}
            step={0.01}
            onChange={(v) => onGlyphChange({ ...gt, scaleX: v })}
          />
          <Slider
            label="Scale Y"
            value={gt.scaleY}
            min={0.2}
            max={3}
            step={0.01}
            onChange={(v) => onGlyphChange({ ...gt, scaleY: v })}
          />
          <Slider
            label="Rotation"
            value={gt.rotation}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={(v) => onGlyphChange({ ...gt, rotation: v })}
          />
          <Slider
            label="Offset X"
            value={gt.offsetX}
            min={-500}
            max={500}
            step={10}
            onChange={(v) => onGlyphChange({ ...gt, offsetX: v })}
          />
          <Slider
            label="Offset Y"
            value={gt.offsetY}
            min={-500}
            max={500}
            step={10}
            onChange={(v) => onGlyphChange({ ...gt, offsetY: v })}
          />

          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onGlyphChange({ ...gt, flipH: !gt.flipH })}
              className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                gt.flipH
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              Flip H
            </button>
            <button
              onClick={() => onGlyphChange({ ...gt, flipV: !gt.flipV })}
              className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                gt.flipV
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              Flip V
            </button>
          </div>

          <button
            onClick={onResetGlyph}
            className="w-full text-xs py-1.5 rounded-md border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors mt-1"
          >
            Reset Glyph
          </button>
        </Section>
      )}
    </div>
  );
}
