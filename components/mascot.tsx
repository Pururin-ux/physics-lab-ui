"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

interface MascotProps {
  message?: string
  position?: "hero" | "corner"
  className?: string
}

// Main mascot that "lives" on the page without frame
export function Mascot({ message, position = "hero", className = "" }: MascotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [blinkState, setBlinkState] = useState(false)
  const [breatheOffset, setBreatheOffset] = useState(0)
  const [headTilt, setHeadTilt] = useState(0)
  const [isWaving, setIsWaving] = useState(false)
  const mascotRef = useRef<HTMLDivElement>(null)

  // Blinking animation - random intervals
  useEffect(() => {
    const blink = () => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 150)
    }

    const scheduleNextBlink = () => {
      const nextBlink = 2000 + Math.random() * 4000 // 2-6 seconds
      return setTimeout(() => {
        blink()
        scheduleNextBlink()
      }, nextBlink)
    }

    const timeout = scheduleNextBlink()
    return () => clearTimeout(timeout)
  }, [])

  // Breathing animation
  useEffect(() => {
    let frame: number
    const animate = () => {
      const time = Date.now() * 0.001
      setBreatheOffset(Math.sin(time * 1.5) * 2)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Subtle head movement following mouse (only when not waving)
  useEffect(() => {
    if (isWaving) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return
      const rect = mascotRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const deltaX = e.clientX - centerX
      // Subtle tilt based on mouse position
      const maxTilt = 3
      const tilt = Math.max(-maxTilt, Math.min(maxTilt, deltaX * 0.005))
      setHeadTilt(tilt)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isWaving])

  // Wave animation on hover
  useEffect(() => {
    if (isHovered && !isWaving) {
      setIsWaving(true)
      setTimeout(() => setIsWaving(false), 1500)
    }
  }, [isHovered, isWaving])

  const sizeClass = position === "hero" ? "w-80 h-96" : "w-48 h-56"

  return (
    <div
      ref={mascotRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech bubble - appears on hover */}
      <div
        className={`
          absolute -top-4 left-0 right-0 mx-auto w-max max-w-[280px]
          px-4 py-3 rounded-2xl z-20
          bg-zinc-900/90 backdrop-blur-md
          border border-yellow-400/30
          shadow-xl shadow-black/30
          transform transition-all duration-500 ease-out
          ${isHovered ? "opacity-100 -translate-y-4" : "opacity-0 translate-y-0 pointer-events-none"}
        `}
      >
        <p className="text-sm text-zinc-100 font-medium leading-relaxed text-center">
          {message || "Привет! Давай разберёмся с физикой вместе!"}
        </p>
        {/* Bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900/90 border-b border-r border-yellow-400/30 rotate-45" />
      </div>

      {/* Mascot image container - no frame, transparent bg */}
      <div
        className={`
          relative ${sizeClass}
          transition-transform duration-300 ease-out
        `}
        style={{
          transform: `
            translateY(${breatheOffset}px) 
            rotate(${headTilt}deg)
            scale(${isHovered ? 1.02 : 1})
          `,
        }}
      >
        {/* Subtle glow behind mascot */}
        <div
          className={`
            absolute inset-0 rounded-full blur-3xl
            bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent
            transition-opacity duration-500
            ${isHovered ? "opacity-100" : "opacity-50"}
          `}
          style={{ transform: "scale(1.2) translateY(20%)" }}
        />

        {/* Mascot image */}
        <Image
          src="/mascot.png"
          alt="Физа - маскот PhysicsLab"
          fill
          className={`
            object-contain object-bottom drop-shadow-2xl
            transition-all duration-150
            ${blinkState ? "brightness-95" : "brightness-100"}
          `}
          style={{
            filter: `drop-shadow(0 0 30px rgba(250, 204, 21, ${isHovered ? 0.15 : 0.05}))`,
          }}
          priority
        />

        {/* Sparkle effects when hovered */}
        {isHovered && (
          <>
            <Sparkle delay={0} x="10%" y="20%" />
            <Sparkle delay={200} x="85%" y="15%" />
            <Sparkle delay={400} x="75%" y="45%" />
          </>
        )}
      </div>
    </div>
  )
}

// Sparkle effect component
function Sparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), delay)
    const hideTimeout = setTimeout(() => setVisible(false), delay + 600)
    return () => {
      clearTimeout(showTimeout)
      clearTimeout(hideTimeout)
    }
  }, [delay])

  return (
    <div
      className={`
        absolute w-2 h-2 pointer-events-none
        transition-all duration-300
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
      style={{ left: x, top: y }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </div>
  )
}

// Floating mascot in corner - minimal, clean
export function FloatingMascot() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [breathe, setBreathe] = useState(0)

  const tips = [
    "Ускорение всегда направлено в сторону изменения скорости!",
    "Свет проходит от Солнца до Земли за 8 минут.",
    "Рисуй диаграммы сил - это помогает решать задачи!",
    "Скорость звука в воде в 4 раза больше, чем в воздухе.",
    "При свободном падении все тела ускоряются одинаково!",
    "Энергия не исчезает, она лишь переходит из одной формы в другую.",
  ]

  // Breathing
  useEffect(() => {
    let frame: number
    const animate = () => {
      setBreathe(Math.sin(Date.now() * 0.002) * 2)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tip panel */}
      <div
        className={`
          w-72 p-4 rounded-2xl
          bg-zinc-900/95 backdrop-blur-xl
          border border-zinc-800
          shadow-2xl shadow-black/50
          transition-all duration-300 ease-out origin-bottom-right
          ${isExpanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"}
        `}
      >
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-yellow-400/30">
            <Image
              src="/mascot.png"
              alt="Физа"
              width={40}
              height={40}
              className="object-cover object-top scale-150 translate-y-1"
            />
          </div>
          <div className="flex-1">
            <p className="text-yellow-400 font-semibold text-sm mb-1">Совет от Физы</p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {tips[currentTip]}
            </p>
          </div>
        </div>
        <button
          onClick={nextTip}
          className="
            w-full py-2 rounded-lg text-sm font-medium
            bg-yellow-400/10 text-yellow-400
            hover:bg-yellow-400/20 transition-colors
            border border-yellow-400/20
          "
        >
          Другой совет
        </button>
      </div>

      {/* Mascot button - transparent, no frame */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-20 h-24 transition-transform duration-300 hover:scale-105"
        style={{ transform: `translateY(${breathe}px)` }}
      >
        {/* Glow effect */}
        <div
          className={`
            absolute inset-0 rounded-full blur-2xl
            bg-yellow-400/20 transition-opacity duration-300
            ${isExpanded ? "opacity-100" : "opacity-50"}
          `}
          style={{ transform: "scale(0.8) translateY(30%)" }}
        />

        <Image
          src="/mascot.png"
          alt="Физа"
          fill
          className="object-contain object-bottom drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 15px rgba(250, 204, 21, ${isExpanded ? 0.3 : 0.1}))`,
          }}
        />

        {/* Notification pulse */}
        {!isExpanded && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400" />
          </span>
        )}
      </button>
    </div>
  )
}
