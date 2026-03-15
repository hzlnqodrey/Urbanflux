'use client'

import React from 'react'
import {
    Bus,
    ArrowRightLeft,
    GitMerge,
    Unplug,
    Route,
    BadgeInfo,
    ClipboardList,
    FileText,
    MonitorPlay,
    CalendarClock,
    Users,
    UserCog,
    BusFront,
    CircleUser,
    Globe2
} from 'lucide-react'
import { cn } from '@/lib/utils'

function NavItem({ icon, label, active = false, isExpanded = true }: { icon: React.ReactNode, label?: string, active?: boolean, isExpanded?: boolean }) {
    return (
        <button
            className={cn(
                "relative flex items-center justify-center w-full h-[3rem] rounded-xl transition-all duration-300 group overflow-visible shrink-0",
                active
                    ? "bg-gradient-to-br from-[#00E0FF]/20 to-[#00E0FF]/5 shadow-[inset_0_0_0_1px_rgba(0,224,255,0.2)]"
                    : "hover:bg-white/5",
                isExpanded ? "px-4 justify-start" : "px-0 justify-center"
            )}
            title={label}
        >
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E0FF] rounded-r-md shadow-[0_0_10px_#00E0FF]"></div>
            )}
            <span className={cn("w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center", active ? "text-[#00E0FF]" : "text-slate-400 group-hover:text-white")}>
                {icon}
            </span>
            {isExpanded && label && (
                <span className={cn("ml-4 text-sm font-medium tracking-wide text-left truncate", active ? "text-white" : "text-slate-400 group-hover:text-white transition-colors duration-300")}>
                    {label}
                </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && label && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0A0B0E] border border-white/10 rounded-lg text-xs font-medium text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                    {label}
                </div>
            )}
        </button>
    )
}

function Logo({ isExpanded = true }: { isExpanded?: boolean }) {
    return (
        <div className={cn("w-full px-4 flex items-center relative mb-4 shrink-0 group cursor-pointer", isExpanded ? "justify-start gap-4" : "justify-center")}>
            <div className="w-[3rem] h-[3rem] flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/10 to-[#00C27A]/10 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors"></div>
                <Globe2 className="text-white relative z-10 w-6 h-6 drop-shadow-lg group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            {isExpanded && (
                <span className="font-mono font-bold text-lg tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">URBANFLUX</span>
            )}
        </div>
    )
}

interface SidebarProps {
    isExpanded?: boolean;
}

export default function Sidebar({ isExpanded = true }: SidebarProps) {
    return (
        <aside className={cn(
            "h-full border-r border-white/5 bg-[#0E0F13]/60 backdrop-blur-2xl flex flex-col py-6 pointer-events-auto transition-all duration-300 z-50 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]",
            isExpanded ? "w-[18rem]" : "w-[5rem]"
        )}>

            <Logo isExpanded={isExpanded} />

            {/* Internal Navigation Items */}
            <nav className="flex-1 w-full flex flex-col items-center gap-1.5 px-3 overflow-y-auto custom-scrollbar scroll-smooth">
                <NavItem isExpanded={isExpanded} icon={<Bus />} label="Fleet Overview" active />
                <NavItem isExpanded={isExpanded} icon={<ArrowRightLeft />} label="Routes & Trajectories" />
                <NavItem isExpanded={isExpanded} icon={<GitMerge />} label="Hubs & Stations" />
                <NavItem isExpanded={isExpanded} icon={<Unplug />} label="Disruptions & Alerts" />
                <NavItem isExpanded={isExpanded} icon={<Route />} label="Route Management" />
                <NavItem isExpanded={isExpanded} icon={<BadgeInfo />} label="Driver Personnel" />
                <NavItem isExpanded={isExpanded} icon={<ClipboardList />} label="Dispatch & Assignments" />
                <NavItem isExpanded={isExpanded} icon={<FileText />} label="Reports & Logs" />
                <NavItem isExpanded={isExpanded} icon={<MonitorPlay />} label="Live Camera / CCTV" />
                <NavItem isExpanded={isExpanded} icon={<CalendarClock />} label="Timetables & Planning" />
                <NavItem isExpanded={isExpanded} icon={<Users />} label="Passenger Analytics" />
                <NavItem isExpanded={isExpanded} icon={<UserCog />} label="Admin & Operator Management" />
                <NavItem isExpanded={isExpanded} icon={<BusFront />} label="Asset Inventory" />
            </nav>

            {/* Bottom Profile Settings */}
            <div className="w-full px-3 flex-shrink-0 flex flex-col pt-4 pb-2 border-t border-white/5 mt-2 gap-2">
                <NavItem isExpanded={isExpanded} icon={<CircleUser />} label="Account Profile" />
            </div>

        </aside>
    )
}
