'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader2, X, Check } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatCurrency } from '@/lib/utils'
import type { Plan } from '@/types'

interface PlanForm {
  name: string
  slug: string
  description: string
  price: string
  duration_days: string
  features: string
  is_active: boolean
}

const emptyForm: PlanForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  duration_days: '30',
  features: '',
  is_active: true,
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PlanForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Plan[]>('/admin/planos?all=1')
      .then((res) => setPlans(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(plan: Plan) {
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description ?? '',
      price: String(plan.price),
      duration_days: String(plan.duration_days),
      features: (plan.features as string[]).join('\n'),
      is_active: plan.is_active,
    })
    setEditingId(plan.id)
    setError(null)
    setShowForm(true)
  }

  async function handleSave() {
    setError(null)
    if (!form.name || !form.slug || !form.price) {
      setError('Nome, slug e preço são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        duration_days: parseInt(form.duration_days, 10),
        features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
        is_active: form.is_active,
      }

      if (editingId) {
        const res = await api.put<Plan>(`/admin/planos/${editingId}`, payload)
        setPlans((prev) => prev.map((p) => (p.id === editingId ? res.data : p)))
      } else {
        const res = await api.post<Plan>('/admin/planos', payload)
        setPlans((prev) => [...prev, res.data])
      }
      setShowForm(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao salvar plano.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(plan: Plan) {
    await api.put<Plan>(`/admin/planos/${plan.id}`, { is_active: !plan.is_active })
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, is_active: !p.is_active } : p)))
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Planos</h1>
          <p className="page-subtitle">Gerencie os planos de assinatura</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo plano
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 space-y-4 border border-brand-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-800">
              {editingId ? 'Editar plano' : 'Novo plano'}
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
              <label className="label">Nome *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value
                  setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }))
                }}
                placeholder="Ex: Plano Mensal"
              />
            </div>
            <div>
              <label className="label">Slug *</label>
              <input
                className="input"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Ex: plano-mensal"
              />
            </div>
            <div>
              <label className="label">Preço (R$) *</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="199.90"
              />
            </div>
            <div>
              <label className="label">Duração (dias)</label>
              <input
                className="input"
                type="number"
                min="1"
                value={form.duration_days}
                onChange={(e) => setForm((f) => ({ ...f, duration_days: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="label">Descrição</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descrição breve do plano"
            />
          </div>

          <div>
            <label className="label">Funcionalidades (uma por linha)</label>
            <textarea
              className="input resize-none font-mono text-sm"
              rows={4}
              value={form.features}
              onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              placeholder={'Treino personalizado\nDieta personalizada\nChat com o treinador'}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="accent-brand-500 h-4 w-4"
              />
              <span className="text-sm text-neutral-700">Plano ativo</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Salvar
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 size={24} className="animate-spin text-neutral-300" />
          </div>
        ) : plans.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">Nenhum plano cadastrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Nome</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Preço</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">Duração</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{plan.name}</p>
                      <p className="text-xs text-neutral-400">{plan.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-800">
                      {formatCurrency(plan.price)}
                    </td>
                    <td className="px-4 py-3 text-center text-neutral-500">{plan.duration_days}d</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(plan)}
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors',
                          plan.is_active
                            ? 'text-green-600 bg-green-50 hover:bg-green-100'
                            : 'text-neutral-400 bg-neutral-100 hover:bg-neutral-200'
                        )}
                      >
                        {plan.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {plan.is_active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(plan)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
