'use client'

import React, { useState } from 'react'
import HeroGlobe from '@/components/HeroGlobe'
import { withBasePath } from "@/lib/utils";
import { ArrowRight, Globe2, Activity } from 'lucide-react'

export default function Home() {
  const [globeMode, setGlobeMode] = useState<'offset' | 'fixed'>('offset');

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#112644] via-[#0A0F1C] to-[#0A0F1C]">
      {/* Dynamic 3D Hero Background */}
      <HeroGlobe mode={globeMode} />

      {/* Dynamic Grid Background with fade out at bottom */}
      <div
        className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('${withBasePath('/grid.svg')}')` }}
      />

      {/* Main UI Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-screen flex flex-col justify-center pointer-events-none">

        {/* Navigation / Header */}
        <nav className="absolute top-0 left-0 right-0 mt-6 md:mt-8 px-7 flex justify-between items-center max-w-2xl mx-auto w-full pointer-events-auto">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-[#00E0FF]" />
            <span className="font-bold text-xl md:text-2xl tracking-tight">Urbanflux</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm md:text-base font-medium text-slate-400" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#developers" className="hover:text-white transition-colors">Developers</a>
          </div>
          <button className="glass-panel px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            Sign In
          </button>
        </nav>

        {/* Hero Content aligned to left */}
        <div className="max-w-xl md:max-w-2xl mt-8 md:mt-16 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-[#00E0FF] font-medium mb-6 md:mb-8">
            <Activity className="w-3 h-3" />
            <span>Platform v1.0 Now Live</span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-4 md:mb-6"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            The Future of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#00C27A]">
              Urban Mobility Starts Here.
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-slate-400 mb-8 max-w-lg md:max-w-xl font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            Orchestrate city-wide transit networks with real-time spatial data, AI-driven congestion routing, and high-frequency WebSocket streams.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            <button className="bg-white text-[var(--color-urban-charcoal)] px-6 py-3.5 md:px-8 md:py-4 rounded-full font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group">
              Launch Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="glass-panel px-6 py-3.5 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>

          {/* More Infos */}
          <div className="mt-8 md:mt-10 flex items-center gap-6 md:gap-8 text-xs md:text-sm text-slate-500 font-medium tracking-wide">
            <div className="flex flex-col">
              <span className="text-white text-xl md:text-2xl font-bold">7</span>
              <span>Global Hubs</span>
            </div>
            <div className="w-px h-10 md:h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-xl md:text-2xl font-bold">60Hz</span>
              <span>Data Streaming</span>
            </div>
            <div className="w-px h-10 md:h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-xl md:text-2xl font-bold">&lt;10ms</span>
              <span>Latency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Globe Mode Toggle */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div
          className="relative flex items-center bg-zinc-900/90 backdrop-blur-md rounded-2xl p-1 shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] border border-white/5"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {/* Sliding Indicator */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out"
            style={{ transform: globeMode === 'fixed' ? 'translateX(100%)' : 'translateX(0%)' }}
          />

          {/* Offset Button */}
          <button
            onClick={() => setGlobeMode('offset')}
            className={`relative z-10 px-6 py-2 text-sm font-medium tracking-wide w-32 transition-colors ${globeMode === 'offset' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Offset
          </button>

          {/* Fixed Button */}
          <button
            onClick={() => setGlobeMode('fixed')}
            className={`relative z-10 px-6 py-2 text-sm font-medium tracking-wide w-32 transition-colors ${globeMode === 'fixed' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Fixed
          </button>
        </div>
      </div>
    </main>
  )
}
