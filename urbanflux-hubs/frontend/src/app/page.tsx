'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const HubMapOSM = dynamic(() => import('@/components/Mapbox/HubMapOSM'), { ssr: false })
const HubMap = dynamic(() => import('@/components/Mapbox/HubMap'), { ssr: false })
import { Activity, TrendingUp, Car } from 'lucide-react'
import Sidebar from '@/components/Dashboard/Sidebar'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const [mapMode, setMapMode] = useState<'2D' | '3D'>('2D')

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--color-urban-charcoal)]">
      {/* Background Map layer */}
      {mapMode === '2D' ? <HubMapOSM /> : <HubMap />}

      {/* Main UI Overlay - Layout Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">

        {/* Left Sidebar - Navigation */}
        <Sidebar />

        {/* Center Content / Floating overlay elements */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="h-16 px-6 flex items-center justify-between glass-panel-light pointer-events-auto">
            <div className="flex items-center gap-4">
              <h1 className="font-mono font-semibold text-lg text-white">Jakarta Central Hub</h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00C27A]/10 text-[#00C27A] text-xs font-mono font-medium border border-[#00C27A]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C27A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C27A]"></span>
                </span>
                Connected
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Hub Time:</span>
              <span className="font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10">14:03:42 JKT</span>
            </div>
          </header>

          {/* Right Floating Panel (Metrics) */}
          <div className="absolute top-20 right-6 w-80 flex flex-col gap-4 pointer-events-auto">

            {/* Metric Card 1 */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">Active Vehicles</span>
                <Car className="w-4 h-4 text-[#00E0FF]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-white">1,492</span>
                <span className="font-mono text-xs text-[#00C27A] font-medium mb-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12%
                </span>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">Network Congestion</span>
                <Activity className="w-4 h-4 text-rose-400" />
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-amber-400 to-rose-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Free Flow</span>
                <span>Critical</span>
              </div>
            </div>

            {/* Live Feed List */}
            <div className="glass-panel rounded-xl flex flex-col border border-white/10 shadow-2xl max-h-64 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Live Anomalies</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                <ActivityItem time="14:03" type="DELAY" desc="Route B3 running 4m late" />
                <ActivityItem time="14:01" type="ROUTE_UPDATE" desc="Traffic reroute on M.H. Thamrin" />
                <ActivityItem time="13:58" type="WARNING" desc="Congestion spike in Sudirman" />
              </div>
            </div>

          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-4 py-2 flex items-center gap-2 pointer-events-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setMapMode('2D')}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", mapMode === '2D' ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}
            >
              2D View
            </button>
            <button
              onClick={() => setMapMode('3D')}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", mapMode === '3D' ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}
            >
              3D View
            </button>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <button className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-colors">Heatmap</button>
            <button className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-colors">Transit Corridors</button>
          </div>

        </div>
      </div>
    </main>
  )
}

function ActivityItem({ time, type, desc }: { time: string, type: 'DELAY' | 'WARNING' | 'ROUTE_UPDATE', desc: string }) {
  const colorMap = {
    'DELAY': 'text-amber-400 bg-amber-400/10',
    'WARNING': 'text-rose-400 bg-rose-400/10',
    'ROUTE_UPDATE': 'text-[#00C27A] bg-[#00C27A]/10'
  }
  return (
    <div className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors text-left">
      <span className="font-mono text-[10px] text-slate-500 mt-0.5">{time}</span>
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className={cn("font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-[3px]", colorMap[type])}>{type}</span>
        </div>
        <p className="text-xs text-slate-300 leading-snug">{desc}</p>
      </div>
    </div>
  )
}

