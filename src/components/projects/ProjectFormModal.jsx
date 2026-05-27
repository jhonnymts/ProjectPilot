import { useState, useEffect } from 'react'
import { X, Rocket } from 'lucide-react'
import { todayLocal, cn } from '../../lib/utils'

const COLOR_OPTIONS = [
  '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6',
  '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6',
]

const DEFAULTS = {
  name: '',
  description: '',
  methodology: 'agile',
  status: 'active',
  priority: 'medium',
  start_date: todayLocal(),
  target_end_date: '',
  progress_pct: 0,
  color: '#3b82f6',
}

export default function ProjectFormModal({ project, onSave, onClose, loading, error }) {
  const [form, setForm] = useState(DEFAULTS)

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        methodology: project.methodology || 'agile',
        status: project.status || 'active',
        priority: project.priority || 'medium',
        start_date: project.start_date || todayLocal(),
        target_end_date: project.target_end_date || '',
        progress_pct: project.progress_pct ?? 0,
        color: project.color || '#3b82f6',
      })
    } else {
      setForm(DEFAULTS)
    }
  }, [project])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      progress_pct: Number(form.progress_pct),
      target_end_date: form.target_end_date || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--pilot-blue)]/15 flex items-center justify-center">
              <Rocket size={14} className="text-[var(--pilot-blue)]" />
            </div>
            <h2 className="font-display font-700 text-base text-foreground">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-5 py-5 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Project Name *
              </label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. PLC Upgrade — Refinery Unit 3"
                required
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 focus:ring-1 focus:ring-[var(--pilot-blue)]/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Brief overview of the project scope and objectives..."
                rows={3}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 focus:ring-1 focus:ring-[var(--pilot-blue)]/20 transition-all resize-none"
              />
            </div>

            {/* Methodology + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Methodology
                </label>
                <select
                  value={form.methodology}
                  onChange={e => set('methodology', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all"
                >
                  <option value="agile">Agile</option>
                  <option value="waterfall">Waterfall</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Priority
              </label>
              <div className="flex gap-2">
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set('priority', p)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border',
                      form.priority === p
                        ? p === 'low' ? 'bg-zinc-400/15 text-zinc-300 border-zinc-400/30'
                        : p === 'medium' ? 'bg-blue-400/15 text-blue-300 border-blue-400/30'
                        : p === 'high' ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                        : 'bg-rose-400/15 text-rose-300 border-rose-400/30'
                        : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => set('start_date', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Target End Date
                </label>
                <input
                  type="date"
                  value={form.target_end_date}
                  onChange={e => set('target_end_date', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all"
                />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Progress
                </label>
                <span className="text-xs font-mono text-muted-foreground">{form.progress_pct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.progress_pct}
                onChange={e => set('progress_pct', e.target.value)}
                className="w-full accent-[var(--pilot-blue)]"
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set('color', c)}
                    className={cn(
                      'w-7 h-7 rounded-full transition-all duration-150',
                      form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--pilot-surface-2)] scale-110' : 'hover:scale-105'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[var(--pilot-border)] flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[var(--pilot-border)] text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
