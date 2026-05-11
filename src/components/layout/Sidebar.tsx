import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { API_REGISTRY } from '@/apis/api-registry';
import { useState } from 'react';

const navItems = [
  {
    label: 'API Catalogue',
    path: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    label: 'Sandbox',
    path: '/sandbox',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" />
      </svg>
    ),
  },
  {
    label: 'API Keys',
    path: '/keys',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    label: 'Status',
    path: '/status',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    label: 'Changelog',
    path: '/changelog',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen border-r border-[var(--glass-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl flex flex-col transition-all duration-300 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
      )}
      style={{ width: collapsed ? '64px' : 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border)] shrink-0 bg-transparent">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b5cf6] via-[#6d28d9] to-[#06b6d4] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 shrink-0">
          P
        </div>
        {!collapsed && (
          <div className="animate-fade-in flex flex-col justify-center">
            <span className="font-bold text-lg leading-none tracking-tight text-[var(--color-text-primary)]">Portal</span>
            <span className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest mt-0.5">
              Engine
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden',
                  isActive
                    ? 'text-[var(--color-accent)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-subtle)] to-transparent opacity-50" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[var(--color-accent)] rounded-r-full" />
                )}
                <span className={cn('shrink-0 relative z-10 transition-transform duration-300', isActive ? 'scale-110' : 'group-hover:scale-110')}>{item.icon}</span>
                {!collapsed && <span className="relative z-10">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* API List */}
        {!collapsed && (
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              APIs
            </div>
            {API_REGISTRY.map((api) => (
              <NavLink
                key={api.id}
                to={`/docs/${api.id}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  location.pathname === `/docs/${api.id}`
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
                )}
              >
                <span>{api.icon}</span>
                <span className="truncate">{api.name}</span>
                <span className="ml-auto text-[10px] text-[var(--color-text-tertiary)]">
                  v{api.version}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all text-sm cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn('transition-transform', collapsed && 'rotate-180')}
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
