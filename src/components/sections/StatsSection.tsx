'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 28, suffix: '+', label: 'Years of Experience', sub: 'Since 1996' },
  { value: 50, suffix: '+', label: 'Product Models', sub: 'Across 8 categories' },
  { value: 1000, suffix: '+', label: 'Industries Served', sub: 'OEMs & end users' },
  { value: 30, suffix: '+', label: 'Dealer Locations', sub: 'Pan-India network' },
]

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

function StatCard({ value, suffix, label, sub, started }: typeof stats[0] & { started: boolean }) {
  const count = useCountUp(value, 3000, started)
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 border-r border-white/10 last:border-r-0">
      <div className="text-4xl font-bold text-white sm:text-5xl font-inter mb-2">
        <span>{count}</span>
        <span className="text-brand-orange">{suffix}</span>
      </div>
      <div className="mt-2 font-semibold text-white uppercase tracking-wider">{label}</div>
      <div className="mt-1  text-white/40">{sub}</div>
    </div>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-dark border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
