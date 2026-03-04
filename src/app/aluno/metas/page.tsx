'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Target, Loader2, Trash2, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import { cn, getGoalCategoryLabel, formatDate } from '@/lib/utils'
import type { Goal } from '@/types'

const goalSchema = z.object({
  title:         z.string().min(3, 'Mínimo 3 caracteres').max(150),
  description:   z.string().max(1000).optional(),
  target_value:  z.coerce.number().min(0),
  unit:          z.string().min(1).max(30),
  category:      z.enum(['weight', 'body_fat', 'muscle_mass', 'endurance', 'strength', 'habit', 'other']),
  deadline:      z.string().optional(),
})

type GoalForm = z.infer<typeof goalSchema>

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
  })

  async function loadGoals() {
    const res = await api.get<{ data: Goal[] }>('/student/goals')
    setGoals(res.data.data)
    setLoading(false)
  }

  useEffect(() => { loadGoals() }, [])

  async function onSubmit(data: GoalForm) {
    setSubmitting(true)
    try {
      await api.post('/student/goals', data)
      reset()
      setShowForm(false)
      loadGoals()
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteGoal(id: number) {
    if (!confirm('Remover esta meta?')) return
    await api.delete(`/student/goals/${id}`)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Minhas Metas</h1>
          <p className="page-subtitle">{goals.length} meta{goals.length !== 1 ? 's' : ''} registrada{goals.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          Nova meta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 animate-slide-up">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Nova meta</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Título</label>
              <input className={cn('input', errors.title && 'border-danger')} placeholder="Ex: Perder 5kg" {...register('title')} />
              {errors.title && <p className="error-message">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label">Meta (valor)</label>
              <input type="number" step="0.01" className={cn('input', errors.target_value && 'border-danger')} placeholder="Ex: 75" {...register('target_value')} />
            </div>

            <div>
              <label className="label">Unidade</label>
              <input className="input" placeholder="Ex: kg, %, repetições" {...register('unit')} />
            </div>

            <div>
              <label className="label">Categoria</label>
              <select className="input" {...register('category')}>
                <option value="weight">Peso</option>
                <option value="body_fat">Gordura corporal</option>
                <option value="muscle_mass">Massa muscular</option>
                <option value="endurance">Resistência</option>
                <option value="strength">Força</option>
                <option value="habit">Hábito</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="label">Prazo <span className="text-neutral-400 font-normal">(opcional)</span></label>
              <input type="date" className="input" {...register('deadline')} />
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Salvar meta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-neutral-100" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <Target size={40} className="text-neutral-200" />
          <p className="text-sm font-medium text-neutral-600">Nenhuma meta cadastrada</p>
          <p className="text-xs text-neutral-400">Crie sua primeira meta e acompanhe seu progresso</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-neutral-800">{goal.title}</h3>
                    <span className="badge-neutral">{getGoalCategoryLabel(goal.category)}</span>
                    {goal.achieved_at && <span className="badge-success"><CheckCircle2 size={10} className="mr-1" />Conquistada</span>}
                  </div>
                  {goal.deadline && (
                    <p className="text-xs text-neutral-400 mt-1">Prazo: {formatDate(goal.deadline)}</p>
                  )}
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>{goal.current_value} {goal.unit}</span>
                      <span>{goal.target_value} {goal.unit}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 text-right">{goal.progress_percentage}%</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 rounded-lg hover:bg-danger-light hover:text-red-500 text-neutral-300 transition-colors"
                  aria-label="Remover meta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
