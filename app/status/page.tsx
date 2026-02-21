/* /status/page.tsx */

"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"

type HealthStatus = "OK" | "DOWN" | "CHECKING"

interface StatusData {
  status: HealthStatus
  timestamp: number
  responseTime: number
  uptime?: number
}

function formatUptime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ago`
  return "now"
}

function getStatusIcon(status: HealthStatus): string {
  switch (status) {
    case "OK":
      return "◆"
    case "DOWN":
      return "◆"
    case "CHECKING":
      return "◐"
    default:
      return "?"
  }
}

interface HistoryEntry {
  status: HealthStatus
  time: number
  responseTime: number
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>("CHECKING")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [uptimeText, setUptimeText] = useState("")
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)
  const animationFrameRef = useRef<NodeJS.Timeout | null>(null)
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoized status colors
  const statusColors = useMemo(() => ({
    OK: {
      text: "text-emerald-400 dark:text-emerald-400",
      bg: "bg-emerald-500 dark:bg-emerald-500",
      border: "border-emerald-400 dark:border-emerald-400",
      glassBg: "from-emerald-500/40 dark:from-emerald-500/40 via-emerald-400/10 dark:via-emerald-400/10 to-emerald-500/40 dark:to-emerald-500/40"
    },
    DOWN: {
      text: "text-red-500 dark:text-red-500",
      bg: "bg-red-500 dark:bg-red-500",
      border: "border-red-500 dark:border-red-500",
      glassBg: "from-red-500/40 dark:from-red-500/40 via-red-400/10 dark:via-red-400/10 to-red-500/40 dark:to-red-500/40"
    },
    CHECKING: {
      text: "text-cyan-400 dark:text-cyan-400",
      bg: "bg-cyan-400 dark:bg-cyan-400",
      border: "border-cyan-400 dark:border-cyan-400",
      glassBg: "from-cyan-400/40 dark:from-cyan-400/40 via-cyan-300/10 dark:via-cyan-300/10 to-cyan-400/40 dark:to-cyan-400/40"
    }
  }), [])

  const currentColors = statusColors[status]

  // Performance-optimized health check
  const checkHealth = useCallback(async () => {
    const startTime = performance.now()
    try {
      const res = await fetch("/api/health", {
        cache: "no-store",
        signal: AbortSignal.timeout(5000)
      })
      const responseTimeMs = Math.round(performance.now() - startTime)
      setResponseTime(responseTimeMs)

      if (!res.ok) throw new Error("Service unavailable")

      const data = await res.json()
      const newStatus: HealthStatus = data.status === "OK" ? "OK" : "DOWN"

      setStatus(newStatus)
      setLastChecked(new Date())

      setHistory(prev => [
        { status: newStatus, time: Date.now(), responseTime: responseTimeMs },
        ...prev.slice(0, 59)
      ])
    } catch (error) {
      const responseTimeMs = Math.round(performance.now() - startTime)
      setResponseTime(responseTimeMs)
      setStatus("DOWN")
      setLastChecked(new Date())

      setHistory(prev => [
        { status: "DOWN", time: Date.now(), responseTime: responseTimeMs },
        ...prev.slice(0, 59)
      ])
    }
  }, [])

  // Initial health check
  useEffect(() => {
    if (mounted) {
      checkHealth()
    }
  }, [checkHealth, mounted])

  // Auto-refresh health status every 30 seconds
  useEffect(() => {
    if (!mounted) return

    healthCheckIntervalRef.current = setInterval(checkHealth, 30000)
    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current)
      }
    }
  }, [checkHealth, mounted])

  // Track uptime
  useEffect(() => {
    const key = "uptimeStart"

    if (status === "OK") {
      let start = localStorage.getItem(key)
      if (!start) {
        start = Date.now().toString()
        localStorage.setItem(key, start)
      }

      const uptimeMs = Date.now() - Number(start)
      setUptimeText(formatUptime(uptimeMs))

      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current)
      }
      animationFrameRef.current = setInterval(() => {
        const currentUptimeMs = Date.now() - Number(start)
        setUptimeText(formatUptime(currentUptimeMs))
      }, 60000)
    }

    if (status === "DOWN") {
      localStorage.removeItem(key)
      setUptimeText("")
      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current)
      }
    }
  }, [status])

  // Calculate uptime percentage from history
  const uptimePercentage = useMemo(() => {
    if (history.length === 0) return 100
    const okCount = history.filter(h => h.status === "OK").length
    return Math.round((okCount / history.length) * 100)
  }, [history])

  const averageResponseTime = useMemo(() => {
    if (history.length === 0) return 0
    const total = history.reduce((sum, h) => sum + h.responseTime, 0)
    return Math.round(total / history.length)
  }, [history])

  const pulseClass = status === "CHECKING" ? "animate-pulse" : ""

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full max-w-4xl">
        {/* Main container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Dynamic border glow */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentColors.glassBg} rounded-2xl blur-xl transition-all duration-500 ${
            isHovering ? "opacity-100" : "opacity-60 dark:opacity-60"
          }`} />

          <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/95 dark:to-slate-950/95 border border-slate-300 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl overflow-hidden backdrop-blur-2xl">
            {/* Animated scan lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] dark:from-white/[0.03] via-transparent to-white/[0.03] dark:to-white/[0.03] animate-pulse" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.03)_0px,rgba(255,255,255,.03)_1px,transparent_1px,transparent_2px)] dark:bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.03)_0px,rgba(255,255,255,.03)_1px,transparent_1px,transparent_2px)] pointer-events-none opacity-30 dark:opacity-30" />
            </div>

            {/* Content */}
            <div className="relative z-20">
              {/* Header */}
              <div className="mb-12 sm:mb-16 text-center">
                {/* Animated status indicator ring */}
                <div className="mb-6 sm:mb-8 flex justify-center">
                  <div className="relative w-32 sm:w-40 h-32 sm:h-40">
                    {/* Outer rotating ring */}
                    <svg
                      className={`absolute inset-0 w-full h-full ${pulseClass}`}
                      style={{
                        animation: status === "CHECKING" ? "spin 4s linear infinite" : "none"
                      }}
                    >
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="url(#grad1)"
                        strokeWidth="2"
                        opacity="0.6"
                      />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={
                            status === "OK" ? "#10b981" : status === "DOWN" ? "#ef4444" : "#06b6d4"
                          } />
                          <stop offset="100%" stopColor={
                            status === "OK" ? "#10b981" : status === "DOWN" ? "#ef4444" : "#06b6d4"
                          } stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Inner status circle */}
                    <div className={`absolute inset-4 rounded-full border-2 ${currentColors.border} shadow-lg`} />

                    {/* Center glow */}
                    <div className={`absolute inset-6 rounded-full ${currentColors.bg} blur-xl opacity-60`} />

                    {/* Status icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-4xl sm:text-5xl font-bold ${currentColors.text} drop-shadow-2xl`}>
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-2 sm:mb-4">
                    <span className="bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700 dark:from-slate-300 dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      SYSTEM
                    </span>
                    <span className="block mt-1 sm:mt-2">
                      <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                        status === "OK"
                          ? "from-emerald-600 dark:from-emerald-400 to-emerald-700 dark:to-emerald-500"
                          : status === "DOWN"
                          ? "from-red-600 dark:from-red-500 to-red-700 dark:to-red-600"
                          : "from-cyan-600 dark:from-cyan-400 to-cyan-700 dark:to-cyan-500"
                      }`}>
                        STATUS
                      </span>
                    </span>
                  </h1>
                </div>

                {/* Status message */}
                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  <div className={`text-lg sm:text-2xl font-bold tracking-wide drop-shadow-lg ${currentColors.text}`}>
                    {status === "CHECKING" && (
                      <span className="flex items-center justify-center gap-2 sm:gap-3">
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-100" />
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-200" />
                        </span>
                        <span className="text-sm sm:text-base">Checking…</span>
                      </span>
                    )}
                    {status === "OK" && "✓ Operational"}
                    {status === "DOWN" && "✗ Unavailable"}
                  </div>

                  {status === "OK" && uptimeText && (
                    <div className="text-xs sm:text-sm font-medium tracking-widest animate-pulse text-emerald-600 dark:text-emerald-300/80">
                      ▶ Online {uptimeText}
                    </div>
                  )}

                  {responseTime !== null && (
                    <div className="text-xs font-mono tracking-wider text-slate-600 dark:text-slate-400">
                      Response: {responseTime}ms
                    </div>
                  )}
                </div>
              </div>

              {/* Stats grid - responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Uptime stat */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 dark:from-emerald-500/10 to-emerald-600/5 dark:to-emerald-600/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-3 sm:p-4 border border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300">
                    <div className="text-xs uppercase tracking-widest mb-2 text-slate-600 dark:text-slate-400">Uptime</div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{uptimePercentage}%</div>
                    <div className="mt-2 h-1 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 dark:from-emerald-500 to-emerald-500 dark:to-emerald-400 transition-all duration-500"
                        style={{ width: `${uptimePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Response time stat */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 dark:from-cyan-500/10 to-cyan-600/5 dark:to-cyan-600/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-3 sm:p-4 border border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300">
                    <div className="text-xs uppercase tracking-widest mb-2 text-slate-600 dark:text-slate-400">Avg Response</div>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400">{averageResponseTime}ms</div>
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-500">Last 60 checks</div>
                  </div>
                </div>

                {/* Last checked stat */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 dark:from-slate-500/10 to-slate-600/5 dark:to-slate-600/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-3 sm:p-4 border border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300">
                    <div className="text-xs uppercase tracking-widest mb-2 text-slate-600 dark:text-slate-400">Last Check</div>
                    <div className="text-sm font-mono text-slate-800 dark:text-slate-300">
                      {lastChecked ? lastChecked.toLocaleTimeString() : "—"}
                    </div>
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-500">
                      {lastChecked ? `${Math.round((Date.now() - lastChecked.getTime()) / 1000)}s ago` : "Checking…"}
                    </div>
                  </div>
                </div>
              </div>

              {/* History chart */}
              {history.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <div className="text-xs uppercase tracking-widest mb-2 sm:mb-3 text-slate-600 dark:text-slate-400">Status History</div>
                  <div className="flex items-end gap-1 h-12 p-2 sm:p-3 border border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                    {history.slice(0, 60).map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: entry.status === "OK" ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)",
                          height: `${Math.max((entry.responseTime / (averageResponseTime * 2 || 1)) * 100, 20)}%`,
                          opacity: entry.status === "OK" ? 0.8 : 0.9
                        }}
                        title={`${entry.status} - ${entry.responseTime}ms`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="my-6 sm:my-8 flex items-center gap-3 opacity-40">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-600 to-transparent" />
              </div>

              {/* Footer info */}
              <div className="text-center space-y-2">
                <div className="text-xs font-mono tracking-widest text-slate-600 dark:text-slate-500">
                  Real-time monitoring • Auto-refresh every 30s
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-slate-400 dark:border-slate-600/50" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-slate-400 dark:border-slate-600/50" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-slate-400 dark:border-slate-600/50" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-slate-400 dark:border-slate-600/50" />
            </div>
          </div>
        </div>

        {/* Status indicator bottom left */}
        <div className="mt-8 text-center">
          <div className="text-xs font-mono opacity-50 text-slate-600 dark:text-slate-600">
            [{status}]
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}