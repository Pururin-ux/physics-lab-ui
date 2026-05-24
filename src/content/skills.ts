import type {
  CourseProgressOverview,
  ProgressAchievement,
  SkillProgress,
} from "@/src/types/course"

export const progressSkills: SkillProgress[] = [
  {
    id: "si-units",
    name: "Единицы СИ",
    progress: 100,
    status: "mastered",
    moduleSlug: "measurements",
    relatedLessonSlugs: ["units-and-notation", "si-conversions"],
  },
  {
    id: "position-graphs",
    name: "Графики x(t)",
    progress: 85,
    status: "review",
    moduleSlug: "mechanics-motion",
    relatedLessonSlugs: ["motion-graphs", "uniform-motion"],
  },
  {
    id: "velocity-graphs",
    name: "Графики v(t)",
    progress: 60,
    status: "training",
    moduleSlug: "mechanics-motion",
    relatedLessonSlugs: ["motion-graphs", "accelerated-motion"],
  },
  {
    id: "acceleration",
    name: "Ускорение",
    progress: 40,
    status: "learning",
    moduleSlug: "mechanics-motion",
    relatedLessonSlugs: ["accelerated-motion"],
  },
  {
    id: "newton-laws",
    name: "Законы Ньютона",
    progress: 15,
    status: "learning",
    moduleSlug: "mechanics-forces",
    relatedLessonSlugs: ["force-diagrams", "newton-laws"],
  },
]

export const progressAchievements: ProgressAchievement[] = [
  { id: "first-quiz", icon: "🎯", name: "Первый квиз", unlocked: true },
  { id: "three-day-streak", icon: "🔥", name: "3 дня подряд", unlocked: true },
  { id: "ten-simulations", icon: "⚡", name: "10 симуляций", unlocked: true },
  { id: "mechanics-boss", icon: "🏆", name: "Босс механики", unlocked: false },
]

export const courseProgress: CourseProgressOverview = {
  activeModuleTitle: "Механика",
  skills: progressSkills,
  stats: [
    { id: "xp", value: "847", label: "XP", tone: "accent" },
    { id: "streak", value: "12", label: "дней streak", tone: "success" },
  ],
  achievements: progressAchievements,
  dailyGoal: {
    title: "Цель на сегодня",
    completedTasks: 3,
    totalTasks: 5,
    progress: 60,
  },
}
