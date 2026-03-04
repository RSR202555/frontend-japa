'use client'

import { useEffect, useState } from 'react'
import { Plus, Loader2, Trash2, UtensilsCrossed } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { cn, getMealTimeLabel, formatDate } from '@/lib/utils'
import type { Meal, PaginatedResponse } from '@/types'

const mealSchema = z.object({
  name: z.string().min(2).max(100),
  meal_time: z.enum(['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper']),
  foods: z.array(z.object({
    name:     z.string().min(1).max(100),
    quantity: z.coerce.number().min(0),
    unit:     z.string().min(1).max(20),
    calories: z.coerce.number().min(0).optional().or(z.literal('')),
  })).min(1),
  notes: z.string().max(500).optional(),
})

type MealForm = z.infer<typeof mealSchema>

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: { foods: [{ name: '', quantity: 0, unit: 'g' }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'foods' })

  async function loadMeals() {
    const res = await api.get<PaginatedResponse<Meal>>(`/student/meals?date=${selectedDate}`)
    setMeals(res.data.data)
    setLoading(false)
  }

  useEffect(() => { loadMeals() }, [selectedDate])

  async function onSubmit(data: MealForm) {
    setSubmitting(true)
    try {
      await api.post('/student/meals', { ...data, logged_at: selectedDate })
      reset({ foods: [{ name: '', quantity: 0, unit: 'g' }] })
      setShowForm(false)
      loadMeals()
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteMeal(id: number) {
    if (!confirm('Remover este registro?')) return
    await api.delete(`/student/meals/${id}`)
    setMeals((prev) => prev.filter((m) => m.id !== id))
  }

  const totalCalories = meals.reduce((acc, m) => acc + (m.total_calories ?? 0), 0)

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UtensilsCrossed size={22} className="text-brand-500" />
            Refeições
          </h1>
          <p className="page-subtitle">{Math.round(totalCalories)} kcal registradas hoje</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input w-auto text-sm"
          />
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
            Registrar
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 animate-slide-up">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Nova refeição</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nome da refeição</label>
                <input className={cn('input', errors.name && 'border-danger')} placeholder="Ex: Almoço saudável" {...register('name')} />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select className="input" {...register('meal_time')}>
                  <option value="breakfast">Café da manhã</option>
                  <option value="morning_snack">Lanche da manhã</option>
                  <option value="lunch">Almoço</option>
                  <option value="afternoon_snack">Lanche da tarde</option>
                  <option value="dinner">Jantar</option>
                  <option value="supper">Ceia</option>
                </select>
              </div>
            </div>

            {/* Foods */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Alimentos</label>
                <button type="button" onClick={() => append({ name: '', quantity: 0, unit: 'g' })} className="btn-ghost text-xs gap-1">
                  <Plus size={12} /> Adicionar alimento
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <input className="input flex-1" placeholder="Nome" {...register(`foods.${index}.name`)} />
                    <input type="number" className="input w-20" placeholder="Qtd" {...register(`foods.${index}.quantity`)} />
                    <input className="input w-16" placeholder="Un." {...register(`foods.${index}.unit`)} />
                    <input type="number" className="input w-20" placeholder="kcal" {...register(`foods.${index}.calories`)} />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-2.5 text-neutral-300 hover:text-red-400 mt-0.5">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Observações <span className="text-neutral-400 font-normal">(opcional)</span></label>
              <input className="input" placeholder="Ex: porção pós-treino" {...register('notes')} />
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? <><Loader2 size={16} className="animate-spin" />Salvando...</> : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-neutral-100" />)}
        </div>
      ) : meals.length === 0 ? (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <UtensilsCrossed size={40} className="text-neutral-200" />
          <p className="text-sm font-medium text-neutral-600">Nenhuma refeição registrada</p>
          <p className="text-xs text-neutral-400">Registre o que você comeu hoje</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div key={meal.id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-neutral-800">{meal.name}</h3>
                  <span className="badge-neutral">{getMealTimeLabel(meal.meal_time)}</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-neutral-400">
                  {meal.total_calories != null && <span>{Math.round(meal.total_calories)} kcal</span>}
                  {meal.total_protein  != null && <span>{meal.total_protein}g prot</span>}
                  {meal.total_carbs    != null && <span>{meal.total_carbs}g carbs</span>}
                  {meal.total_fat      != null && <span>{meal.total_fat}g gord</span>}
                </div>
                <p className="text-xs text-neutral-300 mt-1">{meal.foods.length} alimento{meal.foods.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="p-2 rounded-lg hover:bg-danger-light hover:text-red-500 text-neutral-300 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
