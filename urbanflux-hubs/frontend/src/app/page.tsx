'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const HubMapOSM = dynamic(() => import('@/components/Mapbox/HubMapOSM'), { ssr: false })
import { Activity, TrendingUp, Car, Menu } from 'lucide-react'
import Sidebar from '@/components/Dashboard/Sidebar'
import { cn } from '@/lib/utils'
import { HUB_CONFIGS, HUB_IDS } from '@/lib/hub-config'
import { useHubTelemetry } from '@/hooks/useHubTelemetry'
import { MapControls } from '@/components/Mapbox/MapControls'
import { MapLegend } from '@/components/Mapbox/MapLegend'

function LiveTimeClock() {
  const [time, setTime] = useState<Date | null>(null)
  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!time) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono text-xs hidden md:flex">
      <svg className="w-3.5 h-3.5 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>{time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest border-l border-white/10 pl-3 ml-1">{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
  )
}

export default function Dashboard() {
  const [activeHub, setActiveHub] = useState<string>('jakarta')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  // Map Controls state
  const [showStations, setShowStations] = useState(true)
  const [showTrains, setShowTrains] = useState(true)
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true)

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
      <HubMapOSM key={`osm-${theme}`} activeHub={activeHub} telemetry={telemetry} theme={theme} showTrains={showTrains} />

      {/* Main UI Overlay - Layout Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
          
        {/* Top Navbar */}
        <header className={`h-16 w-full px-4 flex items-center justify-between pointer-events-auto border-b ${isDark ? 'bg-[#0E0F13]/40 backdrop-blur-xl border-white/10 shadow-lg' : 'bg-white/40 backdrop-blur-xl border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              )}
            >
              <Menu className="w-5 h-5" />
            </button>

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
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border hidden sm:flex",
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
            
            <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
              <span className="text-sm text-slate-400">Hub:</span>
              <span className="font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-white shadow-inner">
                {hubConfig.displayName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LiveTimeClock />
            {/* Theme Toggle moved to top bar */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-lg transition-all border",
                isDark 
                  ? "bg-white/5 border-white/10 text-slate-400 hover:text-[#00E0FF] hover:bg-white/10" 
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-amber-500 hover:bg-slate-200"
              )}
              title="Toggle Theme"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
          </div>
        </header>

        {/* Lower body (Sidebar + Map area) */}
        <div className="flex-1 w-full flex overflow-hidden">
            <Sidebar isExpanded={isSidebarExpanded} />

            {/* Left Side (Map controls / Info) */}
            <div className="flex-1 relative pointer-events-none">
              
              <MapControls
                isDark={isDark}
                mapType={theme}
                setMapType={(t) => setTheme(t === 'light' || t === 'standard' ? 'light' : 'dark')}
                showStations={showStations}
                setShowStations={setShowStations}
                showTrains={showTrains}
                setShowTrains={setShowTrains}
                isRealtimeEnabled={isRealtimeEnabled}
                setIsRealtimeEnabled={setIsRealtimeEnabled}
                trainsCount={telemetry.vehicleCount}
                stationsCount={42} // Default mock count
                onResetView={() => setActiveHub('jakarta')}
              />

              <MapLegend activeHub={activeHub} isDark={isDark} />

              {/* Right Floating Panel (Metrics) */}
              <div className="absolute top-6 right-6 w-80 flex flex-col gap-5 pointer-events-auto">
                {/* Metric Card 1 — Live Vehicle Count */}
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-xl transition-all hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Active Vehicles</span>
                    <Car className="w-4 h-4 text-[#00E0FF] opacity-80" />
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
                <div className="glass-panel rounded-xl p-5 border border-white/10 shadow-xl transition-all hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Network Congestion</span>
                    <Activity className="w-4 h-4 text-rose-400 opacity-80" />
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 mb-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                    <span>Free</span>
                    <span>Critical</span>
                  </div>
                </div>

                {/* Live Feed List */}
                <div className="glass-panel rounded-xl flex flex-col border border-white/10 shadow-xl max-h-72 overflow-hidden transition-all hover:bg-white/[0.02]">
                  <div className="px-5 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#00E0FF]">Live Anomalies</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E0FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E0FF]"></span>
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 custom-scrollbar">
                    <ActivityItem time="14:03" type="DELAY" desc="Route B3 running 4m late" />
                    <ActivityItem time="14:01" type="ROUTE_UPDATE" desc="Traffic reroute on M.H. Thamrin" />
                    <ActivityItem time="13:58" type="WARNING" desc="Congestion spike in Sudirman" />
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-4 py-2 flex items-center gap-2 pointer-events-auto border border-white/10 shadow-2xl">
                <button className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-colors">Heatmap</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-colors">Transit Corridors</button>
              </div>
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
