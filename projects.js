import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  Rocket,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
]

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
          isActive
            ? 'bg-[var(--pilot-blue)]/15 text-[var(--pilot-blue)] border border-[var(--pilot-blue)]/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-[var(--pilot-surface-3)]'
        )
      }
    >
      <Icon size={16} className="shrink-0" />
      <span>{label}</span>
      <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
    </NavLink>
  )
}

function Sidebar({ onClose }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="flex flex-col h-full w-64 bg-[var(--pilot-surface-2)] border-r border-[var(--pilot-border)]">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--pilot-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--pilot-blue)]/20 border border-[var(--pilot-blue)]/30 flex items-center justify-center">
            <Rocket size={15} className="text-[var(--pilot-blue)]" />
          </div>
          <span className="font-display text-base font-700 text-foreground tracking-tight">
            Project<span className="text-gradient">Pilot</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Main
        </p>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-[var(--pilot-border)] pt-4 space-y-1">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
          <p className="text-[11px] text-muted-foreground">Project Manager</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-rose-400 hover:bg-rose-400/5 transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--pilot-surface)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-64 animate-slide-in">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--pilot-border)] bg-[var(--pilot-surface-2)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Rocket size={16} className="text-[var(--pilot-blue)]" />
            <span className="font-display font-700 text-sm">
              Project<span className="text-gradient">Pilot</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
