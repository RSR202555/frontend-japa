'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Exercise {
  id: string
  nome: string
  series: string
  repeticoes: string
  carga: string
  descanso: string
}

interface TrainingDay {
  id: string
  nome: string
  exercicios: Exercise[]
}

interface FoodItem {
  id: string
  nome: string
  quantidade: string
}

interface Meal {
  id: string
  nome: string
  horario: string
  alimentos: FoodItem[]
}

interface ProtocolContent {
  treino: {
    objetivo: string
    frequencia: string
    observacoes: string
    dias: TrainingDay[]
  }
  dieta: {
    objetivo: string
    calorias_totais: string
    proteina_g: string
    carboidrato_g: string
    gordura_g: string
    observacoes: string
    refeicoes: Meal[]
  }
}

interface Protocol {
  id: number
  title: string
  type: 'treino' | 'dieta' | 'full'
  content: ProtocolContent
  created_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2)
}

function emptyContent(): ProtocolContent {
  return {
    treino: { objetivo: '', frequencia: '', observacoes: '', dias: [] },
    dieta: {
      objetivo: '', calorias_totais: '', proteina_g: '',
      carboidrato_g: '', gordura_g: '', observacoes: '', refeicoes: [],
    },
  }
}

const typeLabel: Record<string, string> = {
  treino: 'Treino',
  dieta: 'Dieta',
  full: 'Treino + Dieta',
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProtocolosPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'treino' | 'dieta' | 'full'>('full')
  const [content, setContent] = useState<ProtocolContent>(emptyContent())
  const [activeTab, setActiveTab] = useState<'treino' | 'dieta'>('treino')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Protocol[]>('/admin/protocolos')
      .then((res) => setProtocols(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setTitle('')
    setType('full')
    setContent(emptyContent())
    setActiveTab('treino')
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(p: Protocol) {
    setTitle(p.title)
    setType(p.type)
    setContent(p.content ?? emptyContent())
    setActiveTab('treino')
    setEditingId(p.id)
    setError(null)
    setShowForm(true)
  }

  async function handleSave() {
    if (!title.trim()) { setError('Título obrigatório.'); return }
    setSaving(true)
    setError(null)
    try {
      const payload = { title: title.trim(), type, content }
      if (editingId) {
        const res = await api.put<Protocol>(`/admin/protocolos/${editingId}`, payload)
        setProtocols((prev) => prev.map((p) => (p.id === editingId ? res.data : p)))
      } else {
        const res = await api.post<Protocol>('/admin/protocolos', payload)
        setProtocols((prev) => [res.data, ...prev])
      }
      setShowForm(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao salvar protocolo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Excluir este protocolo?')) return
    await api.delete(`/admin/protocolos/${id}`)
    setProtocols((prev) => prev.filter((p) => p.id !== id))
  }

  // ── Treino helpers ────────────────────────────────────────────────────────

  function addDay() {
    setContent((c) => ({
      ...c,
      treino: {
        ...c.treino,
        dias: [...c.treino.dias, { id: uid(), nome: '', exercicios: [] }],
      },
    }))
  }

  function removeDay(dayId: string) {
    setContent((c) => ({
      ...c,
      treino: { ...c.treino, dias: c.treino.dias.filter((d) => d.id !== dayId) },
    }))
  }

  function updateDay(dayId: string, field: keyof TrainingDay, value: string) {
    setContent((c) => ({
      ...c,
      treino: {
        ...c.treino,
        dias: c.treino.dias.map((d) => (d.id === dayId ? { ...d, [field]: value } : d)),
      },
    }))
  }

  function addExercise(dayId: string) {
    const ex: Exercise = { id: uid(), nome: '', series: '', repeticoes: '', carga: '', descanso: '' }
    setContent((c) => ({
      ...c,
      treino: {
        ...c.treino,
        dias: c.treino.dias.map((d) =>
          d.id === dayId ? { ...d, exercicios: [...d.exercicios, ex] } : d
        ),
      },
    }))
  }

  function removeExercise(dayId: string, exId: string) {
    setContent((c) => ({
      ...c,
      treino: {
        ...c.treino,
        dias: c.treino.dias.map((d) =>
          d.id === dayId ? { ...d, exercicios: d.exercicios.filter((e) => e.id !== exId) } : d
        ),
      },
    }))
  }

  function updateExercise(dayId: string, exId: string, field: keyof Exercise, value: string) {
    setContent((c) => ({
      ...c,
      treino: {
        ...c.treino,
        dias: c.treino.dias.map((d) =>
          d.id === dayId
            ? { ...d, exercicios: d.exercicios.map((e) => (e.id === exId ? { ...e, [field]: value } : e)) }
            : d
        ),
      },
    }))
  }

  // ── Dieta helpers ─────────────────────────────────────────────────────────

  function addMeal() {
    setContent((c) => ({
      ...c,
      dieta: {
        ...c.dieta,
        refeicoes: [...c.dieta.refeicoes, { id: uid(), nome: '', horario: '', alimentos: [] }],
      },
    }))
  }

  function removeMeal(mealId: string) {
    setContent((c) => ({
      ...c,
      dieta: { ...c.dieta, refeicoes: c.dieta.refeicoes.filter((m) => m.id !== mealId) },
    }))
  }

  function updateMeal(mealId: string, field: keyof Meal, value: string) {
    setContent((c) => ({
      ...c,
      dieta: {
        ...c.dieta,
        refeicoes: c.dieta.refeicoes.map((m) => (m.id === mealId ? { ...m, [field]: value } : m)),
      },
    }))
  }

  function addFood(mealId: string) {
    const food: FoodItem = { id: uid(), nome: '', quantidade: '' }
    setContent((c) => ({
      ...c,
      dieta: {
        ...c.dieta,
        refeicoes: c.dieta.refeicoes.map((m) =>
          m.id === mealId ? { ...m, alimentos: [...m.alimentos, food] } : m
        ),
      },
    }))
  }

  function removeFood(mealId: string, foodId: string) {
    setContent((c) => ({
      ...c,
      dieta: {
        ...c.dieta,
        refeicoes: c.dieta.refeicoes.map((m) =>
          m.id === mealId ? { ...m, alimentos: m.alimentos.filter((f) => f.id !== foodId) } : m
        ),
      },
    }))
  }

  function updateFood(mealId: string, foodId: string, field: keyof FoodItem, value: string) {
    setContent((c) => ({
      ...c,
      dieta: {
        ...c.dieta,
        refeicoes: c.dieta.refeicoes.map((m) =>
          m.id === mealId
            ? { ...m, alimentos: m.alimentos.map((f) => (f.id === foodId ? { ...f, [field]: value } : f)) }
            : m
        ),
      },
    }))
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Protocolos</h1>
          <p className="page-subtitle">Crie e gerencie protocolos de treino e dieta</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Novo protocolo
          </button>
        )}
      </div>

      {/* ── Editor ── */}
      {showForm && (
        <div className="card p-6 space-y-5 border border-brand-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-800">
              {editingId ? 'Editar protocolo' : 'Novo protocolo'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-danger-light border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Título *</label>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Protocolo Hipertrofia — Semana 1"
              />
            </div>
            <div>
              <label className="label">Tipo</label>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
              >
                <option value="full">Treino + Dieta</option>
                <option value="treino">Apenas Treino</option>
                <option value="dieta">Apenas Dieta</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 flex gap-0">
            {(['treino', 'dieta'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                )}
              >
                {tab === 'treino' ? 'Treino' : 'Dieta'}
              </button>
            ))}
          </div>

          {/* Tab Treino */}
          {activeTab === 'treino' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Objetivo</label>
                  <input
                    className="input"
                    value={content.treino.objetivo}
                    onChange={(e) => setContent((c) => ({ ...c, treino: { ...c.treino, objetivo: e.target.value } }))}
                    placeholder="Ex: Hipertrofia"
                  />
                </div>
                <div>
                  <label className="label">Frequência</label>
                  <input
                    className="input"
                    value={content.treino.frequencia}
                    onChange={(e) => setContent((c) => ({ ...c, treino: { ...c.treino, frequencia: e.target.value } }))}
                    placeholder="Ex: 5x por semana"
                  />
                </div>
              </div>

              <div>
                <label className="label">Observações gerais</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={content.treino.observacoes}
                  onChange={(e) => setContent((c) => ({ ...c, treino: { ...c.treino, observacoes: e.target.value } }))}
                  placeholder="Aquecimento, alongamento, etc."
                />
              </div>

              {/* Dias de treino */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">Dias de treino</p>
                  <button onClick={addDay} className="btn-ghost text-xs flex items-center gap-1">
                    <Plus size={13} /> Adicionar dia
                  </button>
                </div>

                {content.treino.dias.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-4 border border-dashed border-neutral-200 rounded-xl">
                    Nenhum dia adicionado
                  </p>
                )}

                {content.treino.dias.map((day, di) => (
                  <DayBlock
                    key={day.id}
                    day={day}
                    index={di}
                    onUpdateDay={updateDay}
                    onRemoveDay={removeDay}
                    onAddExercise={addExercise}
                    onUpdateExercise={updateExercise}
                    onRemoveExercise={removeExercise}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab Dieta */}
          {activeTab === 'dieta' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Objetivo</label>
                  <input
                    className="input"
                    value={content.dieta.objetivo}
                    onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, objetivo: e.target.value } }))}
                    placeholder="Ex: Bulking"
                  />
                </div>
                <div>
                  <label className="label">Calorias/dia</label>
                  <input
                    className="input"
                    value={content.dieta.calorias_totais}
                    onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, calorias_totais: e.target.value } }))}
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="label">Proteína (g)</label>
                  <input
                    className="input"
                    value={content.dieta.proteina_g}
                    onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, proteina_g: e.target.value } }))}
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="label">Carboidrato (g)</label>
                  <input
                    className="input"
                    value={content.dieta.carboidrato_g}
                    onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, carboidrato_g: e.target.value } }))}
                    placeholder="350"
                  />
                </div>
                <div>
                  <label className="label">Gordura (g)</label>
                  <input
                    className="input"
                    value={content.dieta.gordura_g}
                    onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, gordura_g: e.target.value } }))}
                    placeholder="80"
                  />
                </div>
              </div>

              <div>
                <label className="label">Observações gerais</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={content.dieta.observacoes}
                  onChange={(e) => setContent((c) => ({ ...c, dieta: { ...c.dieta, observacoes: e.target.value } }))}
                  placeholder="Hidratação, suplementos, etc."
                />
              </div>

              {/* Refeições */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">Refeições</p>
                  <button onClick={addMeal} className="btn-ghost text-xs flex items-center gap-1">
                    <Plus size={13} /> Adicionar refeição
                  </button>
                </div>

                {content.dieta.refeicoes.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-4 border border-dashed border-neutral-200 rounded-xl">
                    Nenhuma refeição adicionada
                  </p>
                )}

                {content.dieta.refeicoes.map((meal, mi) => (
                  <MealBlock
                    key={meal.id}
                    meal={meal}
                    index={mi}
                    onUpdateMeal={updateMeal}
                    onRemoveMeal={removeMeal}
                    onAddFood={addFood}
                    onUpdateFood={updateFood}
                    onRemoveFood={removeFood}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-neutral-100">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />}
              Salvar protocolo
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </div>
      )}

      {/* ── Lista de protocolos ── */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 size={24} className="animate-spin text-neutral-300" />
          </div>
        ) : protocols.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">
            Nenhum protocolo criado ainda. Clique em &quot;Novo protocolo&quot; para começar.
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {protocols.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-800 truncate">{p.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {typeLabel[p.type] ?? p.type} · Criado em {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-brand-600"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DayBlock({
  day, index,
  onUpdateDay, onRemoveDay,
  onAddExercise, onUpdateExercise, onRemoveExercise,
}: {
  day: TrainingDay
  index: number
  onUpdateDay: (id: string, field: keyof TrainingDay, v: string) => void
  onRemoveDay: (id: string) => void
  onAddExercise: (dayId: string) => void
  onUpdateExercise: (dayId: string, exId: string, field: keyof Exercise, v: string) => void
  onRemoveExercise: (dayId: string, exId: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50">
        <span className="text-xs font-bold text-neutral-400 w-5 text-center">D{index + 1}</span>
        <input
          className="flex-1 bg-transparent text-sm font-medium text-neutral-800 outline-none placeholder:text-neutral-300"
          value={day.nome}
          onChange={(e) => onUpdateDay(day.id, 'nome', e.target.value)}
          placeholder="Nome do dia (ex: Segunda — Peito)"
        />
        <button onClick={() => setOpen(!open)} className="text-neutral-400 hover:text-neutral-600">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={() => onRemoveDay(day.id)} className="text-neutral-300 hover:text-red-400">
          <X size={15} />
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-2">
          {day.exercicios.length === 0 && (
            <p className="text-xs text-neutral-400 text-center py-2">Nenhum exercício</p>
          )}
          {day.exercicios.map((ex) => (
            <div key={ex.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="input text-xs col-span-4"
                value={ex.nome}
                onChange={(e) => onUpdateExercise(day.id, ex.id, 'nome', e.target.value)}
                placeholder="Exercício"
              />
              <input
                className="input text-xs col-span-2"
                value={ex.series}
                onChange={(e) => onUpdateExercise(day.id, ex.id, 'series', e.target.value)}
                placeholder="Séries"
              />
              <input
                className="input text-xs col-span-2"
                value={ex.repeticoes}
                onChange={(e) => onUpdateExercise(day.id, ex.id, 'repeticoes', e.target.value)}
                placeholder="Reps"
              />
              <input
                className="input text-xs col-span-2"
                value={ex.carga}
                onChange={(e) => onUpdateExercise(day.id, ex.id, 'carga', e.target.value)}
                placeholder="Carga"
              />
              <input
                className="input text-xs col-span-1"
                value={ex.descanso}
                onChange={(e) => onUpdateExercise(day.id, ex.id, 'descanso', e.target.value)}
                placeholder="Desc."
              />
              <button
                onClick={() => onRemoveExercise(day.id, ex.id)}
                className="col-span-1 flex justify-center text-neutral-300 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddExercise(day.id)}
            className="btn-ghost text-xs w-full mt-1 flex items-center gap-1 justify-center"
          >
            <Plus size={12} /> Exercício
          </button>
        </div>
      )}
    </div>
  )
}

function MealBlock({
  meal, index,
  onUpdateMeal, onRemoveMeal,
  onAddFood, onUpdateFood, onRemoveFood,
}: {
  meal: Meal
  index: number
  onUpdateMeal: (id: string, field: keyof Meal, v: string) => void
  onRemoveMeal: (id: string) => void
  onAddFood: (mealId: string) => void
  onUpdateFood: (mealId: string, foodId: string, field: keyof FoodItem, v: string) => void
  onRemoveFood: (mealId: string, foodId: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50">
        <span className="text-xs font-bold text-neutral-400 w-5 text-center">R{index + 1}</span>
        <input
          className="flex-1 bg-transparent text-sm font-medium text-neutral-800 outline-none placeholder:text-neutral-300"
          value={meal.nome}
          onChange={(e) => onUpdateMeal(meal.id, 'nome', e.target.value)}
          placeholder="Nome da refeição (ex: Café da manhã)"
        />
        <input
          className="bg-transparent text-xs text-neutral-500 outline-none w-16 text-right placeholder:text-neutral-300"
          value={meal.horario}
          onChange={(e) => onUpdateMeal(meal.id, 'horario', e.target.value)}
          placeholder="07:00"
        />
        <button onClick={() => setOpen(!open)} className="text-neutral-400 hover:text-neutral-600">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={() => onRemoveMeal(meal.id)} className="text-neutral-300 hover:text-red-400">
          <X size={15} />
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-2">
          {meal.alimentos.length === 0 && (
            <p className="text-xs text-neutral-400 text-center py-2">Nenhum alimento</p>
          )}
          {meal.alimentos.map((food) => (
            <div key={food.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="input text-xs col-span-8"
                value={food.nome}
                onChange={(e) => onUpdateFood(meal.id, food.id, 'nome', e.target.value)}
                placeholder="Alimento"
              />
              <input
                className="input text-xs col-span-3"
                value={food.quantidade}
                onChange={(e) => onUpdateFood(meal.id, food.id, 'quantidade', e.target.value)}
                placeholder="Quantidade"
              />
              <button
                onClick={() => onRemoveFood(meal.id, food.id)}
                className="col-span-1 flex justify-center text-neutral-300 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddFood(meal.id)}
            className="btn-ghost text-xs w-full mt-1 flex items-center gap-1 justify-center"
          >
            <Plus size={12} /> Alimento
          </button>
        </div>
      )}
    </div>
  )
}
