'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const HubMapOSM = dynamic(() => import('@/components/Mapbox/HubMapOSM'), { ssr: false })
const HubMap = dynamic(() => import('@/components/Mapbox/HubMap'), { ssr: false })
import { Activity, TrendingUp, Car } from 'lucide-react'
import Sidebar from '@/components/Dashboard/Sidebar'
import { cn } from '@/lib/utils'
import { HUB_CONFIGS, HUB_IDS } from '@/lib/hub-config'
import { useHubTelemetry } from '@/hooks/useHubTelemetry'

export default function Dashboard() {
  const [mapMode, setMapMode] = useState<'2D' | '3D'>('2D')
  const [activeHub, setActiveHub] = useState<string>('jakarta')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const telemetry = useHubTelemetry(activeHub)
  const hubConfig = HUB_CONFIGS[activeHub] || HUB_CONFIGS['jakarta']
  const isDark = theme === 'dark'

  // Connection status colors
  const statusConfig = {
    CONNECTED: { color: '#00C27A', label: 'Connected' },
    CONNECTING: { color: '#F59E0B', label: 'Connecting...' },
    DISCONNECTED: { color: '#EF4444', label: 'Disconnected' },
  }
  const status = statusConfig[telemetry.connectionStatus]

  return (
    <main className={`relative w-screen h-screen overflow-hidden ${isDark ? 'bg-[var(--color-urban-charcoal)] dark' : 'bg-slate-50'}`}>
      {/* Background Map layer */}
      {mapMode === '2D' ? <HubMapOSM key={`osm-${theme}`} activeHub={activeHub} telemetry={telemetry} theme={theme} /> : <HubMap key={`mb-${theme}`} activeHub={activeHub} telemetry={telemetry} theme={theme} />}

      {/* Main UI Overlay - Layout Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        {/* Left Side (Map controls / Info) */}
        <div className="w-[340px] h-full flex flex-col justify-end p-6 gap-4">

          {/* Map Controls */}
          <div className={`p-4 rounded-xl border backdrop-blur-md pointer-events-auto flex justify-between items-center ${isDark ? 'bg-[#0A0B0E]/80 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            <div className="flex gap-2">
              <button
                onClick={() => setMapMode('2D')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  mapMode === '2D'
                    ? (isDark ? "bg-[#00E0FF] text-black shadow-[0_0_15px_rgba(0,224,255,0.4)]" : "bg-[#00E0FF] text-white shadow-md")
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
                )}
              >
                2D Map
              </button>
              <button
                onClick={() => setMapMode('3D')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  mapMode === '3D'
                    ? (isDark ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "bg-[#7C3AED] text-white shadow-md")
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
                )}
              >
                3D WebGL
              </button>
            </div>
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                isDark ? "text-slate-400 hover:text-[#00E0FF] hover:bg-white/5" : "text-slate-500 hover:text-amber-500 hover:bg-slate-100"
              )}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
          </div>
        </div>

        {/* Right Side (Dashboard content) */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className={`h-16 px-6 flex items-center justify-between pointer-events-auto border-b ${isDark ? 'glass-panel-light border-transparent' : 'bg-white/90 backdrop-blur-md border-slate-200'}`}>
            <div className="flex items-center gap-4">
              {/* Hub Selector Dropdown */}
              <div className={cn("flex items-center rounded-lg border px-2 py-1", isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200")}>
                <select
                  value={activeHub}
                  onChange={(e) => setActiveHub(e.target.value)}
                  className={cn("bg-transparent font-mono text-xs font-medium focus:outline-none cursor-pointer appearance-none w-[120px]", isDark ? "text-[#00E0FF]" : "text-blue-600")}
                >
                  {HUB_IDS.map(hubId => (
                    <option key={hubId} value={hubId} className={isDark ? "bg-[#0A0B0E] text-slate-300" : "bg-white text-slate-800"}>
                      {HUB_CONFIGS[hubId].displayName}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className={cn("pointer-events-none ml-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Dynamic Health Badge */}
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border",
                `text-[${status.color}] bg-[${status.color}]/10 border-[${status.color}]/20`
              )}
                style={{
                  color: status.color,
                  backgroundColor: `${status.color}10`,
                  borderColor: `${status.color}33`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  {telemetry.connectionStatus === 'CONNECTED' && (
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: status.color }}
                    />
                  )}
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: status.color }}
                  />
                </span>
                {status.label}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Hub:</span>
              <span className="font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-white">
                {hubConfig.displayName}
              </span>
            </div>
          </header>

          {/* Right Floating Panel (Metrics) */}
          <div className="absolute top-20 right-6 w-80 flex flex-col gap-4 pointer-events-auto">

            {/* Metric Card 1 — Live Vehicle Count */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">Active Vehicles</span>
                <Car className="w-4 h-4 text-[#00E0FF]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-white">
                  {telemetry.vehicleCount.toLocaleString()}
                </span>
                {telemetry.vehicleCount > 0 && (
                  <span className="font-mono text-xs text-[#00C27A] font-medium mb-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> Live
                  </span>
                )}
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
