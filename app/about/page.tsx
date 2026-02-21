import Link from "next/link"
import { Metadata } from "next"

const SITE_URL = "https://autobrief-ai.netlify.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "About AutoBrief | Automated News Platform",
  description:
    "Learn about AutoBrief — a fully automated news platform engineered to ingest, process, and publish structured, meaningful content with clarity and reliability.",

  alternates: {
    canonical: "/about", // ✅ best practice with metadataBase
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "About AutoBrief | Automated News Platform",
    description:
      "Discover the mission, philosophy, and engineering principles behind AutoBrief — a modern automated news system.",
    url: "/about",
    siteName: "AutoBrief",
    type: "website",
    images: [
      {
        url: "/og-image.png", // 👉 create later (recommended)
        width: 1200,
        height: 630,
        alt: "AutoBrief - Automated News Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About AutoBrief | Automated News Platform",
    description:
      "Engineering automated systems that transform raw information into structured, readable news.",
    images: ["/og-image.png"],
  },
}

/* -------------------- */
/* Structured Data */
/* -------------------- */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AutoBrief",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`, // Optional but recommended
  founder: {
    "@type": "Person",
    name: "Mohd Kaif Ansari",
    jobTitle: "Founder",
  },
}

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Automated News Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="block mb-4">About</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AutoBrief
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A fully automated news platform built to ingest, process, and publish meaningful content with clarity, reliability, and scale.
            </p>

            <a
              href="#foundation"
              className="inline-block px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* FOUNDATION */}
        <section id="foundation" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-black">Our Foundation</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built on principles of automation, clarity, and trustworthy systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 dark:from-slate-900/50 to-white dark:to-slate-950">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Mission</h3>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                To reduce noise and manual effort by building systems that transform raw information into structured, readable news — automatically.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 dark:from-slate-900/50 to-white dark:to-slate-950">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Philosophy</h3>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                AutoBrief is built with a deep-understanding-first mindset. No shortcuts, no magic — just systems that can be reasoned about and trusted.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Experience Automated News. The Right Way.
            </h2>

            <Link
              href="/"
              className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}