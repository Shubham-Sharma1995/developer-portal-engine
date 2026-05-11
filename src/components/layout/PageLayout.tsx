import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * Main layout with sidebar + header + content area.
 * Used for all authenticated pages.
 */
export function PageLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <Header />
        <main className="flex-1 overflow-auto" style={{ paddingTop: 'var(--header-height)' }}>
          <div className="min-h-[calc(100vh-var(--header-height))]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
