export type CourseModuleStatus = "complete" | "active" | "locked" | "draft"

export type ProgressSkillStatus = "mastered" | "review" | "training" | "learning"

export interface CourseLesson {
  slug: string
  title: string
  shortDescription: string
  keySkills: string[]
  typicalMisconceptions: string[]
  examRelevance: string
}

export interface CourseModule {
  id: number
  slug: string
  title: string
  shortDescription: string
  topicCount: number
  progress: number
  status: CourseModuleStatus
  icon: string
  keySkills: string[]
  typicalMisconceptions: string[]
  examRelevance: string
  lessons: CourseLesson[]
}

export interface CourseOverview {
  slug: string
  title: string
  shortDescription: string
  examTarget: string
  modules: CourseModule[]
}

export interface SkillProgress {
  id: string
  name: string
  progress: number
  status: ProgressSkillStatus
  moduleSlug: string
  relatedLessonSlugs: string[]
}

export interface ProgressAchievement {
  id: string
  icon: string
  name: string
  unlocked: boolean
}

export interface CourseProgressStat {
  id: string
  value: string
  label: string
  tone: "accent" | "success"
}

export interface DailyGoalProgress {
  title: string
  completedTasks: number
  totalTasks: number
  progress: number
}

export interface CourseProgressOverview {
  activeModuleTitle: string
  skills: SkillProgress[]
  stats: CourseProgressStat[]
  achievements: ProgressAchievement[]
  dailyGoal: DailyGoalProgress
}
