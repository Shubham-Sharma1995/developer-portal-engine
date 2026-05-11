import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SkeletonPage } from '@/components/ui/Skeleton';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Route guard — redirects to login if user is not authenticated.
 * Shows skeleton during auth loading state.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SkeletonPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
