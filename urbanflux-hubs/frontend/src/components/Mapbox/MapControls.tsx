'use client'

import { useState, useEffect } from 'react'
import { 
  Train, 
  MapPin, 
  Play, 
  Pause, 
  Map, 
  Satellite, 
  Mountain,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Moon,
  Sun,
  GripVertical,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDraggable } from '@/hooks/useDraggable'

interface MapControlsProps {
  showStations: boolean
  setShowStations: (show: boolean) => void
  showTrains: boolean
  setShowTrains: (show: boolean) => void
  mapType: 'standard' | 'satellite' | 'terrain' | 'dark' | 'light'
  setMapType: (type: 'standard' | 'satellite' | 'terrain' | 'dark' | 'light') => void
  isRealtimeEnabled: boolean
  setIsRealtimeEnabled: (enabled: boolean) => void
  trainsCount: number
  stationsCount: number
  forceExpanded?: boolean
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetView?: () => void
  isDark?: boolean
}

export function MapControls({
  showStations,
  setShowStations,
  showTrains,
  setShowTrains,
  mapType,
  setMapType,
  isRealtimeEnabled,
  setIsRealtimeEnabled,
  trainsCount,
  stationsCount,
  forceExpanded = false,
  onZoomIn,
  onZoomOut,
  onResetView,
  isDark = true
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Draggable functionality
  const {
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    resetPosition,
    isInitialized
  } = useDraggable({
    storageKey: 'map-controls-position',
    defaultPosition: { x: 24, y: 100 },
    bottomRelative: true
  })
  
  // Update expanded state when forceExpanded changes
  useEffect(() => {
    if (forceExpanded) {
      setIsExpanded(true)
    }
  }, [forceExpanded])

  const mapTypeOptions = [
    { value: 'standard', label: 'Standard', icon: Map },
    { value: 'satellite', label: 'Satellite', icon: Satellite },
    { value: 'terrain', label: 'Terrain', icon: Mountain },
    { value: 'dark', label: 'Dark', icon: Moon }
  ] as const

  // Don't render until position is initialized
  if (!isInitialized) return null

  // Helper colors based on theme to merge user components into Urbanflux "glass" theme naturally
  const panelBg = isDark ? "bg-[#0A0B0E]/80 backdrop-blur-md border-white/5 text-slate-200" : "bg-white/90 backdrop-blur-md border-slate-200 text-slate-800"
  const headerBg = isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"
  const itemHover = isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
  const itemActive = isDark ? "bg-[#00E0FF]/10 text-[#00E0FF]" : "bg-blue-100 text-blue-700"
  const itemInactive = isDark ? "bg-white/5 text-slate-400" : "bg-gray-100 text-gray-600"
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-[1000] pointer-events-auto",
        isDragging && "cursor-grabbing select-none"
      )}
      style={{
        left: position.x,
        top: position.y,
        touchAction: 'none'
      }}
    >
      {/* Main Controls Panel */}
      <div className={cn("rounded-xl shadow-2xl border overflow-hidden transition-colors w-64", panelBg)}>
        {/* Drag Handle Header */}
        <div 
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b transition-colors",
            headerBg,
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center gap-1.5 opacity-70">
            <GripVertical className="w-4 h-4" />
            <Settings className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Controls</span>
          </div>
          <button
            onClick={resetPosition}
            onMouseDown={(e) => e.stopPropagation()}
            className={cn("p-1 transition-colors rounded", itemHover)}
            title="Reset position"
          >
            <RotateCcw className="w-3 h-3 opacity-70" />
          </button>
        </div>

        {/* Always Visible Controls */}
        <div className="p-3 space-y-3">
          {/* Real-time Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Real-time
            </span>
            <button
              onClick={() => setIsRealtimeEnabled(!isRealtimeEnabled)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors border",
                isRealtimeEnabled
                  ? (isDark ? "bg-[#00C27A]/10 text-[#00C27A] border-[#00C27A]/20" : "bg-green-100 text-green-700 border-green-200")
                  : (isDark ? "bg-white/5 text-slate-400 border-white/5" : "bg-gray-100 text-gray-600 border-gray-200")
              )}
            >
              {isRealtimeEnabled ? (
                 <>
                   <span className="relative flex h-2 w-2 mr-1">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor: isDark ? '#00C27A' : '#15803d'}}></span>
                     <span className="relative inline-flex rounded-full h-2 w-2" style={{backgroundColor: isDark ? '#00C27A' : '#15803d'}}></span>
                   </span>
                   <span className="text-xs font-bold font-mono">LIVE</span>
                 </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  <span className="text-xs font-medium font-mono">PAUSED</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Layer Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTrains(!showTrains)}
              className={cn(
                "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border",
                showTrains ? (isDark ? "bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/20" : "bg-blue-100 text-blue-700 border-blue-200") : (isDark ? "bg-white/5 text-slate-500 border-white/5" : "bg-gray-100 text-gray-500 border-gray-200")
              )}
            >
              <Train className="w-3.5 h-3.5" />
              <span className="font-bold">{trainsCount}</span>
            </button>
            
            <button
              onClick={() => setShowStations(!showStations)}
              className={cn(
                "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border",
                showStations ? (isDark ? "bg-[#00C27A]/10 text-[#00C27A] border-[#00C27A]/20" : "bg-emerald-100 text-emerald-700 border-emerald-200") : (isDark ? "bg-white/5 text-slate-500 border-white/5" : "bg-gray-100 text-gray-500 border-gray-200")
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-bold">{stationsCount}</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-50">Zoom</span>
            <div className="flex items-center gap-1">
              <button onClick={onZoomOut} className={cn("p-1.5 rounded-lg transition-colors opacity-70", itemHover)} title="Zoom out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={onZoomIn} className={cn("p-1.5 rounded-lg transition-colors opacity-70", itemHover)} title="Zoom in">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={onResetView} className={cn("p-1.5 rounded-lg transition-colors opacity-70", itemHover)} title="Reset view">
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Section */}
        {isExpanded && (
          <div className="border-t border-white/5 p-3 space-y-4">
            {/* Layer Visibility */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-semibold opacity-50 uppercase tracking-widest">
                Layers
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className={cn("w-4 h-4", isDark ? "text-[#00E0FF]" : "text-blue-600")} />
                    <span className="text-xs font-medium">Vehicles</span>
                  </div>
                  <button onClick={() => setShowTrains(!showTrains)} className="opacity-50 hover:opacity-100 transition-opacity">
                    {showTrains ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className={cn("w-4 h-4", isDark ? "text-[#00C27A]" : "text-emerald-600")} />
                    <span className="text-xs font-medium">Stations & Hubs</span>
                  </div>
                  <button onClick={() => setShowStations(!showStations)} className="opacity-50 hover:opacity-100 transition-opacity">
                    {showStations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Map Type Selection */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-semibold opacity-50 uppercase tracking-widest">
                Map Type
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {mapTypeOptions.filter(o => o.value === 'dark' || o.value === 'standard').map((option) => {
                  const IconComponent = option.icon;
                  // Map 'standard' to 'light' for UI purposes
                  const effectiveOptionVal = option.value === 'standard' ? 'light' : 'dark';
                  return (
                    <button
                      key={option.value}
                      onClick={() => setMapType(effectiveOptionVal as any)}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg text-xs transition-colors border",
                        mapType === effectiveOptionVal
                          ? itemActive + (isDark ? " border-[#00E0FF]/20" : "")
                          : itemInactive + " border-transparent"
                      )}
                    >
                      <IconComponent className="w-4 h-4 mb-1" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full px-3 py-2 border-t text-[10px] uppercase tracking-widest font-semibold opacity-70 transition-colors flex items-center justify-center space-x-1",
            headerBg,
            itemHover
          )}
        >
          <span>{isExpanded ? 'Less Controls' : 'More Controls'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Drag indicator overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[-1] bg-black/5 pointer-events-none" />
      )}
    </div>
  )
}
