import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, UserCircle2, X, Pencil } from 'lucide-react'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../api/team_members'
import { cn } from '../../lib/utils'

const ROLE_OPTIONS = [
  'Project Manager', 'Engineer', 'Developer', 'Designer',
  'QA Engineer', 'Business Analyst', 'Tech Lead', 'Stakeholder', 'Other'
]

const AVATAR_COLORS = [
  'bg-blue-400/20 text-blue-400',
  'bg-violet-400/20 text-violet-400',
  'bg-emerald-400/20 text-emerald-400',
  'bg-amber-400/20 text-amber-400',
  'bg-rose-400/20 text-rose-400',
  'bg-cyan-400/20 text-cyan-400',
]

function MemberFormModal({ member, projectId, onClose, onSave, loading, error }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    role: member?.role || '',
    email: member?.email || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-t-2xl sm:rounded-xl animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pilot-border)]">
          <h2 className="font-display font-700 text-base text-foreground">{member ? 'Edit Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" required
              className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all">
              <option value="">Select role...</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email (optional)</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com"
              className="w-full px-3 py-2.5 bg-[var(--pilot-surface-3)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 transition-all" />
          </div>
          {error && <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[var(--pilot-border)] text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {member ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TeamTab({ projectId }) {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team_members', projectId],
    queryFn: () => getTeamMembers(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createTeamMember({ ...payload, project_id: projectId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team_members', projectId] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateTeamMember(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team_members', projectId] }); setEditingMember(null); setModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team_members', projectId] }),
  })

  const handleSave = (form) => {
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        <button onClick={() => { setEditingMember(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-xs font-medium rounded-lg transition-all">
          <Plus size={13} /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center pilot-surface rounded-xl">
          <UserCircle2 size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No team members yet</p>
          <button onClick={() => { setEditingMember(null); setModalOpen(true) }}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 transition-colors">
            + Add your first team member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((member, i) => (
            <div key={member.id} className="pilot-surface rounded-xl p-4 flex items-center gap-3 hover:border-[var(--pilot-border-bright)] transition-all group">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-700 shrink-0', AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                {member.email && <p className="text-xs text-muted-foreground/60 truncate">{member.email}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => { setEditingMember(member); setModalOpen(true) }}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => deleteMutation.mutate(member.id)}
                  className="p-1.5 text-muted-foreground hover:text-rose-400 rounded transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <MemberFormModal
          member={editingMember}
          projectId={projectId}
          onClose={() => { setModalOpen(false); setEditingMember(null) }}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}
    </div>
  )
}
