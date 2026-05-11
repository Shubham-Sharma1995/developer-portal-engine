import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Environment = 'sandbox' | 'staging' | 'production';

interface EnvState {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
}

export const useEnvStore = create<EnvState>()(
  persist(
    (set) => ({
      environment: 'sandbox', // Default to sandbox
      setEnvironment: (env) => set({ environment: env }),
    }),
    {
      name: 'kulu-env-storage',
    }
  )
);
