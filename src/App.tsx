import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';

import { queryClient } from '@/lib/query-client';
import { AuthProvider, LoginPage, ProtectedRoute } from '@/features/auth';
import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { useThemeStore } from '@/stores/themeStore';

// Feature pages
import { ApiCataloguePage, ApiDocsPage } from '@/features/docs';
import { SandboxPage } from '@/features/sandbox';
import { KeyManagementPage } from '@/features/keys';
import { AnalyticsDashboardPage } from '@/features/analytics';
import { StatusPage } from '@/features/status';
import { ChangelogPage } from '@/features/changelog';


function ThemeSync() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ThemeSync />
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected — all routes behind auth */}
              <Route
                element={
                  <ProtectedRoute>
                    <PageLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<ApiCataloguePage />} />
                <Route path="/docs/:apiId" element={<ApiDocsPage />} />
                <Route path="/sandbox" element={<SandboxPage />} />
                <Route path="/keys" element={<KeyManagementPage />} />
                <Route path="/analytics" element={<AnalyticsDashboardPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/changelog" element={<ChangelogPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
