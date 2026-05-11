import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SkeletonPage } from '@/components/ui/Skeleton';

/**
 * Login page — premium fintech aesthetic with gradient accent.
 * Redirects to dashboard if already authenticated.
 */
export function LoginPage() {
  const { isAuthenticated, isLoading, signIn, signUp } = useAuth();

  if (isLoading) return <SkeletonPage />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            <span className="text-2xl font-bold gradient-text">Demo</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Developer Portal
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Build, test, and integrate with our APIs
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-8 animate-slide-in-up">
          <div className="space-y-4">
            <Button
              onClick={signIn}
              size="lg"
              className="w-full"
              id="login-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign In
            </Button>

            <Button
              onClick={signUp}
              variant="secondary"
              size="lg"
              className="w-full"
              id="signup-button"
            >
              Create Account
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-tertiary)] text-center">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📖', label: 'API Docs' },
            { icon: '🧪', label: 'Sandbox' },
            { icon: '🔑', label: 'API Keys' },
          ].map((feature) => (
            <div key={feature.label} className="text-sm">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <div className="text-[var(--color-text-tertiary)] text-xs">
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
