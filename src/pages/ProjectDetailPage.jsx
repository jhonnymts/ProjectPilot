import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Layers, ShieldAlert, FileText, Users, CalendarDays, Pencil,
} from 'lucide-react'
import { getProject } from '../api/projects'
import { getTeamMembers } from '../api/team_members'
import { formatDate, STATUS_COLORS, PRIORITY_COLORS, METHODOLOGY_COLORS, cn } from '../lib/utils'
import TasksTab from '../components/project-detail/TasksTab'
import TeamTab from '../components/project-detail/TeamTab'
import RisksTab from '../components/project-detail/RisksTab'
import NotesTab from '../components/project-detail/NotesTab'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import { updateProject } from '../api/projects'
import { useQueryClient } from '@tanstack/react-query'

const TABS = [
  { id: 'tasks', label: 'Tasks', icon: Layers },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
  { id: 'notes', label: 'Notes', icon: FileText },
]

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('tasks')
  const [editModalOpen, setEditModalOpen] = useState(false)

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  })

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team_members', id],
    queryFn: () => getTeamMembers(id),
    enabled: !!id,
  })

  const updateMutation = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: false,
  })

  const handleUpdateProject = async (formData) => {
    await updateProject(id, formData)
    qc.invalidateQueries({ queryKey: ['project', id] })
    qc.invalidateQueries({ queryKey: ['projects'] })
    setEditModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground text-sm">Project not found.</p>
        <button onClick={() => navigate('/projects')} className="mt-4 text-sm text-[var(--pilot-blue)] hover:text-blue-300">
          ← Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Back to Projects
      </button>

      {/* Hero */}
      <div className="pilot-surface rounded-xl p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: project.color || '#6366f1' }} />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl md:text-2xl font-700 text-foreground leading-tight">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', METHODOLOGY_COLORS[project.methodology])}>
                  {project.methodology}
                </span>
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', STATUS_COLORS[project.status])}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', PRIORITY_COLORS[project.priority])}>
                  {project.priority} priority
                </span>
                {project.target_end_date && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays size={11} /> {formatDate(project.target_end_date)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-[var(--pilot-border)] hover:border-[var(--pilot-border-bright)] rounded-lg transition-all shrink-0">
            <Pencil size={12} /> Edit
          </button>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-mono text-muted-foreground">{project.progress_pct ?? 0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--pilot-surface-3)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${project.progress_pct ?? 0}%`, backgroundColor: project.color || '#6366f1' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 border-b border-[var(--pilot-border)] mb-5 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'text-[var(--pilot-blue)] border-[var(--pilot-blue)]'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              )}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tasks' && <TasksTab projectId={id} teamMembers={teamMembers} />}
        {activeTab === 'team' && <TeamTab projectId={id} />}
        {activeTab === 'risks' && <RisksTab projectId={id} />}
        {activeTab === 'notes' && <NotesTab projectId={id} />}
      </div>

      {editModalOpen && (
        <ProjectFormModal
          project={project}
          onSave={handleUpdateProject}
          onClose={() => setEditModalOpen(false)}
          loading={false}
          error={null}
        />
      )}
    </div>
  )
}
