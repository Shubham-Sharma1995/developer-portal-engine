import { useAuth } from '@/features/auth';
import { useThemeStore } from '@/stores/themeStore';
import { useEnvStore, type Environment } from '@/stores/envStore';
import { Button } from '@/components/ui/Button';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // Cmd+K shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
    },
    [showSearch],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="fixed top-0 right-0 h-16 border-b border-[var(--glass-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl z-30 flex items-center justify-between px-6 shadow-sm" style={{ left: 'var(--sidebar-width)' }}>
        {/* Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="group flex items-center px-4 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-elevated)] hover:shadow-[0_0_12px_rgba(139,92,246,0.1)] transition-all text-sm w-64 md:w-80 cursor-pointer"
          id="search-trigger"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-[var(--color-accent)] transition-colors shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="ml-3 truncate">Search APIs...</span>
          <kbd className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] font-semibold shadow-sm group-hover:border-[var(--color-accent-border)] group-hover:text-[var(--color-accent)] transition-all shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Environment Switcher */}
          <select
            value={useEnvStore().environment}
            onChange={(e) => useEnvStore.getState().setEnvironment(e.target.value as Environment)}
            className="h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2 text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
          >
            <option value="sandbox">Sandbox Env</option>
            <option value="staging">Staging Env</option>
            <option value="production">Production Env</option>
          </select>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            id="theme-toggle"
            className="hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] transition-colors rounded-full"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </Button>

          {/* User menu */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {user.name || user.email}
                </div>
                <div className="text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-bold">
                  Developer
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white text-sm font-bold overflow-hidden shadow-md ring-2 ring-[var(--color-bg-primary)] ring-offset-1 ring-offset-[var(--color-accent)]">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name?.[0] || user.email?.[0] || 'U').toUpperCase()
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                id="logout-button"
                className="ml-1 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <SearchDialog onClose={() => setShowSearch(false)} onNavigate={(path) => { navigate(path); setShowSearch(false); }} />
      )}
    </>
  );
}

// Inline SearchDialog for Cmd+K
function SearchDialog({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('');

  const items = [
    { label: 'API Catalogue', path: '/', section: 'Pages' },
    { label: 'Sandbox', path: '/sandbox', section: 'Pages' },
    { label: 'API Keys', path: '/keys', section: 'Pages' },
    { label: 'Analytics', path: '/analytics', section: 'Pages' },
    { label: 'Status', path: '/status', section: 'Pages' },
    { label: 'Changelog', path: '/changelog', section: 'Pages' },
    { label: 'PokéAPI Docs', path: '/docs/pokeapi', section: 'APIs' },
    { label: 'Demo Payments Docs', path: '/docs/Demo-payments', section: 'APIs' },
  ];

  const filtered = query
    ? items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    )
    : items;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[var(--color-border)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 h-12 bg-transparent border-none outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filtered.length > 0) {
                onNavigate(filtered[0].path);
              }
            }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-tertiary)]">
            ESC
          </kbd>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer"
            >
              <span className="text-[var(--color-text-tertiary)] text-[10px] uppercase tracking-wider w-12">
                {item.section}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
