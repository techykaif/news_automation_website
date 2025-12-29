"use client"

import { useEffect, useState } from "react"

type HealthStatus = "OK" | "DOWN" | "CHECKING"

function formatUptime(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `since ${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `since ${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `since ${minutes} minute${minutes > 1 ? "s" : ""} ago`
  return "since just now"
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>("CHECKING")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [uptimeText, setUptimeText] = useState<string>("")

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" })
        if (!res.ok) throw new Error("Not OK")

        const data = await res.json()
        setStatus(data.status === "OK" ? "OK" : "DOWN")
      } catch {
        setStatus("DOWN")
      } finally {
        setLastChecked(new Date())
      }
    }

    checkHealth()
  }, [])

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
    }

    if (status === "DOWN") {
      localStorage.removeItem(key)
      setUptimeText("")
    }
  }, [status])

  const statusColor =
    status === "OK"
      ? "text-green-600"
      : status === "DOWN"
      ? "text-red-600"
      : "text-gray-500"

  const ringColor =
    status === "OK"
      ? "bg-green-500"
      : status === "DOWN"
      ? "bg-red-500"
      : "bg-gray-400"

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white/60 backdrop-blur p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ringColor} opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${ringColor}`}
            />
          </span>
          <h1 className="text-2xl font-semibold">System Status</h1>
        </div>

        <div className="text-center space-y-3">
          <p className={`text-lg font-medium ${statusColor}`}>
            {status === "CHECKING" && "Checking system health…"}
            {status === "OK" && "All systems operational"}
            {status === "DOWN" && "Service unavailable"}
          </p>

          {status === "OK" && uptimeText && (
            <p className="text-sm text-gray-600">
              Operational {uptimeText}
            </p>
          )}

          <p className="text-xs text-gray-500">
            {lastChecked
              ? `Last checked at ${lastChecked.toLocaleTimeString()}`
              : "Initializing check…"}
          </p>
        </div>
      </div>
    </main>
  )
}
