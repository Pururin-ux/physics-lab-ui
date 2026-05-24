"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, ChevronRight, Zap, BookOpen, Trophy, Star, Target, Flame, Check, X, ArrowRight, Sparkles, Atom, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { InteractiveBackground } from "@/components/interactive-background"
import { Mascot, FloatingMascot } from "@/components/mascot"
import { courseModules, courseProgress } from "@/src/content/course"
import type { CourseModuleStatus, ProgressSkillStatus } from "@/src/types/course"

// ═══════════════════════════════════════════════════════════════════════════
// PHYSICSLAB - INTERACTIVE EDUCATIONAL PLATFORM UI TEMPLATE
// Dark theme, yellow accent, anime-inspired, professional educational design
// Based on research report specifications for Belarus school physics
// ═══════════════════════════════════════════════════════════════════════════

export default function PhysicsLabTemplate() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#f4f4f5]">
      {/* Interactive Background */}
      <InteractiveBackground />
      
      {/* Floating Mascot */}
      <FloatingMascot />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Grid */}
      <FeaturesSection />
      
      {/* Interactive Demo */}
      <InteractiveDemoSection />
      
      {/* Course Modules */}
      <ModulesSection />
      
      {/* Learning Card Demo */}
      <LearningCardSection />
      
      {/* Quiz Demo */}
      <QuizDemoSection />
      
      {/* Progress Tracking */}
      <ProgressSection />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0b0d12]/95 backdrop-blur-md border-b border-[#27272a]" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd84d] to-[#f4c542] flex items-center justify-center">
              <Atom className="w-6 h-6 text-[#0b0d12]" />
            </div>
            <span className="text-xl font-bold">
              Physics<span className="text-[#ffd84d]">Lab</span>
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#modules">Модули</NavLink>
            <NavLink href="#practice">Практика</NavLink>
            <NavLink href="#exam">ЦЭ/ЦТ</NavLink>
            <NavLink href="#progress">Прогресс</NavLink>
          </div>
          
          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-[#a1a1aa] hover:text-[#f4f4f5]">
              Войти
            </Button>
            <Button className="bg-[#ffd84d] text-[#0b0d12] hover:bg-[#f4c542] font-semibold">
              Начать
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="text-[#a1a1aa] hover:text-[#ffd84d] transition-colors font-medium"
    >
      {children}
    </a>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ffd84d]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd84d]/10 border border-[#ffd84d]/20">
              <Sparkles className="w-4 h-4 text-[#ffd84d]" />
              <span className="text-sm text-[#ffd84d] font-medium">Подготовка к ЦЭ/ЦТ 2026</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Физика, которая{" "}
              <span className="text-[#ffd84d]">не бесит</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#a1a1aa] leading-relaxed max-w-xl">
              Интерактивный учебник-тренажер по школьной физике. 
              Живые симуляции, умные квизы и никакой зубрежки.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <StatBadge icon={<BookOpen className="w-5 h-5" />} value="12" label="модулей" />
              <StatBadge icon={<Target className="w-5 h-5" />} value="300+" label="задач" />
              <StatBadge icon={<Zap className="w-5 h-5" />} value="50+" label="симуляций" />
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#ffd84d] text-[#0b0d12] hover:bg-[#f4c542] font-semibold px-8 h-14 text-lg">
                Начать бесплатно
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#27272a] bg-transparent hover:bg-[#151821] h-14 px-8 text-lg">
                Смотреть демо
              </Button>
            </div>
          </div>
          
          {/* Hero Visual - Interactive Card Preview with Mascot */}
          <div className="relative flex items-end justify-center">
            {/* Mascot - lives on page without frame */}
            <div className="absolute -top-12 -right-8 z-20">
              <Mascot 
                message="Привет! Давай вместе разберёмся с физикой!"
                position="hero"
              />
            </div>
            <div className="relative z-10">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#151821] border border-[#27272a] flex items-center justify-center text-[#ffd84d]">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-[#71717a]">{label}</div>
      </div>
    </div>
  )
}

