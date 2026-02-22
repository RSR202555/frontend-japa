// =============================================================
// TIPOS GLOBAIS — Japa Treinador Frontend
// =============================================================

export interface User {
  id: string | number
  name: string
  email: string
  phone: string | null
  date_of_birth: string | null
  avatar_url: string | null
  is_active: boolean
  roles: string[]
  email_verified: boolean
  created_at: string
  subscription?: SubscriptionSummary | null
}

export interface SubscriptionSummary {
  id: number
  status: 'pending' | 'active' | 'expired' | 'cancelled' | 'failed'
  plan: PlanSummary | null
  expires_at: string | null
  is_active: boolean
}

export interface PlanSummary {
  id: number
  name: string
  price: number
}

export interface Plan {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  duration_days: number
  features: string[]
  is_active: boolean
  subscriptions_count?: number
}

export interface Goal {
  id: number
  user_id: number
  title: string
  description: string | null
  target_value: number
  current_value: number
  unit: string
  category: GoalCategory
  deadline: string | null
  achieved_at: string | null
  is_active: boolean
  progress_percentage: number
  created_at: string
  updated_at: string
}

export type GoalCategory =
  | 'weight'
  | 'body_fat'
  | 'muscle_mass'
  | 'endurance'
  | 'strength'
  | 'habit'
  | 'other'

export interface Meal {
  id: number
  user_id: number
  name: string
  meal_time: MealTime
  foods: FoodItem[]
  total_calories: number | null
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
  notes: string | null
  logged_at: string
}

export type MealTime =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'afternoon_snack'
  | 'dinner'
  | 'supper'

export interface FoodItem {
  name: string
  quantity: number
  unit: string
  calories?: number
}

export interface ProgressPhoto {
  id: number
  user_id: number
  image_url: string
  thumbnail_url: string | null
  angle: PhotoAngle
  weight_at_photo: number | null
  notes: string | null
  taken_at: string
}

export type PhotoAngle = 'front' | 'back' | 'side_left' | 'side_right'

export interface Anamnesis {
  id: number
  user_id: number
  weight: number
  height: number
  body_fat_percentage: number | null
  objective: AnamnesisObjective
  physical_activity_level: ActivityLevel
  health_conditions: string[]
  medications: string | null
  food_restrictions: string[]
  food_preferences: string[]
  meals_per_day: number
  water_intake_liters: number | null
  sleep_hours: number | null
  stress_level: number | null
  additional_notes: string | null
  completed_at: string | null
}

export type AnamnesisObjective =
  | 'weight_loss'
  | 'muscle_gain'
  | 'health'
  | 'endurance'
  | 'maintenance'

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active'

export interface ChatMessage {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  is_read: boolean
  read_at: string | null
  created_at: string
  sender?: Pick<User, 'id' | 'name' | 'avatar_url'>
}

export interface Transaction {
  id: number
  user_id: number
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  payment_method: string | null
  paid_at: string | null
  created_at: string
}

// ==================== API ====================

export interface ApiResponse<T> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

// ==================== DASHBOARD ====================

export interface StudentDashboard {
  user: User
  subscription: {
    status: string | null
    plan: string | null
    expires_at: string | null
    is_active: boolean
  }
  anamnesis_done: boolean
  stats: {
    active_goals: number
    achieved_goals: number
    meals_today: number
    calories_today: number
    total_photos: number
    last_photo_date: string | null
  }
}

export interface AdminDashboard {
  students: {
    total: number
    active: number
    new_this_month: number
  }
  subscriptions: {
    active: number
    expired: number
    pending: number
    cancelled: number
  }
  revenue: {
    this_month: number
    last_month: number
    total: number
  }
  recent_transactions: Transaction[]
}
