'use client'

import { useEffect, useState } from 'react'
import { Dumbbell, UtensilsCrossed, ChevronDown, ChevronUp, Loader2, Calendar } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

// ─── Tipos (espelham o backend) ───────────────────────────────────────────────

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

interface Assignment {
  id: number
  notes: string | null
  assigned_at: string
  protocol: {
    id: number
    title: string
    type: string
    content: ProtocolContent
  }
}

export default function MeuTreinoPage() {
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ assignment: Assignment | null }>('/aluno/protocolo')
      .then((res) => setAssignment(res.data.assignment))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="page-title">Meu Treino</h1>
          <p className="page-subtitle">Seu protocolo personalizado</p>
        </div>
        <div className="card p-12 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
            <Dumbbell size={28} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-neutral-700">Nenhum protocolo atribuído</p>
            <p className="text-sm text-neutral-400 mt-1">
              Seu treinador ainda não enviou seu protocolo. Em breve ele estará disponível aqui.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { protocol, notes, assigned_at } = assignment
  const content = protocol.content
  const showTreino = protocol.type === 'treino' || protocol.type === 'full'
  const showDieta = protocol.type === 'dieta' || protocol.type === 'full'

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="page-title">Meu Treino</h1>
        <p className="page-subtitle">Protocolo personalizado pelo seu treinador</p>
      </div>

      {/* Header do protocolo */}
      <div className="card p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <Dumbbell size={20} className="text-brand-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900">{protocol.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Enviado em {formatDate(assigned_at)}
            </span>
          </div>
          {notes && (
            <p className="text-sm text-neutral-600 mt-2 bg-neutral-50 rounded-lg px-3 py-2">{notes}</p>
          )}
        </div>
      </div>

      {/* Treino */}
      {showTreino && content.treino && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell size={18} className="text-brand-500" />
            <h2 className="text-base font-semibold text-neutral-800">Plano de Treino</h2>
          </div>

          {(content.treino.objetivo || content.treino.frequencia) && (
            <div className="card p-4 grid grid-cols-2 gap-4">
              {content.treino.objetivo && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Objetivo</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.treino.objetivo}</p>
                </div>
              )}
              {content.treino.frequencia && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Frequência</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.treino.frequencia}</p>
                </div>
              )}
            </div>
          )}

          {content.treino.observacoes && (
            <div className="card p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium mb-1">Observações</p>
              <p className="text-sm text-neutral-700">{content.treino.observacoes}</p>
            </div>
          )}

          {content.treino.dias?.map((day, i) => (
            <DayCard key={day.id} day={day} index={i} />
          ))}

          {(!content.treino.dias || content.treino.dias.length === 0) && (
            <p className="text-sm text-neutral-400 text-center py-4">Nenhum dia de treino cadastrado.</p>
          )}
        </section>
      )}

      {/* Dieta */}
      {showDieta && content.dieta && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-brand-500" />
            <h2 className="text-base font-semibold text-neutral-800">Plano Alimentar</h2>
          </div>

          {(content.dieta.objetivo || content.dieta.calorias_totais) && (
            <div className="card p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {content.dieta.objetivo && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Objetivo</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.dieta.objetivo}</p>
                </div>
              )}
              {content.dieta.calorias_totais && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Calorias/dia</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.dieta.calorias_totais} kcal</p>
                </div>
              )}
              {content.dieta.proteina_g && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Proteína</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.dieta.proteina_g}g</p>
                </div>
              )}
              {content.dieta.carboidrato_g && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Carboidrato</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.dieta.carboidrato_g}g</p>
                </div>
              )}
              {content.dieta.gordura_g && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">Gordura</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{content.dieta.gordura_g}g</p>
                </div>
              )}
            </div>
          )}

          {content.dieta.observacoes && (
            <div className="card p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium mb-1">Observações</p>
              <p className="text-sm text-neutral-700">{content.dieta.observacoes}</p>
            </div>
          )}

          {content.dieta.refeicoes?.map((meal, i) => (
            <MealCard key={meal.id} meal={meal} index={i} />
          ))}

          {(!content.dieta.refeicoes || content.dieta.refeicoes.length === 0) && (
            <p className="text-sm text-neutral-400 text-center py-4">Nenhuma refeição cadastrada.</p>
          )}
        </section>
      )}
    </div>
  )
}

function DayCard({ day, index }: { day: TrainingDay; index: number }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
            D{index + 1}
          </span>
          <span className="text-sm font-semibold text-neutral-800">{day.nome || `Dia ${index + 1}`}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-xs">{day.exercicios.length} exercício{day.exercicios.length !== 1 ? 's' : ''}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && day.exercicios.length > 0 && (
        <div className="border-t border-neutral-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500">Exercício</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-neutral-500">Séries</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-neutral-500">Reps</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-neutral-500">Carga</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-neutral-500">Descanso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {day.exercicios.map((ex) => (
                  <tr key={ex.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">{ex.nome}</td>
                    <td className="px-3 py-3 text-center text-neutral-600">{ex.series || '—'}</td>
                    <td className="px-3 py-3 text-center text-neutral-600">{ex.repeticoes || '—'}</td>
                    <td className="px-3 py-3 text-center text-neutral-600">{ex.carga || '—'}</td>
                    <td className="px-3 py-3 text-center text-neutral-600">{ex.descanso || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function MealCard({ meal, index }: { meal: Meal; index: number }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 rounded-lg bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
            R{index + 1}
          </span>
          <div className="text-left">
            <span className="text-sm font-semibold text-neutral-800">{meal.nome || `Refeição ${index + 1}`}</span>
            {meal.horario && (
              <span className="ml-2 text-xs text-neutral-400">{meal.horario}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-xs">{meal.alimentos.length} alimento{meal.alimentos.length !== 1 ? 's' : ''}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && meal.alimentos.length > 0 && (
        <div className="border-t border-neutral-100 px-5 py-3 space-y-1.5">
          {meal.alimentos.map((food) => (
            <div key={food.id} className="flex items-center justify-between text-sm py-1">
              <span className="text-neutral-700">{food.nome}</span>
              <span className="text-neutral-400 text-xs">{food.quantidade}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
