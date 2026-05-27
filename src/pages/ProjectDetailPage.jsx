import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarDays,
  Tag,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react'
import { getProject } from '../api/projects'
import { formatDate, STATUS_COLORS, PRIORITY_COLORS, METHODOLOGY_COLORS, cn } from '../lib/utils'

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--pilot-border)] last:border-0">
      <span className="text-xs text-muted-foreground/60 uppercase tracking-wide font-medium w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <div className="flex-1 text-sm text-foreground">{children}</div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  })

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
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 text-sm text-[var(--pilot-blue)] hover:text-blue-300"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} /> Back to Projects
      </button>

      {/* Hero */}
      <div className="pilot-surface rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-4 h-4 rounded-full shrink-0 mt-1.5"
            style={{ backgroundColor: project.color || '#6366f1' }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-700 text-foreground leading-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', METHODOLOGY_COLORS[project.methodology])}>
                {project.methodology}
              </span>
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', STATUS_COLORS[project.status])}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', PRIORITY_COLORS[project.priority])}>
                {project.priority} priority
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-mono font-medium text-foreground">{project.progress_pct ?? 0}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--pilot-surface-3)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${project.progress_pct ?? 0}%`,
                backgroundColor: project.color || '#6366f1',
              }}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="pilot-surface rounded-xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
          Project Details
        </p>
        <DetailRow label="Start Date">
          {project.start_date ? formatDate(project.start_date) : <span className="text-muted-foreground">—</span>}
        </DetailRow>
        <DetailRow label="Target End">
          {project.target_end_date ? formatDate(project.target_end_date) : <span className="text-muted-foreground">—</span>}
        </DetailRow>
        <DetailRow label="Actual End">
          {project.actual_end_date ? formatDate(project.actual_end_date) : <span className="text-muted-foreground">—</span>}
        </DetailRow>
        <DetailRow label="Created">
          {formatDate(project.created_at?.split('T')[0])}
        </DetailRow>
        <DetailRow label="Last Updated">
          {formatDate(project.updated_at?.split('T')[0])}
        </DetailRow>
      </div>

      {/* Coming soon panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Layers, label: 'Tasks', desc: 'Manage tasks and stories — Sprint 2' },
          { icon: TrendingUp, label: 'Risks', desc: 'Risk register — Sprint 2' },
          { icon: Clock, label: 'Notes', desc: 'Meeting notes and decisions — Sprint 2' },
          { icon: Tag, label: 'Team', desc: 'Team members — Sprint 2' },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="pilot-surface rounded-xl p-5 flex items-center gap-3 opacity-50"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--pilot-surface-3)] flex items-center justify-center shrink-0">
              <Icon size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground/50">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
