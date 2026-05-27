import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  CheckCircle2,
  PauseCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  Rocket,
  Zap,
  Waves,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getProjects } from '../api/projects'
import { formatDate, STATUS_COLORS, PRIORITY_COLORS, METHODOLOGY_COLORS, cn } from '../lib/utils'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="pilot-surface rounded-xl p-5 flex items-start gap-4 animate-fade-in">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', color)}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-display font-700 text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ProjectRow({ project, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--pilot-surface-3)] transition-all duration-150 text-left group"
    >
      {/* Color dot */}
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: project.color || '#6366f1' }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {project.target_end_date ? `Due ${formatDate(project.target_end_date)}` : 'No due date'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', METHODOLOGY_COLORS[project.methodology])}>
          {project.methodology}
        </span>
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', STATUS_COLORS[project.status])}>
          {project.status.replace('_', ' ')}
        </span>
        <ArrowRight size={13} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
      </div>
    </button>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    on_hold: projects.filter(p => p.status === 'on_hold').length,
    agile: projects.filter(p => p.methodology === 'agile').length,
    waterfall: projects.filter(p => p.methodology === 'waterfall').length,
  }

  const recent = [...projects].slice(0, 6)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Jhonny'

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl md:text-3xl font-700 text-foreground">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening across your projects.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Projects"
          value={stats.total}
          icon={FolderKanban}
          color="bg-blue-400/10 text-blue-400"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={TrendingUp}
          color="bg-emerald-400/10 text-emerald-400"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-violet-400/10 text-violet-400"
        />
        <StatCard
          label="On Hold"
          value={stats.on_hold}
          icon={PauseCircle}
          color="bg-amber-400/10 text-amber-400"
        />
      </div>

      {/* Methodology split */}
      {stats.total > 0 && (
        <div className="pilot-surface rounded-xl p-5 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
            Methodology Mix
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-400/10 flex items-center justify-center">
                <Zap size={15} className="text-violet-400" />
              </div>
              <div>
                <p className="text-lg font-display font-700 text-foreground">{stats.agile}</p>
                <p className="text-[11px] text-muted-foreground">Agile</p>
              </div>
            </div>
            <div className="w-px bg-[var(--pilot-border)]" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Waves size={15} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-display font-700 text-foreground">{stats.waterfall}</p>
                <p className="text-[11px] text-muted-foreground">Waterfall</p>
              </div>
            </div>
          </div>
          {stats.total > 0 && (
            <div className="mt-4 h-1.5 rounded-full bg-[var(--pilot-surface-3)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(stats.agile / stats.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Recent projects */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-lg text-foreground">Recent Projects</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-[var(--pilot-blue)] hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {isLoading ? (
          <div className="pilot-surface rounded-xl p-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="pilot-surface rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--pilot-surface-3)] flex items-center justify-center">
              <Rocket size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground/60">Create your first project to get started</p>
            <button
              onClick={() => navigate('/projects')}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-[var(--pilot-blue)] hover:bg-[var(--pilot-blue-dim)] text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus size={14} />
              New Project
            </button>
          </div>
        ) : (
          <div className="pilot-surface rounded-xl p-2 divide-y divide-[var(--pilot-border)]">
            {recent.map(project => (
              <ProjectRow
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
