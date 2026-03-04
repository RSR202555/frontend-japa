'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2, ClipboardList } from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Anamnesis } from '@/types'

const anamnesisSchema = z.object({
  weight:                   z.coerce.number().min(20).max(500),
  height:                   z.coerce.number().min(0.5).max(3),
  body_fat_percentage:      z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  objective:                z.enum(['weight_loss', 'muscle_gain', 'health', 'endurance', 'maintenance']),
  physical_activity_level:  z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']),
  meals_per_day:            z.coerce.number().int().min(1).max(10),
  water_intake_liters:      z.coerce.number().min(0).max(20).optional().or(z.literal('')),
  sleep_hours:              z.coerce.number().min(0).max(24).optional().or(z.literal('')),
  stress_level:             z.coerce.number().int().min(1).max(10).optional().or(z.literal('')),
  medications:              z.string().max(1000).optional(),
  additional_notes:         z.string().max(2000).optional(),
})

type AnamnesisForm = z.infer<typeof anamnesisSchema>

export default function AnamnesisPage() {
  const [existing, setExisting] = useState<Anamnesis | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AnamnesisForm>({
    resolver: zodResolver(anamnesisSchema),
  })

  useEffect(() => {
    api.get<{ completed: boolean; anamnesis?: Anamnesis }>('/student/anamnesis')
      .then((res) => {
        if (res.data.anamnesis) {
          setExisting(res.data.anamnesis)
          reset(res.data.anamnesis as unknown as AnamnesisForm)
        }
      })
      .finally(() => setLoading(false))
  }, [reset])

  async function onSubmit(data: AnamnesisForm) {
    setError(null)
    setSaved(false)
    try {
      await api.post('/student/anamnesis', data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-neutral-300" /></div>
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <ClipboardList size={24} className="text-brand-500" />
          Anamnese
        </h1>
        <p className="page-subtitle">Suas informações de saúde e objetivos</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-success-light border border-green-200 px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 size={16} />
          Anamnese salva com sucesso!
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-danger-light border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        {/* Medidas */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-800 mb-4 pb-2 border-b border-neutral-100">
            Medidas corporais
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Peso (kg)</label>
              <input type="number" step="0.1" className={cn('input', errors.weight && 'border-danger')} {...register('weight')} />
              {errors.weight && <p className="error-message">{errors.weight.message}</p>}
            </div>
            <div>
              <label className="label">Altura (m)</label>
              <input type="number" step="0.01" placeholder="1.75" className={cn('input', errors.height && 'border-danger')} {...register('height')} />
              {errors.height && <p className="error-message">{errors.height.message}</p>}
            </div>
            <div>
              <label className="label">% Gordura <span className="text-neutral-400 font-normal">(opcional)</span></label>
              <input type="number" step="0.1" className="input" {...register('body_fat_percentage')} />
            </div>
          </div>
        </section>

        {/* Objetivos */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-800 mb-4 pb-2 border-b border-neutral-100">
            Objetivos e estilo de vida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Objetivo principal</label>
              <select className="input" {...register('objective')}>
                <option value="weight_loss">Perda de peso</option>
                <option value="muscle_gain">Ganho de massa</option>
                <option value="health">Saúde geral</option>
                <option value="endurance">Resistência</option>
                <option value="maintenance">Manutenção</option>
              </select>
            </div>
            <div>
              <label className="label">Nível de atividade</label>
              <select className="input" {...register('physical_activity_level')}>
                <option value="sedentary">Sedentário</option>
                <option value="lightly_active">Levemente ativo</option>
                <option value="moderately_active">Moderadamente ativo</option>
                <option value="very_active">Muito ativo</option>
                <option value="extremely_active">Extremamente ativo</option>
              </select>
            </div>
          </div>
        </section>

        {/* Hábitos */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-800 mb-4 pb-2 border-b border-neutral-100">
            Hábitos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Refeições/dia</label>
              <input type="number" min="1" max="10" className="input" {...register('meals_per_day')} />
            </div>
            <div>
              <label className="label">Água (litros)</label>
              <input type="number" step="0.1" className="input" {...register('water_intake_liters')} />
            </div>
            <div>
              <label className="label">Sono (horas)</label>
              <input type="number" step="0.5" className="input" {...register('sleep_hours')} />
            </div>
            <div>
              <label className="label">Estresse (1-10)</label>
              <input type="number" min="1" max="10" className="input" {...register('stress_level')} />
            </div>
          </div>
        </section>

        {/* Saúde */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-800 mb-4 pb-2 border-b border-neutral-100">
            Saúde
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Medicamentos em uso <span className="text-neutral-400 font-normal">(opcional)</span></label>
              <textarea rows={2} className="input resize-none" placeholder="Liste medicamentos que usa regularmente..." {...register('medications')} />
            </div>
            <div>
              <label className="label">Observações adicionais <span className="text-neutral-400 font-normal">(opcional)</span></label>
              <textarea rows={3} className="input resize-none" placeholder="Lesões, limitações, informações importantes..." {...register('additional_notes')} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary px-8">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : 'Salvar anamnese'}
          </button>
        </div>
      </form>
    </div>
  )
}
