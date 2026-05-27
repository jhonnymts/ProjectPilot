import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Clock, AlertCircle, X } from 'lucide-react'
import { getTasks, createTask, updateTask, deleteTask } from '../../api/tasks'
import { cn, formatDate, todayLocal, PRIORITY_COLORS } from '../../lib/utils'

const STATUS_OPTIONS = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked']
const TYPE_OPTIONS = ['task', 'story', 'bug', 'feature', 'milestone']
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical']

const STATUS_STYLES = {
  backlog: 'text-zinc-400 bg-zinc-400/10',
  todo: 'text-blue-400 bg-blue-400/10',
  in_progress: 'text-violet-400 bg-violet-400/10',
  in_review: 'text-amber-400 bg-amber-400/10',
  done: 'text-emerald-400 bg-emerald-400/10',
  blocked: 'text-rose-400 bg-rose-400/10',
}

const STATUS_ICONS = {
  backlog: Circle,
  todo: Circle,
  in_progress: Clock,
  in_review: AlertCircle,
  done: CheckCircle2,
  blocked: AlertCircle,
}

const TYPE_STYLES = {
  task: 'text-zinc-400 bg-zinc-400/10',
  story: 'text-blue-400 bg-blue-400/10',
  bug: 'text-rose-400 bg-rose-400/10',
  feature: 'text-emerald-400 bg-emerald-400/10',
  milestone: 'text-amber-400 bg-amber-400/10',
}

const TASK_DEFAULTS = {
  title: '',
  description: '',
  type: 'task',
  status: 'todo',
  priority: 'medium',
  assigned_to: '',
  estimated_hours: '',
  actual_hours: '',
  story_points: '',
  due_date: '',
}

function TaskFormModal({ task, projectId, teamMembers, onClose, onSave, loading, error }) {
  const [form, setForm] = useState(task ? {
    title: task.title || '',
    description: task.description || '',
    type: task.type || 'task',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    assigned_to: task.assigned_to || '',
    estimated_hours: task.estimated_hours || '',
    actual_hours: task.actual_hours || '',
    story_points: task.story_points || '',
    due_date: task.due_date || '',
  } : TASK_DEFAULTS)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)] shrink-0">
          <h2 className="font-display font-700 text-base text-foreground">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="overflow-y-auto flex-1">
          <div className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Task title..."
                required
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Task details..."
                rows={3}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all capitalize">
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</label>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map(p => (
                  <button key={p} type="button" onClick={() => set('priority', p)}
                    className={cn('flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border',
                      form.priority === p
                        ? p === 'low' ? 'bg-zinc-400/15 text-zinc-300 border-zinc-400/30'
                          : p === 'medium' ? 'bg-blue-400/15 text-blue-300 border-blue-400/30'
                          : p === 'high' ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                          : 'bg-rose-400/15 text-rose-300 border-rose-400/30'
                        : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]'
                    )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigned To</label>
              {teamMembers?.length > 0 ? (
                <select value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all">
                  <option value="">Unassigned</option>
                  {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              ) : (
                <input value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. Hours</label>
                <input type="number" min="0" step="0.5" value={form.estimated_hours} onChange={e => set('estimated_hours', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Act. Hours</label>
                <input type="number" min="0" step="0.5" value={form.actual_hours} onChange={e => set('actual_hours', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Points</label>
                <input type="number" min="0" value={form.story_points} onChange={e => set('story_points', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Date</label>
              <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
            </div>

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
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TasksTab({ projectId, teamMembers }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createTask({ ...payload, project_id: projectId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', projectId] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateTask(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', projectId] }); setEditingTask(null); setModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const handleSave = (form) => {
    const payload = {
      ...form,
      estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      actual_hours: form.actual_hours ? Number(form.actual_hours) : null,
      story_points: form.story_points ? Number(form.story_points) : null,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to || null,
    }
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const filtered = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus)

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s).length
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        <button onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-xs font-medium rounded-lg transition-all">
          <Plus size={13} /> Add Task
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setFilterStatus('all')}
          className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
            filterStatus === 'all' ? 'bg-[var(--pilot-blue)]/15 text-[var(--pilot-blue)] border-[var(--pilot-blue)]/20' : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
          All ({tasks.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all border capitalize',
              filterStatus === s ? cn(STATUS_STYLES[s], 'border-current/20') : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
            {s.replace('_', ' ')} {statusCounts[s] > 0 ? `(${statusCounts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center pilot-surface rounded-xl">
          <p className="text-sm text-muted-foreground">No tasks yet</p>
          <button onClick={() => { setEditingTask(null); setModalOpen(true) }}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 transition-colors">
            + Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const StatusIcon = STATUS_ICONS[task.status] || Circle
            return (
              <div key={task.id} className="pilot-surface rounded-xl p-4 flex items-start gap-3 hover:border-[var(--pilot-border-bright)] transition-all group">
                <StatusIcon size={15} className={cn('shrink-0 mt-0.5', STATUS_STYLES[task.status]?.split(' ')[0])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground')}>
                      {task.title}
                    </p>
                    <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingTask(task); setModalOpen(true) }}
                        className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => deleteMutation.mutate(task.id)}
                        className="p-1 text-muted-foreground hover:text-rose-400 rounded transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', TYPE_STYLES[task.type])}>
                      {task.type}
                    </span>
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', STATUS_STYLES[task.status])}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded capitalize', PRIORITY_COLORS[task.priority])}>
                      {task.priority}
                    </span>
                    {task.assigned_to && (
                      <span className="text-[10px] text-muted-foreground">👤 {task.assigned_to}</span>
                    )}
                    {task.due_date && (
                      <span className="text-[10px] text-muted-foreground">📅 {formatDate(task.due_date)}</span>
                    )}
                    {task.estimated_hours && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {task.actual_hours ? `${task.actual_hours}h / ${task.estimated_hours}h` : `${task.estimated_hours}h est.`}
                      </span>
                    )}
                    {task.story_points && (
                      <span className="text-[10px] text-violet-400 font-mono">{task.story_points} pts</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <TaskFormModal
          task={editingTask}
          projectId={projectId}
          teamMembers={teamMembers}
          onClose={() => { setModalOpen(false); setEditingTask(null) }}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}
    </div>
  )
}
