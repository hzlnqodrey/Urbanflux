'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { HUB_CONFIGS } from '@/lib/hub-config'

interface MapLegendProps {
    activeHub: string
    isDark?: boolean
}

export function MapLegend({ activeHub, isDark = true }: MapLegendProps) {
    const hubConfig = HUB_CONFIGS[activeHub] || HUB_CONFIGS['jakarta']
    const colors = hubConfig.modeColors

    const legendItems = [
        { label: 'Bus (BRT)', color: colors['BUS'] },
        { label: 'Rail / Train', color: colors['RAIL'] },
        { label: 'Metro (MRT)', color: colors['METRO'] },
        { label: 'Tram', color: colors['TRAM'] },
    ]

    return (
        <div className={cn(
            "absolute bottom-6 left-6 z-[1000] p-4 rounded-xl border pointer-events-auto shadow-2xl backdrop-blur-md flex flex-col gap-3 w-48 transition-all hover:bg-white/[0.02]",
            isDark ? "bg-[#0E0F13]/80 border-white/10" : "bg-white/80 border-slate-200"
        )}>
            <div className="flex items-center gap-2 mb-1">
                <svg className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                <span className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>Map Legend</span>
            </div>
            
            <div className="flex flex-col gap-2">
                {legendItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-3 h-3">
                            <span className="absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: item.color }}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 shadow-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></span>
                        </div>
                        <span className={cn("text-xs font-medium font-mono", isDark ? "text-slate-400" : "text-slate-600")}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
