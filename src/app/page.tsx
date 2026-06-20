"use client";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflow: "hidden" }}>
      <Nav />
      <Hero />
      <Strip />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 40px", backdropFilter: "blur(12px)",
      background: "rgba(10,10,15,0.7)", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Mark size={26} />
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, letterSpacing: "0.01em" }}>
          Translook <em style={{ fontStyle: "italic", color: "var(--accent-2)" }}>Press</em>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "var(--text-2)" }}>
        <a href="#how" style={{ transition: "color .15s" }}>How it runs</a>
        <a href="#features" style={{ transition: "color .15s" }}>What's inside</a>
        <a href="/console" className="btn btn-primary" style={{ padding: "9px 18px" }}>Open Console →</a>
      </div>
    </nav>
  );
}

function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--accent)" />
      <path d="M11 9.5L23 16L11 22.5V9.5Z" fill="white" />
    </svg>
  );
}

function Hero() {
  return (
    <header style={{
      position: "relative", paddingTop: 180, paddingBottom: 120,
      paddingLeft: 40, paddingRight: 40, maxWidth: 1180, margin: "0 auto",
    }}>
      <Glow />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12.5, color: "var(--accent-2)", border: "1px solid var(--border)",
          borderRadius: 100, padding: "5px 14px", marginBottom: 28, letterSpacing: "0.02em",
          background: "rgba(124,106,245,0.08)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
          Live across every paired display
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 7vw, 84px)", lineHeight: 0.98, maxWidth: 880,
          marginBottom: 28, letterSpacing: "-0.01em",
        }}>
          One edit.<br />
          Every screen,<br />
          <em style={{ fontStyle: "italic", color: "var(--accent-2)" }}>pressed</em> at once.
        </h1>

        <p style={{
          fontSize: 18, color: "var(--text-2)", maxWidth: 480, lineHeight: 1.65, marginBottom: 40,
          fontWeight: 300,
        }}>
          Translook Press turns any display into a paired terminal. Build a playlist
          once, push it out, and watch every screen in the room change in lockstep —
          no cables, no per-device fiddling.
        </p>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <a href="/console" className="btn btn-primary" style={{ padding: "13px 26px", fontSize: 15 }}>
            Open the Console
          </a>
          <a href="/player" className="btn" style={{ padding: "13px 26px", fontSize: 15 }}>
            Pair a display
          </a>
        </div>
      </div>
    </header>
  );
}

function Glow() {
  return (
    <div style={{
      position: "absolute", top: -120, right: -200, width: 700, height: 700,
      background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
      filter: "blur(40px)", zIndex: 0, pointerEvents: "none",
    }} />
  );
}

// The signature element: a "press bed" of tiles that scan through content
// states left-to-right, like type being set then struck onto a sheet —
// echoing both "press" (the publishing house) and the literal press of ink.
function Strip() {
  const ref = useRef<HTMLDivElement>(null);
  const COLS = 22;
  const ROWS = 5;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 90);
    return () => clearInterval(id);
  }, []);

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const wave = Math.sin((c - tick * 0.6) * 0.5 + r * 0.8);
      const lit = wave > 0.55;
      const accent = wave > 0.85;
      cells.push(
        <div key={`${r}-${c}`} style={{
          width: "100%", aspectRatio: "1", borderRadius: 3,
          background: accent ? "var(--accent-2)" : lit ? "var(--accent)" : "var(--bg-3)",
          opacity: accent ? 1 : lit ? 0.75 : 0.35,
          transition: "background .25s, opacity .25s",
        }} />
      );
    }
  }

  return (
    <section style={{ padding: "0 40px 100px", maxWidth: 1180, margin: "0 auto" }}>
      <div
        ref={ref}
        style={{
          display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5,
          padding: 28, borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      >
        {cells}
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
        Every tile is a screen. Every pulse is a push.
      </p>
    </section>
  );
}

const FEATURES = [
  {
    title: "Playlists, not file copies",
    body: "Build a sequence of images and video once. Screens pull from it live — change the order or swap a clip, and the change is everywhere within seconds.",
  },
  {
    title: "Pair with a code, not a cable",
    body: "Every terminal — phone, tablet, signage box — connects with a six-character code. No app store accounts, no MDM, no IT ticket.",
  },
  {
    title: "Built for the room, not the device",
    body: "Group screens, retire one without breaking the rest, and bring a new display online mid-playlist without anyone touching the others.",
  },
];

function Features() {
  return (
    <section id="features" style={{ padding: "40px 40px 120px", maxWidth: 1180, margin: "0 auto" }}>
      <Eyebrow>What's inside</Eyebrow>
      <h2 style={{ fontSize: 36, maxWidth: 560, marginBottom: 64 }}>
        Three decisions that make this boring in the best way.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {FEATURES.map((f, i) => (
          <div key={f.title} style={{ background: "var(--bg)", padding: "36px 32px" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: "var(--accent-2)", marginBottom: 18 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{f.title}</h3>
            <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.7 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { label: "Drop in media", body: "Upload images or video straight into the library." },
  { label: "Set the order", body: "Arrange a playlist, set durations, save." },
  { label: "Pair the screen", body: "Type the six-character code once on the device." },
  { label: "It just runs", body: "The screen polls quietly and updates on its own." },
];

function HowItWorks() {
  return (
    <section id="how" style={{ padding: "40px 40px 130px", maxWidth: 1180, margin: "0 auto" }}>
      <Eyebrow>How it runs</Eyebrow>
      <h2 style={{ fontSize: 36, maxWidth: 560, marginBottom: 64 }}>
        From upload to lit screen in four steps.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {STEPS.map((s, i) => (
          <div key={s.label} style={{ position: "relative" }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 44, color: "var(--bg-3)",
              WebkitTextStroke: "1px var(--border-hover)", marginBottom: 16, lineHeight: 1,
            }}>
              {i + 1}
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.label}</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{s.body}</p>
            {i < STEPS.length - 1 && (
              <div style={{
                position: "absolute", top: 20, right: -12, width: 24, height: 1,
                background: "var(--border-hover)", display: "none",
              }} className="step-connector" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 12.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      color: "var(--accent-2)", marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function CTA() {
  return (
    <section style={{ padding: "0 40px 140px", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{
        borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
        background: "linear-gradient(135deg, var(--bg-2), var(--bg-3))",
        padding: "64px 56px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", width: 500, height: 500,
          transform: "translate(-50%,-50%)", background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />
        <h2 style={{ fontSize: 34, marginBottom: 16, position: "relative" }}>Ready to set the room?</h2>
        <p style={{ color: "var(--text-2)", marginBottom: 32, position: "relative" }}>
          Open the console and bring your first screen online in under a minute.
        </p>
        <a href="/console" className="btn btn-primary" style={{ padding: "14px 30px", fontSize: 15, position: "relative" }}>
          Open the Console
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)", padding: "32px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      maxWidth: 1180, margin: "0 auto", color: "var(--text-3)", fontSize: 13,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Mark size={16} />
        <span>Translook Press</span>
      </div>
      <span>A Translook.Studio product</span>
    </footer>
  );
}
