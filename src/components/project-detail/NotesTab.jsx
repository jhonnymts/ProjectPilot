import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, FileText, X, Pencil } from 'lucide-react'
import { getNotes, createNote, updateNote, deleteNote } from '../../api/notes'
import { cn, formatDate } from '../../lib/utils'

const NOTE_TYPES = ['general', 'meeting', 'decision', 'status_update']

const TYPE_STYLES = {
  general: 'text-zinc-400 bg-zinc-400/10',
  meeting: 'text-blue-400 bg-blue-400/10',
  decision: 'text-violet-400 bg-violet-400/10',
  status_update: 'text-emerald-400 bg-emerald-400/10',
}

const TYPE_LABELS = {
  general: 'General',
  meeting: 'Meeting',
  decision: 'Decision',
  status_update: 'Status Update',
}

function NoteFormModal({ note, projectId, onClose, onSave, loading, error }) {
  const [form, setForm] = useState({
    title: note?.title || '',
    content: note?.content || '',
    note_type: note?.note_type || 'general',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)] shrink-0">
          <h2 className="font-display font-700 text-base text-foreground">{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="overflow-y-auto flex-1">
          <div className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Note Type</label>
              <div className="flex gap-2 flex-wrap">
                {NOTE_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => set('note_type', t)}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      form.note_type === t ? cn(TYPE_STYLES[t], 'border-current/30') : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Note title..."
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content *</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write your note here..." rows={6} required
                className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all resize-none" />
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
              {note ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NotesTab({ projectId }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [filterType, setFilterType] = useState('all')

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', projectId],
    queryFn: () => getNotes(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createNote({ ...payload, project_id: projectId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes', projectId] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateNote(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes', projectId] }); setEditingNote(null); setModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes', projectId] }),
  })

  const handleSave = (form) => {
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  const filtered = filterType === 'all' ? notes : notes.filter(n => n.note_type === filterType)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        <button onClick={() => { setEditingNote(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-xs font-medium rounded-lg transition-all">
          <Plus size={13} /> Add Note
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setFilterType('all')}
          className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
            filterType === 'all' ? 'bg-[var(--pilot-blue)]/15 text-[var(--pilot-blue)] border-[var(--pilot-blue)]/20' : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
          All
        </button>
        {NOTE_TYPES.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
              filterType === t ? cn(TYPE_STYLES[t], 'border-current/20') : 'text-muted-foreground border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)]')}>
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center pilot-surface rounded-xl">
          <FileText size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <button onClick={() => { setEditingNote(null); setModalOpen(true) }}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 transition-colors">
            + Add your first note
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(note => (
            <div key={note.id} className="pilot-surface rounded-xl p-4 hover:border-[var(--pilot-border-bright)] transition-all group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', TYPE_STYLES[note.note_type])}>
                      {TYPE_LABELS[note.note_type]}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">
                      {formatDate(note.created_at?.split('T')[0])}
                    </span>
                  </div>
                  {note.title && <p className="text-sm font-medium text-foreground mb-1">{note.title}</p>}
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => { setEditingNote(note); setModalOpen(true) }}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(note.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 rounded transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <NoteFormModal
          note={editingNote}
          projectId={projectId}
          onClose={() => { setModalOpen(false); setEditingNote(null) }}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}
    </div>
  )
}
