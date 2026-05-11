import { useAuth0 } from '@auth0/auth0-react';

/**
 * Custom hook wrapping Auth0 — provides a clean API for components.
 * Decouples components from the auth provider implementation.
 */
export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error,
  } = useAuth0();

  const signIn = () => loginWithRedirect();

  const signUp = () =>
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });

  const signOut = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    signIn,
    signUp,
    signOut,
    getAccessToken: getAccessTokenSilently,
  };
}
