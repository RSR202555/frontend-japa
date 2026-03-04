'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Upload, Loader2, Trash2, Plus } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatDate, getPhotoAngleLabel } from '@/lib/utils'
import type { ProgressPhoto, PaginatedResponse } from '@/types'

export default function EvolutionPage() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedAngle, setSelectedAngle] = useState<string>('front')
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function loadPhotos() {
    const res = await api.get<PaginatedResponse<ProgressPhoto>>('/student/progress-photos')
    setPhotos(res.data.data)
    setLoading(false)
  }

  useEffect(() => { loadPhotos() }, [])

  async function handleUpload() {
    if (!previewFile) return
    setUploading(true)

    const form = new FormData()
    form.append('image', previewFile)
    form.append('angle', selectedAngle)

    try {
      await api.post('/student/progress-photos', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPreviewFile(null)
      loadPhotos()
    } finally {
      setUploading(false)
    }
  }

  async function deletePhoto(id: number) {
    if (!confirm('Remover esta foto?')) return
    await api.delete(`/student/progress-photos/${id}`)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo: 5MB.')
      return
    }
    setPreviewFile(file)
  }

  const grouped = photos.reduce<Record<string, ProgressPhoto[]>>((acc, photo) => {
    const key = new Date(photo.taken_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(photo)
    return acc
  }, {})

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Camera size={24} className="text-brand-500" />
            Evolução
          </h1>
          <p className="page-subtitle">Registro fotográfico do seu progresso</p>
        </div>
        <button className="btn-primary" onClick={() => fileRef.current?.click()}>
          <Plus size={16} />
          Nova foto
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Upload panel */}
      {previewFile && (
        <div className="card p-6 animate-slide-up">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Enviar foto</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Preview */}
            <div className="relative h-48 w-36 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
              <img
                src={URL.createObjectURL(previewFile)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="label">Ângulo</label>
                <select className="input" value={selectedAngle} onChange={(e) => setSelectedAngle(e.target.value)}>
                  <option value="front">Frente</option>
                  <option value="back">Costas</option>
                  <option value="side_left">Lateral esquerda</option>
                  <option value="side_right">Lateral direita</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPreviewFile(null)} className="btn-ghost">Cancelar</button>
                <button onClick={handleUpload} disabled={uploading} className="btn-primary">
                  {uploading ? <><Loader2 size={16} className="animate-spin" />Enviando...</> : <><Upload size={16} />Enviar foto</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-xl bg-neutral-100 animate-pulse" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-center">
          <Camera size={40} className="text-neutral-200" />
          <p className="text-sm font-medium text-neutral-600">Nenhuma foto registrada</p>
          <p className="text-xs text-neutral-400">Envie sua primeira foto para acompanhar sua evolução</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, monthPhotos]) => (
            <div key={month}>
              <h2 className="text-sm font-semibold text-neutral-600 mb-3 capitalize">{month}</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {monthPhotos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 card-hover">
                    <Image
                      src={photo.thumbnail_url ?? photo.image_url}
                      alt={getPhotoAngleLabel(photo.angle)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <span className="text-white text-xs font-medium text-center">
                        {getPhotoAngleLabel(photo.angle)}
                      </span>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-danger text-white transition-colors"
                        aria-label="Remover foto"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
