import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects'
import {
  formatDate,
  todayLocal,
  STATUS_COLORS,
  PRIORITY_COLORS,
  METHODOLOGY_COLORS,
  cn,
} from '../lib/utils'
import ProjectFormModal from '../components/projects/ProjectFormModal'

function ProjectCard({ project, onEdit, onDelete, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="pilot-surface rounded-xl p-5 flex flex-col gap-4 hover:border-[var(--pilot-border-bright)] transition-all duration-200 animate-fade-in group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: project.color || '#6366f1' }}
          />
          <h3 className="font-medium text-foreground truncate text-sm leading-tight">{project.name}</h3>
        </div>
        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="p-1.5 text-muted-foreground/40 hover:text-muted-foreground rounded-md hover:bg-[var(--pilot-surface-3)] transition-all"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 pilot-surface rounded-lg py-1 shadow-xl">
                <button
                  onClick={() => { onEdit(project); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(project); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-400/5 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed -mt-1">
          {project.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', METHODOLOGY_COLORS[project.methodology])}>
          {project.methodology}
        </span>
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', STATUS_COLORS[project.status])}>
          {project.status.replace('_', ' ')}
        </span>
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', PRIORITY_COLORS[project.priority])}>
          {project.priority}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <span className="text-[10px] font-mono text-muted-foreground">{project.progress_pct ?? 0}%</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--pilot-surface-3)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${project.progress_pct ?? 0}%`,
              backgroundColor: project.color || '#6366f1',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
          <CalendarDays size={11} />
          <span>
            {project.target_end_date ? formatDate(project.target_end_date) : 'No deadline'}
          </span>
        </div>
        <button
          onClick={() => onOpen(project)}
          className="flex items-center gap-1 text-[11px] text-[var(--pilot-blue)] hover:text-blue-300 transition-colors"
        >
          Open <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ project, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 pilot-surface rounded-xl p-6 w-full max-w-sm animate-fade-in">
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <Trash2 size={18} className="text-rose-400" />
        </div>
        <h3 className="font-display font-700 text-base text-foreground">Delete Project</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Are you sure you want to delete <strong className="text-foreground">"{project.name}"</strong>? This will permanently remove all tasks, phases, sprints, and data associated with it.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-[var(--pilot-border)] text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

const COLOR_OPTIONS = [
  '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6',
  '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6',
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createProject(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateProject(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setEditingProject(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setDeletingProject(null) },
  })

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleSave = (formData) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, ...formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-700 text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-sm font-medium rounded-lg transition-all shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-2 bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--pilot-blue)]/50 focus:ring-1 focus:ring-[var(--pilot-blue)]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'active', 'on_hold', 'completed', 'archived'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                filterStatus === s
                  ? 'bg-[var(--pilot-blue)]/15 text-[var(--pilot-blue)] border border-[var(--pilot-blue)]/20'
                  : 'text-muted-foreground border border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)] hover:text-foreground'
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--pilot-surface-2)] border border-[var(--pilot-border)] flex items-center justify-center">
            <FolderKanban size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {search || filterStatus !== 'all' ? 'No projects match your filters' : 'No projects yet'}
          </p>
          {!search && filterStatus === 'all' && (
            <button
              onClick={() => { setEditingProject(null); setModalOpen(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-sm font-medium rounded-lg transition-all mt-1"
            >
              <Plus size={14} /> Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <div key={project.id} style={{ animationDelay: `${i * 50}ms` }}>
              <ProjectCard
                project={project}
                onEdit={(p) => { setEditingProject(p); setModalOpen(true) }}
                onDelete={setDeletingProject}
                onOpen={(p) => navigate(`/projects/${p.id}`)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <ProjectFormModal
          project={editingProject}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingProject(null) }}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error?.message || updateMutation.error?.message}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          project={deletingProject}
          onConfirm={() => deleteMutation.mutate(deletingProject.id)}
          onCancel={() => setDeletingProject(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  )
}
