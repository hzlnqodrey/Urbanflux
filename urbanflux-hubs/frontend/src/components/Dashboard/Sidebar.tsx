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

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label?: string, active?: boolean }) {
    return (
        <button
            className={cn(
                "relative flex items-center justify-center w-[3rem] h-[3rem] rounded-xl transition-all duration-300 group overflow-visible shrink-0",
                active
                    ? "bg-gradient-to-br from-[#00E0FF]/20 to-[#00E0FF]/5 shadow-[inset_0_0_0_1px_rgba(0,224,255,0.2)]"
                    : "hover:bg-white/5"
            )}
            title={label}
        >
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E0FF] rounded-r-md shadow-[0_0_10px_#00E0FF]"></div>
            )}
            <span className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center", active ? "text-[#00E0FF]" : "text-slate-400 group-hover:text-white")}>
                {icon}
            </span>
            {/* Tooltip for collapsed sidebar */}
            {label && (
                <div className="absolute left-[4.5rem] px-3 py-1.5 bg-[#0A0B0E] border border-white/10 rounded-md text-xs font-medium text-white opacity-0 whitespace-nowrap group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] shadow-2xl flex items-center tracking-wide">
                    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0A0B0E] border-l border-b border-white/10 rotate-45"></div>
                    {label}
                </div>
            )}
        </button>
    )
}

function Logo() {
    return (
        <div className="w-[3rem] h-[3rem] flex items-center justify-center relative mb-4 shrink-0 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/10 to-[#00C27A]/10 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors"></div>
            <Globe2 className="text-white relative z-10 w-6 h-6 drop-shadow-lg group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
        </div>
    )
}

export default function Sidebar() {
    return (
        <aside className="w-[5.5rem] h-full border-r border-white/5 bg-[#0E0F13]/60 backdrop-blur-2xl flex flex-col items-center py-6 pointer-events-auto transition-all duration-300 z-50 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]">

            <Logo />

            {/* Internal Navigation Items */}
            <nav className="flex-1 w-full flex flex-col items-center gap-1.5 px-3 overflow-y-auto no-scrollbar scroll-smooth">
                <NavItem icon={<Bus />} label="Fleet Overview" active />
                <NavItem icon={<ArrowRightLeft />} label="Routes & Trajectories" />
                <NavItem icon={<GitMerge />} label="Hubs & Stations" />
                <NavItem icon={<Unplug />} label="Disruptions & Alerts" />
                <NavItem icon={<Route />} label="Route Management" />
                <NavItem icon={<BadgeInfo />} label="Driver Personnel" />
                <NavItem icon={<ClipboardList />} label="Dispatch & Assignments" />
                <NavItem icon={<FileText />} label="Reports & Logs" />
                <NavItem icon={<MonitorPlay />} label="Live Camera / CCTV" />
                <NavItem icon={<CalendarClock />} label="Timetables & Planning" />
                <NavItem icon={<Users />} label="Passenger Analytics" />
                <NavItem icon={<UserCog />} label="Admin & Operator Management" />
                <NavItem icon={<BusFront />} label="Asset Inventory" />
            </nav>

            {/* Bottom Profile Settings */}
            <div className="w-full flex-shrink-0 flex flex-col items-center justify-center pt-4 pb-2 border-t border-white/5 mt-2 gap-2">
                <NavItem icon={<CircleUser />} label="Account Profile" />
            </div>

        </aside>
    )
}
