import { Auth0Provider } from '@auth0/auth0-react';
import type { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth0 provider wrapper — configures Auth0 with environment variables.
 * Handles silent token refresh automatically.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;

  if (!domain || !clientId) {
    throw new Error(
      'Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env',
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={false}
    >
      {children}
    </Auth0Provider>
  );
}
