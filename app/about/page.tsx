"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"

interface Feature {
  number: string
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    number: "01",
    title: "Ingest",
    description: "News is collected from trusted sources and stored in a structured ingestion layer with real-time pipeline.",
    icon: "📥"
  },
  {
    number: "02",
    title: "Process",
    description: "Content is refined, categorized, and optimized using automation-first workflows and intelligent tagging.",
    icon: "⚙️"
  },
  {
    number: "03",
    title: "Publish",
    description: "Articles are published automatically in a clean, reader-friendly format across all platforms.",
    icon: "📤"
  }
]

interface PhilosophyCard {
  icon: string
  title: string
  description: string
}

const philosophyCards: PhilosophyCard[] = [
  {
    icon: "🚀",
    title: "Mission",
    description: "To reduce noise and manual effort by building systems that transform raw information into structured, readable news — automatically."
  },
  {
    icon: "🧠",
    title: "Philosophy",
    description: "AutoBrief is built with a deep-understanding-first mindset. No shortcuts, no magic — just systems that can be reasoned about and trusted."
  }
]

export default function AboutPage() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleExploreFeatures = () => {
    // Scroll to the "How It Works" section
    const element = document.getElementById("how-it-works")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleGetStarted = () => {
    // Navigate to home page
    router.push("/")
  }

  if (!mounted) return null

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Automated News Platform</span>
              </div>
            </div>

            {/* Main title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="block mb-4">About</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                AutoBrief
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A fully automated news platform built to ingest, process, and publish meaningful content with clarity, reliability, and scale.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleExploreFeatures}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce text-slate-400 dark:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* MISSION + PHILOSOPHY SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="space-y-16">
          {/* Section title */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black">Our Foundation</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built on principles of automation, clarity, and trustworthy systems
            </p>
          </div>

          {/* Philosophy cards grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {philosophyCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 dark:from-slate-900/50 to-white dark:to-slate-950 hover:border-blue-400 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-900/20"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 dark:group-hover:from-blue-500/10 group-hover:to-purple-500/5 dark:group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />

                <div className="relative space-y-4">
                  <div className="text-5xl">{card.icon}</div>
                  <h3 className="text-2xl sm:text-3xl font-bold">{card.title}</h3>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {/* Section title */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black">How AutoBrief Works</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A three-step automated pipeline for meaningful content
              </p>
            </div>

            {/* Features grid with connecting lines */}
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line (hidden on mobile) */}
              <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 dark:via-blue-400/20" />

              {features.map((feature, idx) => (
                <div key={idx} className="group relative">
                  {/* Card */}
                  <div className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-900/20 h-full">
                    {/* Number badge */}
                    <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform duration-300">
                      {feature.number}
                    </div>

                    <div className="space-y-4 pt-6">
                      <div className="text-4xl">{feature.icon}</div>
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Section title */}
            <h2 className="text-4xl sm:text-5xl font-black text-center">Founder's Note</h2>

            {/* Content card */}
            <div className="relative group">
              {/* Gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 dark:via-blue-400/20 rounded-2xl blur-xl" />

              <div className="relative p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-white dark:from-slate-900/50 to-slate-50 dark:to-slate-950 space-y-6">
                {/* Opening paragraph */}
                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                  AutoBrief was built by{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">Mohd Kaif Ansari</span> as a
                  real-world exercise in designing automated systems that actually work — not demos or surface-level experiments.
                </p>

                {/* Middle paragraph */}
                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                  The platform came together through persistent debugging, hands-on API integration, and an insistence on understanding
                  every moving part. Every feature built, every integration added, was driven by the principle of deep understanding.
                </p>

                {/* Quote box */}
                <div className="my-8 pl-6 border-l-4 border-blue-500 dark:border-blue-400">
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 italic">
                    "Build systems you understand. Debug until you do."
                  </p>
                </div>

                {/* Closing paragraph */}
                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                  That philosophy continues to guide every decision at AutoBrief. We don't believe in magic — only well-designed systems backed by solid engineering and relentless testing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white">Ready to Experience AutoBrief?</h2>
            <p className="text-lg sm:text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
              Transform how you consume and distribute news with fully automated, intelligent systems.
            </p>
          </div>

          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}