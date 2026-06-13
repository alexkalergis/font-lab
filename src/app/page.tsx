import Link from "next/link";
import { Type, ScanSearch, ArrowRight, Download } from "lucide-react";

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
      <nav className="relative z-10 flex items-center px-5 sm:px-8 py-5 sm:py-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center">
            <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-medium tracking-tight">Font Lab</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-6">
        <div className="text-center w-full max-w-2xl">
          {/* Animated glyph display */}
          <div className="mb-8 sm:mb-10 flex items-center justify-center gap-0.5 sm:gap-1">
            {["F", "o", "n", "t"].map((char, i) => (
              <span
                key={i}
                className="text-[60px] sm:text-[100px] md:text-[160px] font-bold leading-none tracking-tighter"
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
              className="text-[60px] sm:text-[100px] md:text-[160px] font-bold leading-none tracking-tighter text-white/30"
              style={{ transform: "scaleX(1.3)", display: "inline-block" }}
            >
              L
            </span>
            <span
              className="text-[60px] sm:text-[100px] md:text-[160px] font-bold leading-none tracking-tighter text-white/20"
              style={{ transform: "skewX(-12deg)", display: "inline-block" }}
            >
              a
            </span>
            <span
              className="text-[60px] sm:text-[100px] md:text-[160px] font-bold leading-none tracking-tighter text-white/15"
              style={{ transform: "rotate(8deg) scaleY(1.2)", display: "inline-block" }}
            >
              b
            </span>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 sm:mb-12 font-light">
            Upload. Customize. Export.
          </p>

          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-medium text-sm hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Font Inspector download */}
        <div className="mt-16 sm:mt-24 w-full max-w-md px-1">
          <a
            href="/font-inspector.zip"
            download
            className="group relative block border border-white/[0.06] rounded-2xl p-5 sm:p-6 hover:border-white/15 transition-all hover:bg-white/[0.02]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4">
              <ScanSearch className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
            </div>
            <h3 className="text-sm font-medium mb-1.5 flex items-center gap-2 flex-wrap">
              Font Inspector
              <span className="text-[9px] text-white/20 border border-white/[0.08] rounded px-1.5 py-0.5 font-normal">
                Chrome Extension
              </span>
            </h3>
            <p className="text-xs text-white/30 leading-relaxed mb-3 sm:mb-4 pr-6">
              Hover any text on any webpage to instantly identify its font family,
              size, weight, color, and line-height. Pin and download.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Hover Inspect", "Font Details", "Download", "Alt+F Toggle"].map((tag) => (
                <span key={tag} className="text-[10px] text-white/20 border border-white/[0.06] rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            <Download className="absolute top-5 right-5 sm:top-6 sm:right-6 w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 sm:px-8 py-6 sm:py-8 text-center">
        <p className="text-[11px] text-white/15">
          Built for designers who want to make fonts their own.
        </p>
      </footer>
    </div>
  );
}
