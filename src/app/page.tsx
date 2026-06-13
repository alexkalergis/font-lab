"use client";

import { useState, useCallback, useRef } from "react";
import * as opentype from "opentype.js";
import GlyphGrid from "@/components/GlyphGrid";
import GlyphCanvas from "@/components/GlyphCanvas";
import ControlPanel from "@/components/ControlPanel";
import PreviewBar from "@/components/PreviewBar";
import { downloadFont } from "@/lib/font-utils";
import { convertToSfnt } from "@/lib/woff2-convert";
import type { GlyphTransform, GlobalTransform, FontProject } from "@/lib/types";
import { DEFAULT_GLOBAL_TRANSFORM } from "@/lib/types";

export default function Home() {
  const [project, setProject] = useState<FontProject | null>(null);
  const [selectedGlyphIndex, setSelectedGlyphIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [exportName, setExportName] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFont = useCallback(async (file: File) => {
    const rawBuffer = await file.arrayBuffer();
    const buffer = await convertToSfnt(rawBuffer, file.name);
    const font = opentype.parse(buffer);

    const name = file.name.replace(/\.(ttf|otf|woff2?|eot)$/i, "");
    setProject({
      originalFont: font,
      fontName: name,
      fileName: file.name,
      glyphTransforms: new Map(),
      globalTransform: { ...DEFAULT_GLOBAL_TRANSFORM },
    });
    setSelectedGlyphIndex(null);
    setExportName(name + " Custom");

    // Register for CSS preview
    const url = URL.createObjectURL(file);
    const fontFace = new FontFace(`preview-${font.names.fontFamily?.en || "font"}`, `url(${url})`);
    await fontFace.load();
    document.fonts.add(fontFace);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const validExtensions = [".ttf", ".otf", ".woff", ".woff2"];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (validExtensions.includes(ext)) {
        loadFont(file);
      }
    },
    [loadFont]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const updateGlobalTransform = useCallback((transform: GlobalTransform) => {
    setProject((prev) => (prev ? { ...prev, globalTransform: transform } : null));
  }, []);

  const updateGlyphTransform = useCallback(
    (transform: GlyphTransform) => {
      if (selectedGlyphIndex === null || !project) return;
      setProject((prev) => {
        if (!prev) return null;
        const newMap = new Map(prev.glyphTransforms);
        newMap.set(selectedGlyphIndex, transform);
        return { ...prev, glyphTransforms: newMap };
      });
    },
    [selectedGlyphIndex, project]
  );

  const resetGlyph = useCallback(() => {
    if (selectedGlyphIndex === null) return;
    setProject((prev) => {
      if (!prev) return null;
      const newMap = new Map(prev.glyphTransforms);
      newMap.delete(selectedGlyphIndex);
      return { ...prev, glyphTransforms: newMap };
    });
  }, [selectedGlyphIndex]);

  const handleExport = useCallback(() => {
    if (!project) return;
    downloadFont(
      project.originalFont,
      project.glyphTransforms,
      project.globalTransform,
      exportName || project.fontName + " Custom"
    );
    setShowExportModal(false);
  }, [project, exportName]);

  // Upload screen
  if (!project) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            cursor-pointer text-center transition-all duration-300 p-16 rounded-2xl border-2 border-dashed
            ${isDragging ? "border-white/30 bg-white/5 scale-105" : "border-white/10 hover:border-white/20"}
          `}
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 mx-auto mb-6 flex items-center justify-center">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-white/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-xl font-medium mb-2">Font Lab</h1>
          <p className="text-sm text-white/40 mb-1">Drop a font file or click to upload</p>
          <p className="text-xs text-white/20">.ttf .otf .woff .woff2</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  const selectedGlyphTransform =
    selectedGlyphIndex !== null ? project.glyphTransforms.get(selectedGlyphIndex) || null : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-white/5 bg-[#111] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
            <span className="text-black font-bold text-[11px]">F</span>
          </div>
          <span className="text-sm font-medium">Font Lab</span>
          <span className="text-white/20 mx-1">/</span>
          <span className="text-sm text-white/50">{project.fontName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setProject(null);
              setSelectedGlyphIndex(null);
            }}
            className="text-xs text-white/40 hover:text-white/70 px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            New Font
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="text-xs bg-white text-black px-4 py-1.5 rounded-md font-medium hover:bg-white/90 transition-colors"
          >
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Glyph Grid */}
        <aside className="w-64 border-r border-white/5 overflow-y-auto shrink-0 bg-[#0e0e0e]">
          <div className="p-3 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30">
              Glyphs &middot; {project.originalFont.glyphs.length}
            </p>
          </div>
          <GlyphGrid
            font={project.originalFont}
            selectedGlyphIndex={selectedGlyphIndex}
            onSelectGlyph={setSelectedGlyphIndex}
            glyphTransforms={project.glyphTransforms}
          />
        </aside>

        {/* Center: Canvas + Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedGlyphIndex !== null ? (
            <GlyphCanvas
              font={project.originalFont}
              glyphIndex={selectedGlyphIndex}
              glyphTransform={selectedGlyphTransform || undefined}
              globalTransform={project.globalTransform}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20 text-sm bg-[#0d0d0d]">
              Select a glyph to inspect
            </div>
          )}
          <PreviewBar
            font={project.originalFont}
            globalTransform={project.globalTransform}
            glyphTransforms={project.glyphTransforms}
          />
        </div>

        {/* Right: Controls */}
        <aside className="w-60 border-l border-white/5 shrink-0 bg-[#0e0e0e] overflow-y-auto">
          <div className="p-3 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30">Controls</p>
          </div>
          <ControlPanel
            globalTransform={project.globalTransform}
            onGlobalChange={updateGlobalTransform}
            glyphTransform={selectedGlyphTransform}
            onGlyphChange={updateGlyphTransform}
            onResetGlyph={resetGlyph}
            hasSelectedGlyph={selectedGlyphIndex !== null}
          />
        </aside>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 w-96">
            <h2 className="text-sm font-medium mb-4">Export Font</h2>
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">
              Font Name
            </label>
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 mb-4"
              placeholder="My Custom Font"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="text-xs px-4 py-2 rounded-md text-white/50 hover:text-white/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="text-xs bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-white/90 transition-colors"
              >
                Download .otf
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
