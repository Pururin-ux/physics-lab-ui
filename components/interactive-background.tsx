"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: "atom" | "formula" | "star"
  rotation: number
  rotationSpeed: number
  opacity: number
  formula?: string
  baseOpacity: number
}

const FORMULAS = [
  "E=mc²",
  "F=ma",
  "v=v₀+at",
  "s=½at²",
  "p=mv",
  "ω=2πf",
]

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number>(0)

  const createParticle = useCallback((width: number, height: number): Particle => {
    // More stars, fewer atoms/formulas for subtlety
    const rand = Math.random()
    const type: Particle["type"] = rand < 0.75 ? "star" : rand < 0.9 ? "atom" : "formula"
    const baseOpacity = type === "star" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.12 + 0.04
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: type === "star" ? Math.random() * 1.5 + 0.5 : Math.random() * 10 + 8,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      opacity: baseOpacity,
      baseOpacity,
      formula: type === "formula" ? FORMULAS[Math.floor(Math.random() * FORMULAS.length)] : undefined,
    }
  }, [])

  const drawAtom = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)
    ctx.globalAlpha = p.opacity

    // Nucleus - subtle glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.2)
    gradient.addColorStop(0, "rgba(250, 204, 21, 0.6)")
    gradient.addColorStop(1, "rgba(250, 204, 21, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, p.size * 0.12, 0, Math.PI * 2)
    ctx.fill()

    // Single orbit ring
    ctx.strokeStyle = "rgba(250, 204, 21, 0.15)"
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.25, 0, 0, Math.PI * 2)
    ctx.stroke()

    // One electron
    const angle = p.rotation * 1.5
    const ex = Math.cos(angle) * p.size * 0.6
    const ey = Math.sin(angle) * p.size * 0.25
    ctx.fillStyle = "rgba(96, 165, 250, 0.5)"
    ctx.beginPath()
    ctx.arc(ex, ey, 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, [])

  const drawFormula = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.globalAlpha = p.opacity
    ctx.font = `${p.size}px "JetBrains Mono", monospace`
    ctx.fillStyle = "rgba(250, 204, 21, 0.4)"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(p.formula || "E=mc²", 0, 0)
    ctx.restore()
  }, [])

  const drawStar = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    // Gentle twinkle
    const twinkle = 0.7 + Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.3
    ctx.globalAlpha = p.opacity * twinkle
    
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(0, 0, p.size, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Fewer particles for subtlety
      const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 40000))
      particlesRef.current = Array.from({ length: particleCount }, () => 
        createParticle(canvas.width, canvas.height)
      )
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const mouse = mouseRef.current
      const MOUSE_RADIUS = 100
      const PUSH_FORCE = 0.3 // Much gentler push

      particlesRef.current.forEach((p) => {
        // Gentle mouse interaction
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * PUSH_FORCE
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }

        // Very slow movement with high friction
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.995
        p.vy *= 0.995
        p.rotation += p.rotationSpeed

        // Wrap around edges
        if (p.x < -30) p.x = canvas.width + 30
        if (p.x > canvas.width + 30) p.x = -30
        if (p.y < -30) p.y = canvas.height + 30
        if (p.y > canvas.height + 30) p.y = -30

        // Draw based on type
        switch (p.type) {
          case "atom":
            drawAtom(ctx, p)
            break
          case "formula":
            drawFormula(ctx, p)
            break
          case "star":
            drawStar(ctx, p)
            break
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationRef.current)
    }
  }, [createParticle, drawAtom, drawFormula, drawStar])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
}
