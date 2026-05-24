import type { CourseOverview } from "@/src/types/course"
import { courseModules } from "@/src/content/modules"

export { courseModules } from "@/src/content/modules"
export { courseProgress, progressAchievements, progressSkills } from "@/src/content/skills"

export const physicsLabCourse: CourseOverview = {
  slug: "physicslab-school-course",
  title: "PhysicsLab: школьная физика",
  shortDescription: "Модульный курс физики с симуляциями, задачами и подготовкой к ЦЭ/ЦТ.",
  examTarget: "ЦЭ/ЦТ 2026",
  modules: courseModules,
}
