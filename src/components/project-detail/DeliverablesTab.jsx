import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Trash2, Pencil, X, FileText, Package,
  CheckCircle2, Clock, Eye, Send, ChevronRight,
} from 'lucide-react'
import { getDeliverables, createDeliverable, updateDeliverable, deleteDeliverable } from '../../api/deliverables'
import { cn, formatDate } from '../../lib/utils'

const STATUS_OPTIONS = ['draft', 'in_review', 'approved', 'delivered']
const TYPE_OPTIONS = ['document', 'physical']

const STATUS_STYLES = {
  draft: 'text-zinc-400 bg-zinc-400/10',
  in_review: 'text-amber-400 bg-amber-400/10',
  approved: 'text-blue-400 bg-blue-400/10',
  delivered: 'text-emerald-400 bg-emerald-400/10',
}

const STATUS_ICONS = {
  draft: Clock,
  in_review: Eye,
  approved: CheckCircle2,
  delivered: Send,
}

const STATUS_LABELS = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  delivered: 'Delivered',
}

const TYPE_STYLES = {
  document: 'text-blue-400 bg-blue-400/10',
  physical: 'text-violet-400 bg-violet-400/10',
}

const DELIVERABLE_DEFAULTS = {
  title: '',
  description: '',
  type: 'document',
  status: 'draft',
  revision: 'v1.0',
  owner_name: '',
  due_date: '',
  task_id: '',
}

