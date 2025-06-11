"use client"

import { useEffect, useState } from "react"
import { Counter } from "./Counter"

export default function CounterDemo() {
  // ──────────────── Counter State ────────────────
  const [count, setCount] = useState(0)

  // ──────────────── Clock State ────────────────
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  // ──────────────── Timer State ────────────────
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => setElapsed((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])
  const resetTimer = () => {
    setElapsed(0)
    setIsRunning(false)
  }


  // ──────────────── UI ────────────────
  return (
    <div className="flex flex-col gap-20 items-center justify-center py-8">
      
      {/* 🔢 Counter */}
      <section className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-white">Interactive Counter</h2>
        <Counter value={count} digits={3} theme="dark" mode="counter" fontSize={48} digitWidth={64} digitHeight={80} />
        <div className="flex gap-4">
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow transition"
          >
            −
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold shadow transition"
          >
            +
          </button>
        </div>
      </section>

      {/* 🕒 Clock */}
      <section className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-white">Digital Clock</h2>
        <div className="flex items-center gap-6">
          <Counter value={hours} digits={2} theme="neon" mode="clock" fontSize={48} digitWidth={64} digitHeight={80} />
          <span className="text-5xl text-cyan-400 font-bold animate-pulse">:</span>
          <Counter value={minutes} digits={2} theme="neon" mode="clock" fontSize={48} digitWidth={64} digitHeight={80} />
          <span className="text-5xl text-cyan-400 font-bold animate-pulse">:</span>
          <Counter value={seconds} digits={2} theme="neon" mode="clock" fontSize={48} digitWidth={64} digitHeight={80} />
        </div>
      </section>

      {/* ⏱️ Timer */}
      {/* <section className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-white">Timer</h2>
        <div className="flex items-center gap-6">
          <Counter value={tH} digits={2} theme="light" mode="timer" fontSize={44} digitWidth={60} digitHeight={76} />
          <span className="text-4xl text-white font-bold">:</span>
          <Counter value={tM} digits={2} theme="light" mode="timer" fontSize={44} digitWidth={60} digitHeight={76} />
          <span className="text-4xl text-white font-bold">:</span>
          <Counter value={tS} digits={2} theme="light" mode="timer" fontSize={44} digitWidth={60} digitHeight={76} />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </section> */}
    </div>
  )
}
