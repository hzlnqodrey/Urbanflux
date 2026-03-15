import { useState, useEffect, useRef, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDraggableProps {
  storageKey: string
  defaultPosition: Position
  bottomRelative?: boolean
}

export function useDraggable({ storageKey, defaultPosition, bottomRelative = false }: UseDraggableProps) {
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const dragStartPos = useRef<Position>({ x: 0, y: 0 })
  const elementStartPos = useRef<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setPosition(JSON.parse(saved))
      } catch (e) {
        // use default
      }
    }
    setIsInitialized(true)
  }, [storageKey])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    dragStartPos.current = { x: clientX, y: clientY }
    elementStartPos.current = { ...position }
    document.body.style.userSelect = 'none'
  }, [position])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // only left click
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  }, [handleStart])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    
    const dx = clientX - dragStartPos.current.x
    const dy = clientY - dragStartPos.current.y
    
    let newX = elementStartPos.current.x + dx
    let newY = elementStartPos.current.y + dy

    // Keep within window bounds roughly
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width))
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height))
    }

    setPosition({ x: newX, y: newY })
  }, [isDragging])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }, [handleMove])

  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      document.body.style.userSelect = ''
      localStorage.setItem(storageKey, JSON.stringify(position))
    }
  }, [isDragging, position, storageKey])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false })
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  const resetPosition = useCallback(() => {
    setPosition(defaultPosition)
    localStorage.removeItem(storageKey)
  }, [defaultPosition, storageKey])

  return {
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    resetPosition,
    isInitialized
  }
}
