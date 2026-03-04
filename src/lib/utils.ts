import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'agora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d`
  return formatDate(date)
}

const MEAL_TIME_LABELS: Record<string, string> = {
  breakfast:       'Café da manhã',
  morning_snack:   'Lanche da manhã',
  lunch:           'Almoço',
  afternoon_snack: 'Lanche da tarde',
  dinner:          'Jantar',
  supper:          'Ceia',
}

export function getMealTimeLabel(mealTime: string): string {
  return MEAL_TIME_LABELS[mealTime] ?? mealTime
}

const GOAL_CATEGORY_LABELS: Record<string, string> = {
  weight:      'Peso',
  body_fat:    'Gordura corporal',
  muscle_mass: 'Massa muscular',
  endurance:   'Resistência',
  strength:    'Força',
  habit:       'Hábito',
  other:       'Outro',
}

export function getGoalCategoryLabel(category: string): string {
  return GOAL_CATEGORY_LABELS[category] ?? category
}

const PHOTO_ANGLE_LABELS: Record<string, string> = {
  front:      'Frente',
  back:       'Costas',
  side_left:  'Lateral esquerda',
  side_right: 'Lateral direita',
}

export function getPhotoAngleLabel(angle: string): string {
  return PHOTO_ANGLE_LABELS[angle] ?? angle
}
