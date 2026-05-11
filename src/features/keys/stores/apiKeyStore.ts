import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiKey } from '@/types/common';
import { generateApiKey, maskApiKey } from '@/lib/utils';

interface ApiKeyState {
  keys: ApiKey[];
  createKey: (name: string, environment: ApiKey['environment'], expiresInDays?: number) => ApiKey;
  revokeKey: (id: string) => void;
  getActiveKeys: () => ApiKey[];
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      keys: [],

      createKey: (name, environment, expiresInDays) => {
        const fullKey = generateApiKey();
        
        let expiresAt: string | undefined;
        if (expiresInDays) {
          const date = new Date();
          date.setDate(date.getDate() + expiresInDays);
          expiresAt = date.toISOString();
        }

        const newKey: ApiKey = {
          id: crypto.randomUUID(),
          name,
          key: fullKey,
          maskedKey: maskApiKey(fullKey),
          environment,
          createdAt: new Date().toISOString(),
          expiresAt,
          isRevoked: false,
        };

        set((state) => ({ keys: [newKey, ...state.keys] }));
        return newKey;
      },

      revokeKey: (id) => {
        set((state) => ({
          keys: state.keys.map((key) =>
            key.id === id ? { ...key, isRevoked: true } : key,
          ),
        }));
      },

      getActiveKeys: () => get().keys.filter((k) => !k.isRevoked),
    }),
    {
      name: 'Demo-api-keys',
    },
  ),
);