function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [time, setTime] = useState(0)
  const animationRef = useRef<number | null>(null)
  
  const v0 = 2
  const a = 1.5
  const tMax = 4
  
  const velocity = useCallback((t: number) => v0 + a * t, [v0, a])
  const position = useCallback((t: number) => v0 * t + 0.5 * a * t * t, [v0, a])
  
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }
    
    let lastTime = performance.now()
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      setTime(prev => {
        const next = prev + delta * 0.5
        return next >= tMax ? 0 : next
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, tMax])
  
  const currentV = velocity(time)
  const currentX = position(time)
  
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#ffd84d]/20 via-[#ffd84d]/10 to-transparent rounded-3xl blur-2xl opacity-50" />
      
      <Card className="relative bg-[#151821] border-[#27272a] rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#27272a] bg-[#0b0d12]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ffd84d]/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#ffd84d]" />
              </div>
              <div>
                <CardTitle className="text-base">Равноускоренное движение</CardTitle>
                <p className="text-xs text-[#71717a]">Интерактивная симуляция</p>
              </div>
            </div>
            <Badge className="bg-[#ffd84d]/10 text-[#ffd84d] border-[#ffd84d]/20">
              Механика
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Mini Graph */}
          <div className="h-32 relative bg-[#0b0d12] rounded-xl border border-[#27272a] p-4">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              {/* Grid */}
              {[0, 20, 40, 60].map(y => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#27272a" strokeWidth="0.5" />
              ))}
              
              {/* Velocity line (yellow) */}
              <path
                d={`M 0 ${60 - v0 * 10} L 200 ${60 - velocity(tMax) * 10}`}
                fill="none"
                stroke="#ffd84d"
                strokeWidth="2"
              />
              
              {/* Current point */}
              <circle
                cx={(time / tMax) * 200}
                cy={60 - currentV * 10}
                r="4"
                fill="#ffd84d"
                className="drop-shadow-[0_0_6px_rgba(255,216,77,0.5)]"
              />
              
              {/* Time cursor */}
              <line
                x1={(time / tMax) * 200}
                y1="0"
                x2={(time / tMax) * 200}
                y2="80"
                stroke="#ffd84d"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            </svg>
            
            {/* Labels */}
            <div className="absolute top-2 left-2 text-xs text-[#ffd84d]">v(t)</div>
            <div className="absolute bottom-2 right-2 text-xs text-[#71717a]">t</div>
          </div>
          
          {/* Current Values */}
          <div className="grid grid-cols-3 gap-4">
            <ValueCard label="Время" value={time.toFixed(1)} unit="с" color="text-[#a1a1aa]" />
            <ValueCard label="Скорость" value={currentV.toFixed(1)} unit="м/с" color="text-[#ffd84d]" />
            <ValueCard label="Положение" value={currentX.toFixed(1)} unit="м" color="text-[#3b82f6]" />
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 bg-[#ffd84d] text-[#0b0d12] hover:bg-[#f4c542]"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Пауза" : "Запуск"}
            </Button>
            <Button
              onClick={() => setTime(0)}
              variant="outline"
              className="border-[#27272a] bg-transparent hover:bg-[#1d2230]"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ValueCard({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="bg-[#0b0d12] rounded-lg p-3 border border-[#27272a]">
      <div className="text-xs text-[#71717a] mb-1">{label}</div>
      <div className={`text-lg font-mono font-bold ${color}`}>
        {value} <span className="text-xs font-normal text-[#71717a]">{unit}</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ═══════════════════════════════════════════════════════════════════════════

function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Живые симуляции",
      description: "50+ интерактивных визуализаций. Меняй параметры и наблюдай физику в действии.",
      color: "from-[#ffd84d] to-[#f4c542]"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Умные квизы",
      description: "Объясняюща�� обратная связь. Не просто правильно/неправильно, а почему.",
      color: "from-[#3b82f6] to-[#2563eb]"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Клиника ошибок",
      description: "Специальные блоки с типичными заблуждениями. Разберем, почему они кажутся верными.",
      color: "from-[#22c55e] to-[#16a34a]"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Формат ЦЭ/ЦТ",
      description: "Задачи в формате экзамена. Часть A с выбором, часть B с численным ответом.",
      color: "from-[#a855f7] to-[#9333ea]"
    }
  ]
  
  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#ffd84d]/10 text-[#ffd84d] border-[#ffd84d]/20">
            Возможности
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Учиться можно <span className="text-[#ffd84d]">по-другому</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            PhysicsLab построен на научных принципах обучения. 
            Каждый элемент помогает понять и запомнить.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <Card className="bg-[#151821] border-[#27272a] hover:border-[#ffd84d]/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-[#a1a1aa] text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE DEMO SECTION
// ═══════════════════════════════════════════════════════════════════════════

function InteractiveDemoSection() {
  return (
    <section className="py-20 px-4 bg-[#0e1018]" id="demo">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">
              Интерактив
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Предсказывай. Наблюдай. <span className="text-[#ffd84d]">Понимай.</span>
            </h2>
            <p className="text-[#a1a1aa] text-lg leading-relaxed">
              Каждая симуляция следует циклу активного обучения: 
              сначала ты делаешь предсказание, потом меняешь параметры, 
              наблюдаешь результат и объясняешь увиденное.
            </p>
            
            <div className="space-y-4">
              <StepItem number={1} title="Предсказание" description="Что произойдет, если увеличить ускорение?" />
              <StepItem number={2} title="Эксперимент" description="Двигай слайдеры и смотри на графики" />
              <StepItem number={3} title="Объяснение" description="Почему график стал круче?" />
              <StepItem number={4} title="Перенос" description="Реши похожую задачу без симуляции" />
            </div>
          </div>
          
          <div>
            <SimulationDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[#ffd84d]/10 border border-[#ffd84d]/30 flex items-center justify-center text-[#ffd84d] font-semibold text-sm shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-[#f4f4f5]">{title}</h4>
        <p className="text-sm text-[#71717a]">{description}</p>
      </div>
    </div>
  )
}

function SimulationDemo() {
  const [v0, setV0] = useState(2)
  const [a, setA] = useState(3)
  const [time, setTime] = useState(2)
  
  const velocity = v0 + a * time
  const position = v0 * time + 0.5 * a * time * time
  
  // Generate path data
  const generateVelocityPath = () => {
    const points: string[] = []
    for (let t = 0; t <= 4; t += 0.1) {
      const v = v0 + a * t
      const x = (t / 4) * 280 + 40
      const y = 100 - (v / 20) * 80
      points.push(`${x},${y}`)
    }
    return `M ${points.join(" L ")}`
  }
  
  const generatePositionPath = () => {
    const points: string[] = []
    for (let t = 0; t <= 4; t += 0.1) {
      const s = v0 * t + 0.5 * a * t * t
      const x = (t / 4) * 280 + 40
      const y = 100 - (s / 40) * 80
      points.push(`${x},${y}`)
    }
    return `M ${points.join(" L ")}`
  }
  
  return (
    <Card className="bg-[#151821] border-[#27272a]">
      <CardHeader className="border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
            <Atom className="w-4 h-4 text-[#22c55e]" />
          </div>
          <CardTitle className="text-base">Графики движения</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Graphs */}
        <div className="space-y-4">
          {/* Velocity Graph */}
          <div className="bg-[#0b0d12] rounded-xl border border-[#27272a] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#ffd84d]">v(t), м/с</span>
              <span className="text-xs text-[#71717a]">Скорость</span>
            </div>
            <svg viewBox="0 0 320 120" className="w-full h-24">
              {/* Grid */}
              {[20, 40, 60, 80, 100].map(y => (
                <line key={y} x1="40" y1={y} x2="320" y2={y} stroke="#27272a" strokeWidth="0.5" opacity="0.5" />
              ))}
              
              {/* Axes */}
              <line x1="40" y1="100" x2="320" y2="100" stroke="#71717a" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="100" stroke="#71717a" strokeWidth="1" />
              
              {/* Velocity line */}
              <path d={generateVelocityPath()} fill="none" stroke="#ffd84d" strokeWidth="2" />
              
              {/* Current point */}
              <circle
                cx={(time / 4) * 280 + 40}
                cy={100 - (velocity / 20) * 80}
                r="5"
                fill="#ffd84d"
                className="drop-shadow-[0_0_8px_rgba(255,216,77,0.6)]"
              />
              
              {/* Time cursor */}
              <line
                x1={(time / 4) * 280 + 40}
                y1="20"
                x2={(time / 4) * 280 + 40}
                y2="100"
                stroke="#ffd84d"
                strokeDasharray="4,4"
                opacity="0.3"
              />
            </svg>
          </div>
          
          {/* Position Graph */}
          <div className="bg-[#0b0d12] rounded-xl border border-[#27272a] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#3b82f6]">x(t), м</span>
              <span className="text-xs text-[#71717a]">Положение</span>
            </div>
            <svg viewBox="0 0 320 120" className="w-full h-24">
              {/* Grid */}
              {[20, 40, 60, 80, 100].map(y => (
                <line key={y} x1="40" y1={y} x2="320" y2={y} stroke="#27272a" strokeWidth="0.5" opacity="0.5" />
              ))}
              
              {/* Axes */}
              <line x1="40" y1="100" x2="320" y2="100" stroke="#71717a" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="100" stroke="#71717a" strokeWidth="1" />
              
              {/* Position curve */}
              <path d={generatePositionPath()} fill="none" stroke="#3b82f6" strokeWidth="2" />
              
              {/* Current point */}
              <circle
                cx={(time / 4) * 280 + 40}
                cy={100 - (position / 40) * 80}
                r="5"
                fill="#3b82f6"
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              />
            </svg>
          </div>
        </div>
        
        {/* Sliders */}
        <div className="space-y-4">
          <SliderControl
            label="v₀"
            value={v0}
            min={0}
            max={10}
            step={0.5}
            unit="м/с"
            onChange={setV0}
          />
          <SliderControl
            label="a"
            value={a}
            min={-5}
            max={5}
            step={0.5}
            unit="м/с²"
            onChange={setA}
          />
          <SliderControl
            label="t"
            value={time}
            min={0}
            max={4}
            step={0.1}
            unit="с"
            onChange={setTime}
          />
        </div>
        
        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0b0d12] rounded-lg p-4 border border-[#27272a]">
            <div className="text-xs text-[#71717a] mb-1">Текущая скорость</div>
            <div className="text-2xl font-mono font-bold text-[#ffd84d]">
              {velocity.toFixed(1)} <span className="text-sm text-[#71717a]">м/с</span>
            </div>
          </div>
          <div className="bg-[#0b0d12] rounded-lg p-4 border border-[#27272a]">
            <div className="text-xs text-[#71717a] mb-1">Пройденный путь</div>
            <div className="text-2xl font-mono font-bold text-[#3b82f6]">
              {position.toFixed(1)} <span className="text-sm text-[#71717a]">м</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SliderControl({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  unit, 
  onChange 
}: { 
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void 
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#a1a1aa]">{label}</span>
        <span className="text-sm font-mono text-[#f4f4f5]">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-[#27272a] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#ffd84d] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULES SECTION
// ═══════════════════════════════════════════════════════════════════════════

function ModulesSection() {
  return (
    <section className="py-20 px-4" id="modules">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20">
            Программа
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Модули <span className="text-[#ffd84d]">курса</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            Структура соответствует программе VII-XI классов Беларуси 
            и спецификации ЦЭ/ЦТ 2026
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courseModules.map((module) => (
            <ModuleCard
              key={module.slug}
              title={module.title}
              topicCount={module.topicCount}
              progress={module.progress}
              icon={module.icon}
              status={module.status}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ModuleCard({
  title,
  topicCount,
  progress,
  icon,
  status,
}: {
  title: string
  topicCount: number
  progress: number
  icon: string
  status: CourseModuleStatus
}) {
  const isLocked = status === "locked"
  const isDraft = status === "draft"
  const isComplete = status === "complete"
  const isUnavailable = isLocked || isDraft
  
  return (
    <Card className={`bg-[#151821] border-[#27272a] transition-all duration-300 ${
      isUnavailable ? "opacity-60" : "hover:border-[#ffd84d]/30 cursor-pointer"
    }`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl">{icon}</div>
          {isComplete && (
            <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          {isLocked && (
            <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center">
              <span className="text-xs">🔒</span>
            </div>
          )}
          {isDraft && (
            <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center">
              <span className="text-xs">📝</span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[#71717a] mb-4">{topicCount} тем</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#71717a]">Прогресс</span>
            <span className={progress === 100 ? "text-[#22c55e]" : "text-[#ffd84d]"}>{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5 bg-[#27272a]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LEARNING CARD SECTION
// ════════════════════════════════════════════════���══════════════════════════

function LearningCardSection() {
  return (
    <section className="py-20 px-4 bg-[#0e1018]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formula Card */}
          <FormulaCard />
          
          {/* Misconception Card */}
          <MisconceptionCard />
        </div>
      </div>
    </section>
  )
}

function FormulaCard() {
  return (
    <Card className="bg-[#151821] border-[#27272a]">
      <CardHeader className="border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffd84d]/10 flex items-center justify-center">
            <span className="text-[#ffd84d] font-bold text-sm">f</span>
          </div>
          <div>
            <CardTitle className="text-base">Формула скорости</CardTitle>
            <p className="text-xs text-[#71717a]">Равноускоренное движение</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Main Formula */}
        <div className="bg-[#0b0d12] rounded-xl p-6 border border-[#27272a] text-center">
          <div className="text-3xl font-mono text-[#f4f4f5]">
            v = v₀ + at
          </div>
        </div>
        
        {/* Variables */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#a1a1aa]">Переменные</h4>
          <div className="grid grid-cols-2 gap-3">
            <VariableItem symbol="v" name="Скорость" unit="м/с" />
            <VariableItem symbol="v₀" name="Начальная скорость" unit="м/с" />
            <VariableItem symbol="a" name="Ускорение" unit="м/с²" />
            <VariableItem symbol="t" name="Время" unit="с" />
          </div>
        </div>
        
        {/* When to use */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#22c55e]">Когда использовать</h4>
          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
              Движение по прямой с постоянным ускорением
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
              Известны начальная скорость и ускорение
            </li>
          </ul>
        </div>
        
        {/* When NOT to use */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#ef4444]">Когда НЕ работает</h4>
          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 text-[#ef4444] mt-0.5 shrink-0" />
              Ускорение меняется со временем
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 text-[#ef4444] mt-0.5 shrink-0" />
              Криволинейное движение
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function VariableItem({ symbol, name, unit }: { symbol: string; name: string; unit: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#0b0d12] rounded-lg p-3 border border-[#27272a]">
      <div className="w-8 h-8 rounded bg-[#1d2230] flex items-center justify-center">
        <span className="font-mono text-[#ffd84d]">{symbol}</span>
      </div>
      <div>
        <div className="text-sm">{name}</div>
        <div className="text-xs text-[#71717a]">{unit}</div>
      </div>
    </div>
  )
}

function MisconceptionCard() {
  const [revealed, setRevealed] = useState(false)
  
  return (
    <Card className="bg-[#151821] border-[#27272a] border-l-4 border-l-[#ef4444]">
      <CardHeader className="border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div>
            <CardTitle className="text-base">Типичная ловушка</CardTitle>
            <p className="text-xs text-[#71717a]">Графики движения</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* The misconception */}
        <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-4">
          <p className="text-[#f4f4f5] font-medium mb-2">
            {'"'}График скорости — это траектория движения{'"'}
          </p>
          <p className="text-sm text-[#a1a1aa]">
            Многие думают, что если график v(t) идет вверх, 
            то объект поднимается. Это не так.
          </p>
        </div>
        
        {/* Visual example */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0b0d12] rounded-xl p-4 border border-[#27272a]">
            <div className="text-xs text-[#71717a] mb-2 text-center">График v(t)</div>
            <svg viewBox="0 0 100 60" className="w-full h-16">
              <line x1="10" y1="50" x2="90" y2="50" stroke="#71717a" strokeWidth="1" />
              <line x1="10" y1="10" x2="10" y2="50" stroke="#71717a" strokeWidth="1" />
              <line x1="10" y1="40" x2="90" y2="15" stroke="#ffd84d" strokeWidth="2" />
            </svg>
            <div className="text-xs text-center text-[#ffd84d] mt-1">Скорость растет</div>
          </div>
          
          <div className="bg-[#0b0d12] rounded-xl p-4 border border-[#27272a]">
            <div className="text-xs text-[#71717a] mb-2 text-center">Реальное движение</div>
            <svg viewBox="0 0 100 60" className="w-full h-16">
              <line x1="10" y1="30" x2="90" y2="30" stroke="#71717a" strokeWidth="1" />
              <circle cx="20" cy="30" r="4" fill="#3b82f6" />
              <line x1="24" y1="30" x2="50" y2="30" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                </marker>
              </defs>
            </svg>
            <div className="text-xs text-center text-[#3b82f6] mt-1">Движется вправо по прямой</div>
          </div>
        </div>
        
        {/* Reveal explanation */}
        {!revealed ? (
          <Button 
            onClick={() => setRevealed(true)}
            className="w-full bg-[#1d2230] hover:bg-[#27272a] text-[#f4f4f5]"
          >
            Показать объяснение
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl p-4 space-y-3">
            <h4 className="font-medium text-[#22c55e]">Правильное понимание</h4>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              График v(t) показывает, <strong className="text-[#f4f4f5]">как быстро</strong> движется объект, 
              а не <strong className="text-[#f4f4f5]">где</strong> он находится. 
              Наклон вверх означает ускорение, а не подъем.
            </p>
            <p className="text-sm text-[#a1a1aa]">
              Траекторию показывает график x(y) или x(t) — но даже x(t) это не траектория в пространстве!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ DEMO SECTION
// ═══════════════════════════════════════════════════════════════════════════

function QuizDemoSection() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  
  const correctAnswer = 1
  const answers = [
    "Скорость растет",
    "Скорость постоянна",
    "Объект поднимается вверх",
    "Ускорение равно нулю"
  ]
  
  const handleCheck = () => {
    setShowFeedback(true)
  }
  
  const handleReset = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
  }
  
  return (
    <section className="py-20 px-4" id="practice">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20">
            Практика
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Умные <span className="text-[#ffd84d]">квизы</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg">
            Не просто правильно/неправильно — объясняем, почему
          </p>
        </div>
        
        <Card className="bg-[#151821] border-[#27272a]">
          <CardHeader className="border-b border-[#27272a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-[#a855f7]" />
                </div>
                <div>
                  <CardTitle className="text-base">Вопрос 3 из 7</CardTitle>
                  <p className="text-xs text-[#71717a]">Графики движения</p>
                </div>
              </div>
              <Badge variant="outline" className="border-[#27272a]">
                Concept check
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Question */}
            <div className="space-y-4">
              <p className="text-lg font-medium">
                На графике v(t) скорость постоянна и равна 5 м/с. 
                Что это означает?
              </p>
              
              {/* Graph illustration */}
              <div className="bg-[#0b0d12] rounded-xl p-4 border border-[#27272a]">
                <svg viewBox="0 0 200 80" className="w-full h-20">
                  <line x1="20" y1="60" x2="180" y2="60" stroke="#71717a" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="60" stroke="#71717a" strokeWidth="1" />
                  <line x1="20" y1="30" x2="180" y2="30" stroke="#ffd84d" strokeWidth="2" />
                  <text x="10" y="35" fill="#71717a" fontSize="10">5</text>
                  <text x="100" y="75" fill="#71717a" fontSize="10">t</text>
                  <text x="5" y="10" fill="#ffd84d" fontSize="10">v</text>
                </svg>
              </div>
            </div>
            
            {/* Answers */}
            <div className="space-y-3">
              {answers.map((answer, i) => {
                const isSelected = selectedAnswer === i
                const isCorrect = i === correctAnswer
                const showResult = showFeedback && isSelected
                
                return (
                  <button
                    key={i}
                    onClick={() => !showFeedback && setSelectedAnswer(i)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      showResult
                        ? isCorrect
                          ? "bg-[#22c55e]/10 border-[#22c55e] text-[#f4f4f5]"
                          : "bg-[#ef4444]/10 border-[#ef4444] text-[#f4f4f5]"
                        : isSelected
                        ? "bg-[#ffd84d]/10 border-[#ffd84d] text-[#f4f4f5]"
                        : "bg-[#0b0d12] border-[#27272a] text-[#a1a1aa] hover:border-[#ffd84d]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                        showResult
                          ? isCorrect
                            ? "border-[#22c55e] bg-[#22c55e] text-white"
                            : "border-[#ef4444] bg-[#ef4444] text-white"
                          : isSelected
                          ? "border-[#ffd84d] bg-[#ffd84d] text-[#0b0d12]"
                          : "border-[#27272a]"
                      }`}>
                        {showResult ? (
                          isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </div>
                      <span>{answer}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-xl ${
                selectedAnswer === correctAnswer
                  ? "bg-[#22c55e]/10 border border-[#22c55e]/30"
                  : "bg-[#ef4444]/10 border border-[#ef4444]/30"
              }`}>
                {selectedAnswer === correctAnswer ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#22c55e] font-medium">
                      <Check className="w-5 h-5" />
                      Верно!
                    </div>
                    <p className="text-sm text-[#a1a1aa]">
                      Горизонтальная линия на графике v(t) означ��ет постоянную скорость. 
                      Объект движется равномерно, без ускорения.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#ef4444] font-medium">
                      <X className="w-5 h-5" />
                      Не совсем
                    </div>
                    <p className="text-sm text-[#a1a1aa]">
                      <strong>Ловушка:</strong> горизонтальная линия на v(t) — это не остановка 
                      и не подъем. Это постоянная скорость.
                    </p>
                    <p className="text-sm text-[#a1a1aa]">
                      <strong>Подсказка:</strong> если v = const, то a = dv/dt = 0. 
                      Ускорения нет, скорость не меняется.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-3">
              {!showFeedback ? (
                <Button
                  onClick={handleCheck}
                  disabled={selectedAnswer === null}
                  className="flex-1 bg-[#ffd84d] text-[#0b0d12] hover:bg-[#f4c542] disabled:opacity-50"
                >
                  Проверить
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-[#27272a] bg-transparent hover:bg-[#1d2230]"
                  >
                    Попробовать снова
                  </Button>
                  <Button className="flex-1 bg-[#ffd84d] text-[#0b0d12] hover:bg-[#f4c542]">
                    Следующий вопрос
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS SECTION
// ═══════════════════════════════════════════════════════════════════════════

function ProgressSection() {
  const { activeModuleTitle, skills, stats, achievements, dailyGoal } = courseProgress
  
  return (
    <section className="py-20 px-4 bg-[#0e1018]" id="progress">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#ffd84d]/10 text-[#ffd84d] border-[#ffd84d]/20">
            Прогресс
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Карта <span className="text-[#ffd84d]">навыков</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            Видишь, что освоено, что требует повторения, 
            и какой следующий маленький шаг
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Map */}
          <div className="lg:col-span-2">
            <Card className="bg-[#151821] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-lg">{activeModuleTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    progress={skill.progress}
                    status={skill.status}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Stats & Achievements */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-[#151821] border-[#27272a]">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div className="text-center" key={stat.id}>
                      <div className={`text-3xl font-bold ${
                        stat.tone === "success" ? "text-[#22c55e]" : "text-[#ffd84d]"
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#71717a]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements */}
            <Card className="bg-[#151821] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ffd84d]" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {achievements.map((a) => (
                  <div 
                    key={a.id}
                    className={`p-3 rounded-lg border text-center ${
                      a.unlocked
                        ? "bg-[#0b0d12] border-[#27272a]"
                        : "bg-[#0b0d12]/50 border-[#27272a]/50 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-xs text-[#a1a1aa]">{a.name}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Daily Goal */}
            <Card className="bg-gradient-to-br from-[#ffd84d]/10 to-[#ffd84d]/5 border-[#ffd84d]/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-5 h-5 text-[#ffd84d]" />
                  <span className="font-medium">{dailyGoal.title}</span>
                </div>
                <Progress value={dailyGoal.progress} className="h-2 bg-[#27272a] mb-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#a1a1aa]">{dailyGoal.completedTasks} из {dailyGoal.totalTasks} задач</span>
                  <span className="text-[#ffd84d]">{dailyGoal.progress}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillBar({
  name,
  progress,
  status,
}: {
  name: string
  progress: number
  status: ProgressSkillStatus
}) {
  const statusConfig: Record<ProgressSkillStatus, { color: string; bg: string; label: string }> = {
    mastered: { color: "text-[#22c55e]", bg: "bg-[#22c55e]", label: "Освоено" },
    review: { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]", label: "Повторить" },
    training: { color: "text-[#3b82f6]", bg: "bg-[#3b82f6]", label: "Тренировка" },
    learning: { color: "text-[#a855f7]", bg: "bg-[#a855f7]", label: "В процессе" },
  }

  const currentStatus = statusConfig[status]
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <Badge variant="outline" className={`text-xs ${currentStatus.color} border-current`}>
          {currentStatus.label}
        </Badge>
      </div>
      <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
        <div 
          className={`h-full ${currentStatus.bg} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[#27272a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd84d] to-[#f4c542] flex items-center justify-center">
                <Atom className="w-6 h-6 text-[#0b0d12]" />
              </div>
              <span className="text-xl font-bold">
                Physics<span className="text-[#ffd84d]">Lab</span>
              </span>
            </div>
            <p className="text-[#71717a] text-sm max-w-sm">
              Интерактивный учебник-тренажер по школьной физике для Беларуси. 
              Подготовка к ЦЭ/ЦТ 2026.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Курс</h4>
            <ul className="space-y-2 text-sm text-[#71717a]">
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Модули</a></li>
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Симуляции</a></li>
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Задачник</a></li>
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Экзамен</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">О проекте</h4>
            <ul className="space-y-2 text-sm text-[#71717a]">
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Методика</a></li>
              <li><a href="#" className="hover:text-[#ffd84d] transition-colors">Контакты</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#71717a]">
            2026 PhysicsLab. Сделано для школьников Беларуси.
          </p>
          <div className="flex items-center gap-4 text-sm text-[#71717a]">
            <a href="#" className="hover:text-[#ffd84d] transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-[#ffd84d] transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
