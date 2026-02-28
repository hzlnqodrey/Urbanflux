import HeroGlobe from '@/components/HeroGlobe'
import { ArrowRight, Globe2, Activity } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0E0F13] to-[#12141A]">
      {/* Dynamic 3D Hero Background */}
      <HeroGlobe />

      {/* Grid Overlay for aesthetic structure */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      {/* Main UI Container */}
      <div className="relative z-10 max-w-1xl mx-auto px-20 h-screen flex flex-col justify-center">

        {/* Navigation / Header */}
        <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-[#00E0FF]" />
            <span className="font-bold text-xl tracking-tight">Urbanflux</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#developers" className="hover:text-white transition-colors">Developers</a>
          </div>
          <button className="glass-panel px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Sign In
          </button>
        </nav>

        {/* Hero Content aligned to left */}
        <div className="max-w-2xl mt-20 ml-10 px-7">
          <div className="inline-flex items-center gap-2 px-1 py-1 rounded-full glass-panel text-xs text-[#00E0FF] font-medium mb-8">
            <Activity className="w-3 h-3" />
            <span>Platform v1.0 Now Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
            The Future of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#00C27A]">
              Urban Mobility Starts Here.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl font-light leading-relaxed">
            Orchestrate city-wide transit networks with real-time spatial data, AI-driven congestion routing, and high-frequency WebSocket streams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-[var(--color-urban-charcoal)] px-8 py-4 rounded-full font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group">
              Launch Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="glass-panel px-8 py-4 rounded-full font-semibold hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>

          <div className="mt-20 flex items-center gap-8 text-sm text-slate-500 font-medium tracking-wide">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">4</span>
              <span>Global Hubs</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">60Hz</span>
              <span>Data Streaming</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">&lt;10ms</span>
              <span>Latency</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
