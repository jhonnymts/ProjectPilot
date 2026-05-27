import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ShieldAlert, X, Pencil } from 'lucide-react'
import { getRisks, createRisk, updateRisk, deleteRisk } from '../../api/risks'
import { cn } from '../../lib/utils'

const LEVEL_OPTIONS = ['low', 'medium', 'high']
const STATUS_OPTIONS = ['open', 'mitigated', 'closed']

const LEVEL_STYLES = {
  low: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-amber-400 bg-amber-400/10',
  high: 'text-rose-400 bg-rose-400/10',
}

const STATUS_STYLES = {
  open: 'text-rose-400 bg-rose-400/10',
  mitigated: 'text-amber-400 bg-amber-400/10',
  closed: 'text-emerald-400 bg-emerald-400/10',
}

const RISK_SCORE = { low: 1, medium: 2, high: 3 }

function RiskFormModal({ risk, projectId, onClose, onSave, loading, error }) {
  const [form, setForm] = useState({
    title: risk?.title || '',
    description: risk?.description || '',
    probability: risk?.probability || 'medium',
    impact: risk?.impact || 'medium',
    status: risk?.status || 'open',
    mitigation_plan: risk?.mitigation_plan || '',
    owner_name: risk?.owner_name || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)] shrink-0">
          <h2 className="font-display font-700 text-base text-foreground">{risk ? 'Edit Risk' : 'Add Risk'}</h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="overflow-y-auto flex-1">
          <div className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Describe the risk..." required
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Details about this risk..." rows={2}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Probability</label>
                <select value={form.probability} onChange={e => set('probability', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all capitalize">
                  {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Impact</label>
                <select value={form.impact} onChange={e => set('impact', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all capitalize">
                  {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all capitalize">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mitigation Plan</label>
              <textarea value={form.mitigation_plan} onChange={e => set('mitigation_plan', e.target.value)} placeholder="How will you mitigate this risk?" rows={2}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all resize-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk Owner</label>
              <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)} placeholder="Who owns this risk?"
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
            </div>

            {error && <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>}
          </div>

          <div className="px-5 py-4 border-t border-[var(--pilot-border)] flex gap-3 shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[var(--pilot-border)] text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {risk ? 'Save Changes' : 'Add Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RisksTab({ projectId }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState(null)

  const { data: risks = [], isLoading } = useQuery({
    queryKey: ['risks', projectId],
    queryFn: () => getRisks(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createRisk({ ...payload, project_id: projectId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['risks', projectId] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateRisk(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['risks', projectId] }); setEditingRisk(null); setModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRisk,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['risks', projectId] }),
  })

  const handleSave = (form) => {
    if (editingRisk) {
      updateMutation.mutate({ id: editingRisk.id, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  const openRisks = risks.filter(r => r.status === 'open')
  const highRisks = risks.filter(r => r.status === 'open' && (RISK_SCORE[r.probability] * RISK_SCORE[r.impact]) >= 4)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{risks.length} risk{risks.length !== 1 ? 's' : ''}</p>
          {highRisks.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-rose-400 bg-rose-400/10">
              {highRisks.length} high priority
            </span>
          )}
        </div>
        <button onClick={() => { setEditingRisk(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-xs font-medium rounded-lg transition-all">
          <Plus size={13} /> Add Risk
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : risks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center pilot-surface rounded-xl">
          <ShieldAlert size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No risks logged yet</p>
          <button onClick={() => { setEditingRisk(null); setModalOpen(true) }}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 transition-colors">
            + Log your first risk
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {risks.map(risk => {
            const score = RISK_SCORE[risk.probability] * RISK_SCORE[risk.impact]
            return (
              <div key={risk.id} className="pilot-surface rounded-xl p-4 hover:border-[var(--pilot-border-bright)] transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0 mt-1.5',
                      score >= 6 ? 'bg-rose-400' : score >= 3 ? 'bg-amber-400' : 'bg-emerald-400')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{risk.title}</p>
                      {risk.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{risk.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', LEVEL_STYLES[risk.probability])}>
                          P: {risk.probability}
                        </span>
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', LEVEL_STYLES[risk.impact])}>
                          I: {risk.impact}
                        </span>
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', STATUS_STYLES[risk.status])}>
                          {risk.status}
                        </span>
                        {risk.owner_name && <span className="text-[10px] text-muted-foreground">👤 {risk.owner_name}</span>}
                      </div>
                      {risk.mitigation_plan && (
                        <p className="text-xs text-muted-foreground/70 mt-1.5 italic">
                          Mitigation: {risk.mitigation_plan}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingRisk(risk); setModalOpen(true) }}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(risk.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-400 rounded transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <RiskFormModal
          risk={editingRisk}
          projectId={projectId}
          onClose={() => { setModalOpen(false); setEditingRisk(null) }}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}
    </div>
  )
}
