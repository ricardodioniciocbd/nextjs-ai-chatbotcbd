"use client"

import { Meteors } from "@/components/ui/meteors"

export function MeteorsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <Meteors 
        number={20} 
        minDelay={1}
        maxDelay={4}
        minDuration={8}
        maxDuration={15}
        className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_20px_4px_rgba(16,185,129,0.6),0_0_40px_8px_rgba(20,184,166,0.3)]"
      />
    </div>
  )
}
