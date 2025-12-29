export default function AboutPage() {
  return (
    <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* HERO */}
      <div className="mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          About AutoBrief
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          AutoBrief is a fully automated news platform built to ingest,
          process, and publish meaningful content with clarity,
          reliability, and scale.
        </p>
      </div>

      {/* MISSION + PHILOSOPHY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14 sm:mb-20">
        <div className="rounded-2xl border p-6 sm:p-8 bg-background">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            🚀 Mission
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            To reduce noise and manual effort by building systems that
            transform raw information into structured, readable news —
            automatically.
          </p>
        </div>

        <div className="rounded-2xl border p-6 sm:p-8 bg-background">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            🧠 Philosophy
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            AutoBrief is built with a deep-understanding-first mindset.
            No shortcuts, no magic — just systems that can be reasoned
            about and trusted.
          </p>
        </div>
      </div>
    <br/>
      {/* HOW IT WORKS */}
      <div className="mb-14 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          How AutoBrief Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold mb-2">1. Ingest</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              News is collected from trusted sources and stored in a
              structured ingestion layer.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold mb-2">2. Process</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Content is refined, categorized, and optimized using
              automation-first workflows.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold mb-2">3. Publish</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Articles are published automatically in a clean,
              reader-friendly format.
            </p>
          </div>
        </div>
      </div>
    <br />
      {/* FOUNDER SECTION */}
      <div className="rounded-3xl border bg-muted/30 p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          Founder’s Note
        </h2>

        <p className="text-sm sm:text-base leading-relaxed mb-4">
          AutoBrief was built by{" "}
          <span className="font-semibold">Mohd Kaif Ansari</span> as a
          real-world exercise in designing automated systems that
          actually work — not demos or surface-level experiments.
        </p>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          The platform came together through persistent debugging,
          hands-on API integration, and an insistence on understanding
          every moving part.
        </p>

        <div className="text-xs sm:text-sm text-muted-foreground italic">
          “Build systems you understand. Debug until you do.”
        </div>
      </div>
    </section>
  )
}
