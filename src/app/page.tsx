import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <span className="text-sm font-medium tracking-tight">Font Lab</span>
        </div>
        <Link
          href="/editor"
          className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-lg transition-all"
        >
          Open Editor
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="text-center max-w-2xl">
          {/* Animated glyph display */}
          <div className="mb-10 flex items-center justify-center gap-1">
            {["F", "o", "n", "t"].map((char, i) => (
              <span
                key={i}
                className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter"
                style={{
                  opacity: 0.9 - i * 0.1,
                  transform: `rotate(${(i - 1.5) * 3}deg)`,
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
            <span
              className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter text-white/30"
              style={{ transform: "scaleX(1.3)", display: "inline-block" }}
            >
              L
            </span>
            <span
              className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter text-white/20"
              style={{ transform: "skewX(-12deg)", display: "inline-block" }}
            >
              a
            </span>
            <span
              className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter text-white/15"
              style={{ transform: "rotate(8deg) scaleY(1.2)", display: "inline-block" }}
            >
              b
            </span>
          </div>

          <p className="text-lg md:text-xl text-white/40 mb-3 font-light">
            Upload. Customize. Export.
          </p>
          <p className="text-sm text-white/25 mb-12 max-w-md mx-auto leading-relaxed">
            Transform any font into something new. Adjust weight, width, slant, and
            per-glyph transforms — then export your creation as a ready-to-use font file.
          </p>

          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Creating
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-20 flex flex-wrap justify-center gap-3">
          {[
            "TTF / OTF / WOFF2",
            "Global Transforms",
            "Per-Glyph Editing",
            "Live Preview",
            "Export as .otf",
          ].map((feature) => (
            <span
              key={feature}
              className="text-[11px] text-white/30 border border-white/8 rounded-full px-4 py-1.5"
            >
              {feature}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6 text-center">
        <p className="text-[11px] text-white/15">
          Built for designers who want to make fonts their own.
        </p>
      </footer>
    </div>
  );
}