function DeliverableFormModal({ deliverable, projectId, teamMembers, tasks, onClose, onSave, loading, error }) {
  const [form, setForm] = useState(deliverable ? {
    title: deliverable.title || '',
    description: deliverable.description || '',
    type: deliverable.type || 'document',
    status: deliverable.status || 'draft',
    revision: deliverable.revision || 'v1.0',
    owner_name: deliverable.owner_name || '',
    due_date: deliverable.due_date || '',
    task_id: deliverable.task_id || '',
  } : DELIVERABLE_DEFAULTS)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)] shrink-0">
          <h2 className="font-display font-700 text-base text-foreground">
            {deliverable ? 'Edit Deliverable' : 'New Deliverable'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="overflow-y-auto flex-1">
          <div className="px-5 py-5 space-y-4">

            {/* Type toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPE_OPTIONS.map(t => (
                  <button key={t} type="button" onClick={() => set('type', t)}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all',
                      form.type === t
                        ? t === 'document'
                          ? 'bg-blue-400/15 text-blue-300 border-blue-400/30'
                          : 'bg-violet-400/15 text-violet-300 border-violet-400/30'
                        : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]'
                    )}>
                    {t === 'document' ? <FileText size={14} /> : <Package size={14} />}
                    {t === 'document' ? 'Document' : 'Physical Item'}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder={form.type === 'document' ? 'e.g. Control System Design Spec' : 'e.g. PLC Panel Assembly'}
                required
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Details about this deliverable..." rows={2}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all resize-none" />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => {
                  const Icon = STATUS_ICONS[s]
                  return (
                    <button key={s} type="button" onClick={() => set('status', s)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        form.status === s
                          ? cn(STATUS_STYLES[s], 'border-current/30')
                          : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]'
                      )}>
                      <Icon size={11} />
                      {STATUS_LABELS[s]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Revision + Due date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revision</label>
                <input value={form.revision} onChange={e => set('revision', e.target.value)}
                  placeholder="v1.0"
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              </div>
            </div>

            {/* Owner */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Owner</label>
              {teamMembers?.length > 0 ? (
                <select value={form.owner_name} onChange={e => set('owner_name', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all">
                  <option value="">Unassigned</option>
                  {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              ) : (
                <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)}
                  placeholder="Who is responsible for this?"
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              )}
            </div>

            {/* Linked task */}
            {tasks?.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Linked Task (optional)</label>
                <select value={form.task_id} onChange={e => set('task_id', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all">
                  <option value="">No linked task</option>
                  {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-[var(--pilot-border)] flex gap-3 shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[var(--pilot-border)] text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {deliverable ? 'Save Changes' : 'Create Deliverable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DeliverablesTab({ projectId, teamMembers, tasks }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDeliverable, setEditingDeliverable] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const { data: deliverables = [], isLoading } = useQuery({
    queryKey: ['deliverables', projectId],
    queryFn: () => getDeliverables(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createDeliverable({
      ...payload,
      project_id: projectId,
      task_id: payload.task_id || null,
      due_date: payload.due_date || null,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliverables', projectId] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateDeliverable(id, {
      ...payload,
      task_id: payload.task_id || null,
      due_date: payload.due_date || null,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliverables', projectId] })
      setEditingDeliverable(null)
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeliverable,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deliverables', projectId] }),
  })

  const handleSave = (form) => {
    if (editingDeliverable) {
      updateMutation.mutate({ id: editingDeliverable.id, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  const filtered = filterStatus === 'all' ? deliverables : deliverables.filter(d => d.status === filterStatus)

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = deliverables.filter(d => d.status === s).length
    return acc
  }, {})

  const deliveredCount = deliverables.filter(d => d.status === 'delivered').length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''}
          </p>
          {deliverables.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-400/10">
              {deliveredCount} of {deliverables.length} delivered
            </span>
          )}
        </div>
        <button onClick={() => { setEditingDeliverable(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-xs font-medium rounded-lg transition-all">
          <Plus size={13} /> Add Deliverable
        </button>
      </div>

      {/* Progress bar */}
      {deliverables.length > 0 && (
        <div className="pilot-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Delivery Progress</span>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round((deliveredCount / deliverables.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--pilot-surface-3)] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${(deliveredCount / deliverables.length) * 100}%` }} />
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={cn('w-2 h-2 rounded-full', {
                  'bg-zinc-400': s === 'draft',
                  'bg-amber-400': s === 'in_review',
                  'bg-blue-400': s === 'approved',
                  'bg-emerald-400': s === 'delivered',
                })} />
                <span className="text-[10px] text-muted-foreground">{STATUS_LABELS[s]} ({statusCounts[s]})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setFilterStatus('all')}
          className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
            filterStatus === 'all'
              ? 'bg-[var(--pilot-blue)]/15 text-[var(--pilot-blue)] border-[var(--pilot-blue)]/20'
              : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
          All ({deliverables.length})
        </button>
        {STATUS_OPTIONS.map(s => {
          const Icon = STATUS_ICONS[s]
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
                filterStatus === s
                  ? cn(STATUS_STYLES[s], 'border-current/20')
                  : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
              <Icon size={10} />
              {STATUS_LABELS[s]} {statusCounts[s] > 0 ? `(${statusCounts[s]})` : ''}
            </button>
          )
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center pilot-surface rounded-xl">
          <div className="flex gap-2">
            <FileText size={24} className="text-muted-foreground/40" />
            <Package size={24} className="text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground">No deliverables yet</p>
          <button onClick={() => { setEditingDeliverable(null); setModalOpen(true) }}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 transition-colors">
            + Add your first deliverable
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(d => {
            const StatusIcon = STATUS_ICONS[d.status]
            const linkedTask = tasks?.find(t => t.id === d.task_id)
            return (
              <div key={d.id} className="pilot-surface rounded-xl p-4 hover:border-[var(--pilot-border-bright)] transition-all group">
                <div className="flex items-start gap-3">
                  {/* Type icon */}
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    d.type === 'document' ? 'bg-blue-400/10' : 'bg-violet-400/10')}>
                    {d.type === 'document'
                      ? <FileText size={14} className="text-blue-400" />
                      : <Package size={14} className="text-violet-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium',
                          d.status === 'delivered' ? 'text-muted-foreground line-through' : 'text-foreground')}>
                          {d.title}
                        </p>
                        {d.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{d.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => { setEditingDeliverable(d); setModalOpen(true) }}
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteMutation.mutate(d.id)}
                          className="p-1.5 text-muted-foreground hover:text-rose-400 rounded transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={cn('flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded', STATUS_STYLES[d.status])}>
                        <StatusIcon size={9} />
                        {STATUS_LABELS[d.status]}
                      </span>
                      <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', TYPE_STYLES[d.type])}>
                        {d.type}
                      </span>
                      {d.revision && (
                        <span className="text-[10px] font-mono text-muted-foreground bg-[var(--pilot-surface-3)] px-1.5 py-0.5 rounded">
                          {d.revision}
                        </span>
                      )}
                      {d.owner_name && (
                        <span className="text-[10px] text-muted-foreground">👤 {d.owner_name}</span>
                      )}
                      {d.due_date && (
                        <span className="text-[10px] text-muted-foreground">📅 {formatDate(d.due_date)}</span>
                      )}
                      {linkedTask && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
                          <ChevronRight size={9} /> {linkedTask.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <DeliverableFormModal
          deliverable={editingDeliverable}
          projectId={projectId}
          teamMembers={teamMembers}
          tasks={tasks}
          onClose={() => { setModalOpen(false); setEditingDeliverable(null) }}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}
    </div>
  )
}
