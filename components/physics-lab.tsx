"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

// ── SVG layout constants ──────────────────────────────────────────
const GW = 480        // graph width
const GH = 160        // graph height
const PL = 52         // left padding (room for y-axis labels)
const PR = 12         // right padding
const PT = 12         // top padding
const PB = 32         // bottom padding (room for x-axis labels)
const PLOT_W = GW - PL - PR
const PLOT_H = GH - PT - PB

// Number-line layout
const NLW = 480
const NLH = 80
const NL_Y = 48       // y of the horizontal line
const NL_LEFT = 40
const NL_RIGHT = NLW - 40

// ── helpers ───────────────────────────────────────────────────────
function niceStepAndCount(range: number, maxTicks: number): number {
  const rough = range / maxTicks
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  const norm = rough / mag
  let nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  return nice * mag
}

function gridTicks(lo: number, hi: number, maxTicks = 5): number[] {
  const step = niceStepAndCount(hi - lo, maxTicks)
  const start = Math.ceil(lo / step) * step
  const ticks: number[] = []
  for (let v = start; v <= hi + 1e-9; v += step) {
    ticks.push(parseFloat(v.toFixed(10)))
  }
  return ticks
}

export default function PhysicsLab() {
  // ── parameters ───────────────────────────────────────────────────
  const [v0, setV0] = useState(2)
  const [a, setA] = useState(1)
  const [tMax, setTMax] = useState(10)

  // ── animation ────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const isPlayingRef = useRef(false)
  isPlayingRef.current = isPlaying

  // ── practice ─────────────────────────────────────────────────────
  const [practiceAnswer, setPracticeAnswer] = useState("")
  const [practiceResult, setPracticeResult] = useState<"correct" | "incorrect" | null>(null)

  // ── physics ──────────────────────────────────────────────────────
  const velocity = useCallback((t: number) => v0 + a * t, [v0, a])
  const position = useCallback((t: number) => v0 * t + 0.5 * a * t * t, [v0, a])

  const currentV = velocity(currentTime)
  const currentX = position(currentTime)

  // ── scale extents ────────────────────────────────────────────────
  const { vLo, vHi, xLo, xHi } = useMemo(() => {
    const samples = 60
    let vMin = Infinity, vMax = -Infinity
    let xMin = Infinity, xMax = -Infinity
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax
      const v = velocity(t)
      const x = position(t)
      if (v < vMin) vMin = v
      if (v > vMax) vMax = v
      if (x < xMin) xMin = x
      if (x > xMax) xMax = x
    }
    const vPad = Math.max((vMax - vMin) * 0.15, 0.5)
    const xPad = Math.max((xMax - xMin) * 0.15, 0.5)
    return {
      vLo: vMin - vPad, vHi: vMax + vPad,
      xLo: Math.min(0, xMin - xPad), xHi: xMax + xPad,
    }
  }, [velocity, position, tMax])

  // ── graph path generators ─────────────────────────────────────────
  const toSvgX = (t: number) => PL + (t / tMax) * PLOT_W
  const toVy   = (v: number) => PT + PLOT_H - ((v - vLo) / (vHi - vLo)) * PLOT_H
  const toXy   = (x: number) => PT + PLOT_H - ((x - xLo) / (xHi - xLo)) * PLOT_H

  const velocityPath = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * tMax
      pts.push(`${toSvgX(t).toFixed(2)},${toVy(velocity(t)).toFixed(2)}`)
    }
    return `M ${pts.join(" L ")}`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tMax, vLo, vHi, velocity])

  const positionPath = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * tMax
      pts.push(`${toSvgX(t).toFixed(2)},${toXy(position(t)).toFixed(2)}`)
    }
    return `M ${pts.join(" L ")}`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tMax, xLo, xHi, position])

  const cursorSvgX = toSvgX(currentTime)
  const cursorVy   = toVy(currentV)
  const cursorXy   = toXy(currentX)

  // ── tick marks ───────────────────────────────────────────────────
  const tTicks = useMemo(() => gridTicks(0, tMax, 6), [tMax])
  const vTicks = useMemo(() => gridTicks(vLo, vHi, 5), [vLo, vHi])
  const xTicks = useMemo(() => gridTicks(xLo, xHi, 5), [xLo, xHi])

  // ── number-line position ──────────────────────────────────────────
  // Map real-world x [-10, 10] → SVG x [NL_LEFT, NL_RIGHT]
  const NL_WORLD_LO = -10
  const NL_WORLD_HI = 10
  const nlToSvgX = (worldX: number) =>
    NL_LEFT + ((worldX - NL_WORLD_LO) / (NL_WORLD_HI - NL_WORLD_LO)) * (NL_RIGHT - NL_LEFT)

  const clampedX = Math.max(NL_WORLD_LO, Math.min(NL_WORLD_HI, currentX))
  const dotX = nlToSvgX(clampedX)

  // Arrow: velocity direction & magnitude, max ±60px
  const arrowScale = (NL_RIGHT - NL_LEFT) / (NL_WORLD_HI - NL_WORLD_LO)
  const rawArrow = currentV * arrowScale
  const maxArrow = 70
  const arrowLen = Math.max(-maxArrow, Math.min(maxArrow, rawArrow))
  const arrowEndX = dotX + arrowLen
  const arrowDir = arrowLen >= 0 ? 1 : -1
  // Arrow color: green for positive velocity, red for negative
  const arrowColor = currentV >= 0 ? "#22c55e" : "#ef4444"

  // ── animation loop ────────────────────────────────────────────────
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp
      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setCurrentTime((prev) => {
        const next = prev + delta
        if (next >= tMax) {
          setIsPlaying(false)
          return tMax
        }
        return next
      })

      if (isPlayingRef.current) {
        animationRef.current = requestAnimationFrame(animate)
      }
    },
    [tMax]
  )

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, animate])

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    lastTimeRef.current = 0
    setPracticeResult(null)
    setPracticeAnswer("")
  }

  const handleTimeSliderChange = (value: number[]) => {
    setCurrentTime(value[0])
    if (isPlaying) setIsPlaying(false)
  }

  // ── practice question: dynamic based on current params ─────────────────
  // Use 2 seconds as the practice time if tMax >= 4, otherwise tMax/2
  const practiceT = tMax >= 4 ? 2 : parseFloat((tMax / 2).toFixed(1))
  const practiceCorrect = position(practiceT)

  const checkAnswer = () => {
    const user = parseFloat(practiceAnswer)
    if (isNaN(user)) return
    setPracticeResult(Math.abs(user - practiceCorrect) < 0.5 ? "correct" : "incorrect")
  }

  // ── reset practice when params change ────────────────────────────
  useEffect(() => {
    setPracticeResult(null)
    setPracticeAnswer("")
  }, [v0, a, tMax])

  // ── NL tick positions ──────────────────────────────────────────────
  const nlTicks = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Title ── */}
        <h1 className="text-xl font-semibold tracking-wide text-zinc-200">
          Uniformly Accelerated Motion — Interactive Lab
        </h1>

        {/* ══ Main 3-column layout ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-5">

          {/* ── LEFT SIDEBAR ── */}
          <div className="space-y-4">

            {/* Play/Pause + Reset */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Single toggle play/pause button */}
                <div className="flex flex-col items-center gap-1">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-mono text-lg h-11"
                    variant="outline"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </Button>
                  <span className="text-[11px] text-zinc-500">Play / Pause</span>
                </div>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100 h-9"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  Reset
                </Button>
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400 font-medium">
                    v₀ — initial velocity
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={v0}
                      onChange={(e) => { setV0(parseFloat(e.target.value) || 0); handleReset() }}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm font-mono"
                    />
                    <span className="text-xs text-zinc-500 shrink-0">m/s</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400 font-medium">
                    a — acceleration
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={a}
                      onChange={(e) => { setA(parseFloat(e.target.value) || 0); handleReset() }}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm font-mono"
                    />
                    <span className="text-xs text-zinc-500 shrink-0">m/s²</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400 font-medium">
                    t* — max time
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tMax}
                      onChange={(e) => {
                        setTMax(Math.max(1, parseFloat(e.target.value) || 1))
                        handleReset()
                      }}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm font-mono"
                    />
                    <span className="text-xs text-zinc-500 shrink-0">s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── CENTER ── */}
          <div className="space-y-4">

            {/* Number-line visualisation */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <div className="text-[11px] text-zinc-500 mb-1 uppercase tracking-wider">
                  Object position on number line
                </div>
                <svg viewBox={`0 0 ${NLW} ${NLH}`} className="w-full h-auto" style={{ maxHeight: 88 }}>
                  {/* Tick marks */}
                  {nlTicks.map((wx) => {
                    const sx = nlToSvgX(wx)
                    return (
                      <g key={wx}>
                        <line x1={sx} y1={NL_Y - 5} x2={sx} y2={NL_Y + 5} stroke="#3f3f46" strokeWidth="1" />
                        <text x={sx} y={NL_Y + 17} textAnchor="middle" fill="#52525b" fontSize="9">
                          {wx}
                        </text>
                      </g>
                    )
                  })}
                  {/* Axis line */}
                  <line x1={NL_LEFT} y1={NL_Y} x2={NL_RIGHT} y2={NL_Y} stroke="#52525b" strokeWidth="1.5" />
                  {/* Axis label */}
                  <text x={NL_RIGHT + 6} y={NL_Y + 4} fill="#52525b" fontSize="10">m</text>

                  {/* Velocity arrow (above the dot) - disappears at v=0 */}
                  {Math.abs(arrowLen) > 2 && (
                    <g>
                      <line
                        x1={dotX} y1={NL_Y - 16}
                        x2={arrowEndX} y2={NL_Y - 16}
                        stroke={arrowColor} strokeWidth="2"
                      />
                      {/* Arrowhead */}
                      <polygon
                        points={`
                          ${arrowEndX},${NL_Y - 16}
                          ${arrowEndX - arrowDir * 7},${NL_Y - 20}
                          ${arrowEndX - arrowDir * 7},${NL_Y - 12}
                        `}
                        fill={arrowColor}
                      />
                      <text
                        x={(dotX + arrowEndX) / 2}
                        y={NL_Y - 24}
                        textAnchor="middle"
                        fill={arrowColor}
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        v={currentV.toFixed(1)} m/s
                      </text>
                    </g>
                  )}

                  {/* Object dot */}
                  <circle cx={dotX} cy={NL_Y} r="7" fill="#60a5fa" />
                </svg>
              </CardContent>
            </Card>

            {/* v(t) Velocity Graph */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[11px] text-yellow-400 font-mono font-semibold">v(t)</span>
                  <span className="text-[11px] text-zinc-500">Velocity over time</span>
                </div>
                <div className="flex gap-1">
                  {/* Y-axis title */}
                  <div className="flex items-center justify-center" style={{ width: 16, minHeight: GH }}>
                    <span
                      className="text-[10px] text-zinc-500 font-mono"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      v, m/s
                    </span>
                  </div>
                  <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full h-auto flex-1" style={{ maxHeight: 170 }}>
                    {/* Subtle horizontal grid lines */}
                    {vTicks.map((v) => {
                      const sy = toVy(v)
                      return (
                        <line key={v} x1={PL} y1={sy} x2={GW - PR} y2={sy}
                          stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                      )
                    })}

                    {/* Axes */}
                    <line x1={PL} y1={PT} x2={PL} y2={PT + PLOT_H} stroke="#3f3f46" strokeWidth="1.5" />
                    <line x1={PL} y1={PT + PLOT_H} x2={GW - PR} y2={PT + PLOT_H} stroke="#3f3f46" strokeWidth="1.5" />

                    {/* Y tick labels */}
                    {vTicks.map((v) => (
                      <text key={v} x={PL - 5} y={toVy(v) + 4}
                        textAnchor="end" fill="#52525b" fontSize="11" fontFamily="monospace">
                        {v % 1 === 0 ? v : v.toFixed(1)}
                      </text>
                    ))}

                    {/* X tick labels */}
                    {tTicks.map((t) => (
                      <text key={t} x={toSvgX(t)} y={PT + PLOT_H + 14}
                        textAnchor="middle" fill="#52525b" fontSize="11" fontFamily="monospace">
                        {t}
                      </text>
                    ))}

                    {/* Zero line highlighted */}
                    {vLo < 0 && vHi > 0 && (
                      <line x1={PL} y1={toVy(0)} x2={GW - PR} y2={toVy(0)}
                        stroke="#52525b" strokeWidth="1.5" />
                    )}

                    {/* Velocity line */}
                    <path d={velocityPath} fill="none" stroke="#facc15" strokeWidth="2.5" />

                    {/* Cursor */}
                    <line x1={cursorSvgX} y1={PT} x2={cursorSvgX} y2={PT + PLOT_H}
                      stroke="#ffffff" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                    <circle cx={cursorSvgX} cy={cursorVy} r="5" fill="#facc15" stroke="#18181b" strokeWidth="1.5" />
                  </svg>
                </div>
                {/* X-axis title */}
                <div className="text-center text-[10px] text-zinc-500 font-mono mt-0.5" style={{ marginLeft: PL + 16 }}>
                  t, s
                </div>
              </CardContent>
            </Card>

            {/* x(t) Position Graph */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[11px] text-blue-400 font-mono font-semibold">x(t)</span>
                  <span className="text-[11px] text-zinc-500">Position over time</span>
                </div>
                <div className="flex gap-1">
                  <div className="flex items-center justify-center" style={{ width: 16, minHeight: GH }}>
                    <span
                      className="text-[10px] text-zinc-500 font-mono"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      x, m
                    </span>
                  </div>
                  <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full h-auto flex-1" style={{ maxHeight: 170 }}>
                    {/* Subtle horizontal grid lines */}
                    {xTicks.map((x) => {
                      const sy = toXy(x)
                      return (
                        <line key={x} x1={PL} y1={sy} x2={GW - PR} y2={sy}
                          stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                      )
                    })}

                    {/* Axes */}
                    <line x1={PL} y1={PT} x2={PL} y2={PT + PLOT_H} stroke="#3f3f46" strokeWidth="1.5" />
                    <line x1={PL} y1={PT + PLOT_H} x2={GW - PR} y2={PT + PLOT_H} stroke="#3f3f46" strokeWidth="1.5" />

                    {/* Y labels */}
                    {xTicks.map((x) => (
                      <text key={x} x={PL - 5} y={toXy(x) + 4}
                        textAnchor="end" fill="#52525b" fontSize="11" fontFamily="monospace">
                        {x % 1 === 0 ? x : x.toFixed(1)}
                      </text>
                    ))}

                    {/* X labels */}
                    {tTicks.map((t) => (
                      <text key={t} x={toSvgX(t)} y={PT + PLOT_H + 14}
                        textAnchor="middle" fill="#52525b" fontSize="11" fontFamily="monospace">
                        {t}
                      </text>
                    ))}

                    {/* Position curve */}
                    <path d={positionPath} fill="none" stroke="#60a5fa" strokeWidth="2.5" />

                    {/* Cursor */}
                    <line x1={cursorSvgX} y1={PT} x2={cursorSvgX} y2={PT + PLOT_H}
                      stroke="#ffffff" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                    <circle cx={cursorSvgX} cy={cursorXy} r="5" fill="#60a5fa" stroke="#18181b" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="text-center text-[10px] text-zinc-500 font-mono mt-0.5" style={{ marginLeft: PL + 16 }}>
                  t, s
                </div>
              </CardContent>
            </Card>

            {/* Time Slider */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500 font-mono w-8">0 s</span>
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleTimeSliderChange}
                    min={0}
                    max={tMax}
                    step={0.01}
                    className="flex-1"
                  />
                  <span className="text-xs text-zinc-500 font-mono w-12 text-right">
                    {tMax} s
                  </span>
                </div>
                <div className="text-center mt-2 text-xs text-zinc-500">
                  t ={" "}
                  <span className="text-zinc-100 font-mono font-semibold">
                    {currentTime.toFixed(2)} s
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Current State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Time */}
                <div className="space-y-0.5">
                  <span className="text-xs text-zinc-500">Time</span>
                  <div className="text-[28px] font-bold font-mono text-zinc-100 leading-none">
                    {currentTime.toFixed(2)}
                    <span className="text-base font-normal text-zinc-500 ml-1">s</span>
                  </div>
                </div>
                {/* Velocity */}
                <div className="space-y-0.5">
                  <span className="text-xs text-yellow-500">Velocity</span>
                  <div className="text-[28px] font-bold font-mono text-yellow-400 leading-none">
                    {currentV.toFixed(2)}
                    <span className="text-base font-normal text-yellow-600 ml-1">m/s</span>
                  </div>
                </div>
                {/* Position */}
                <div className="space-y-0.5">
                  <span className="text-xs text-blue-500">Position</span>
                  <div className="text-[28px] font-bold font-mono text-blue-400 leading-none">
                    {currentX.toFixed(2)}
                    <span className="text-base font-normal text-blue-600 ml-1">m</span>
                  </div>
                </div>
                {/* Acceleration (constant) */}
                <div className="space-y-0.5">
                  <span className="text-xs text-red-500">Acceleration</span>
                  <div className="text-[28px] font-bold font-mono text-red-400 leading-none">
                    {a.toFixed(2)}
                    <span className="text-base font-normal text-red-600 ml-1">m/s²</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {a === 0 ? (
                  <div className="text-[13px] text-zinc-400 leading-7 space-y-1">
                    <p>Acceleration is zero.</p>
                    <p>Object moves at constant <span className="text-yellow-400">velocity {v0} m/s</span>.</p>
                    <p>This is uniform motion.</p>
                  </div>
                ) : a > 0 ? (
                  <div className="text-[13px] text-zinc-400 leading-7 space-y-1">
                    <p>The object <span className="text-green-400">speeds up</span>.</p>
                    <p><span className="text-yellow-400">Velocity</span> grows linearly at +{a} m/s per second.</p>
                    <p><span className="text-blue-400">Position</span> curves upward parabolically.</p>
                  </div>
                ) : (
                  <div className="text-[13px] text-zinc-400 leading-7 space-y-1">
                    <p>The object <span className="text-red-400">slows down</span>.</p>
                    <p><span className="text-yellow-400">Velocity</span> decreases at {a} m/s per second.</p>
                    <p>Watch for reversal when v = 0.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ══ Bottom formula cards ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Formulas */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Formulas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-zinc-800/60 rounded-md p-3">
                <div className="text-yellow-400 font-mono text-sm">v(t) = v₀ + a · t</div>
                <div className="text-zinc-600 text-[11px] mt-1">velocity at time t</div>
              </div>
              <div className="bg-zinc-800/60 rounded-md p-3">
                <div className="text-blue-400 font-mono text-sm">x(t) = v₀·t + ½·a·t²</div>
                <div className="text-zinc-600 text-[11px] mt-1">position at time t</div>
              </div>
              <div className="bg-zinc-800/60 rounded-md p-3">
                <div className="text-red-400 font-mono text-sm">v² = v₀² + 2·a·x</div>
                <div className="text-zinc-600 text-[11px] mt-1">velocity–position relation</div>
              </div>
            </CardContent>
          </Card>

          {/* Live Substitution */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Live Substitution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-zinc-800/60 rounded-md p-3">
                <div className="text-yellow-400 font-mono text-sm leading-relaxed">
                  v({currentTime.toFixed(2)}) = {v0} + {a}·{currentTime.toFixed(2)}
                </div>
                <div className="text-zinc-300 font-mono text-sm mt-1">
                  = <span className="text-yellow-300 font-bold">{currentV.toFixed(3)}</span> m/s
                </div>
              </div>
              <div className="bg-zinc-800/60 rounded-md p-3">
                <div className="text-blue-400 font-mono text-sm leading-relaxed">
                  x({currentTime.toFixed(2)}) = {v0}·{currentTime.toFixed(2)} + ½·{a}·{currentTime.toFixed(2)}²
                </div>
                <div className="text-zinc-300 font-mono text-sm mt-1">
                  = <span className="text-blue-300 font-bold">{currentX.toFixed(3)}</span> m
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[13px] text-zinc-300 leading-relaxed">
                With <span className="text-zinc-100 font-mono">v₀ = {v0} m/s</span> and{" "}
                <span className="text-zinc-100 font-mono">a = {a} m/s²</span>, what is{" "}
                <span className="text-blue-400 font-mono">x</span> at{" "}
                <span className="text-zinc-100 font-mono">t = {practiceT} s</span>?
              </p>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Answer in m"
                  value={practiceAnswer}
                  onChange={(e) => {
                    setPracticeAnswer(e.target.value)
                    setPracticeResult(null)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm font-mono"
                />
                <Button
                  onClick={checkAnswer}
                  className="shrink-0 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-zinc-600 h-9 px-4 text-sm"
                  variant="outline"
                >
                  Check
                </Button>
              </div>
              {practiceResult && (
                <div
                  className={`text-sm font-semibold px-3 py-2 rounded-md ${
                    practiceResult === "correct"
                      ? "bg-green-950 text-green-400 border border-green-800"
                      : "bg-red-950 text-red-400 border border-red-900"
                  }`}
                >
                  {practiceResult === "correct"
                    ? "✓ Correct!"
                    : `✗ Try again — hint: ${practiceCorrect.toFixed(2)} m`}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
