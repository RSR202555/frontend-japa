import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function getMealTimeLabel(mealTime: string): string {
  const labels: Record<string, string> = {
    breakfast:       'Café da manhã',
    morning_snack:   'Lanche da manhã',
    lunch:           'Almoço',
    afternoon_snack: 'Lanche da tarde',
    dinner:          'Jantar',
    supper:          'Ceia',
  }
  return labels[mealTime] ?? mealTime
}

export function getObjectiveLabel(objective: string): string {
  const labels: Record<string, string> = {
    weight_loss:  'Perda de peso',
    muscle_gain:  'Ganho de massa',
    health:       'Saúde geral',
    endurance:    'Resistência',
    maintenance:  'Manutenção',
  }
  return labels[objective] ?? objective
}

export function getActivityLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    sedentary:           'Sedentário',
    lightly_active:      'Levemente ativo',
    moderately_active:   'Moderadamente ativo',
    very_active:         'Muito ativo',
    extremely_active:    'Extremamente ativo',
  }
  return labels[level] ?? level
}

export function getPhotoAngleLabel(angle: string): string {
  const labels: Record<string, string> = {
    front:      'Frente',
    back:       'Costas',
    side_left:  'Lateral esquerda',
    side_right: 'Lateral direita',
  }
  return labels[angle] ?? angle
}

export function getGoalCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    weight:      'Peso',
    body_fat:    'Gordura corporal',
    muscle_mass: 'Massa muscular',
    endurance:   'Resistência',
    strength:    'Força',
    habit:       'Hábito',
    other:       'Outro',
  }
  return labels[category] ?? category
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}
