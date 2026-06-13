import type opentype from "opentype.js";

export interface GlyphTransform {
  scaleX: number;
  scaleY: number;
  rotation: number; // degrees
  offsetX: number;
  offsetY: number;
  flipH: boolean;
  flipV: boolean;
}

export interface GlobalTransform {
  weight: number; // stroke width simulation: 0 = none
  width: number; // horizontal scale: 1 = normal
  slant: number; // skew angle in degrees
  tracking: number; // extra spacing added to advance width
}

export interface FontProject {
  originalFont: opentype.Font;
  fontName: string;
  fileName: string;
  glyphTransforms: Map<number, GlyphTransform>;
  globalTransform: GlobalTransform;
}

export const DEFAULT_GLYPH_TRANSFORM: GlyphTransform = {
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  flipH: false,
  flipV: false,
};

export const DEFAULT_GLOBAL_TRANSFORM: GlobalTransform = {
  weight: 0,
  width: 1,
  slant: 0,
  tracking: 0,
};
