import { useState } from 'react';
import { useApiKeyStore } from '../stores/apiKeyStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { copyToClipboard, formatDate } from '@/lib/utils';
import type { ApiKey } from '@/types/common';

export function KeyManagementPage() {
  const { keys, createKey, revokeKey } = useApiKeyStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showReveal, setShowReveal] = useState<ApiKey | null>(null);
  const [showRevoke, setShowRevoke] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [newKeyExpiry, setNewKeyExpiry] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const key = createKey(newKeyName.trim(), newKeyEnv, newKeyExpiry);
    setShowCreate(false);
    setShowReveal(key);
    setNewKeyName('');
    setNewKeyExpiry(0);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = () => {
    if (showRevoke) {
      revokeKey(showRevoke);
      setShowRevoke(null);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            API Keys
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Create and manage API keys for authentication.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} id="create-key-button">
          + Create Key
        </Button>
      </div>

      {keys.length === 0 ? (
        <EmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          }
          title="No API keys yet"
          description="Create your first API key to start authenticating requests."
          action={
            <Button onClick={() => setShowCreate(true)}>Create your first key</Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <Card key={key.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {key.name}
                  </span>
                  <Badge
                    variant={key.environment === 'production' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {key.environment}
                  </Badge>
                  {key.isRevoked && (
                    <Badge variant="error" size="sm">
                      Revoked
                    </Badge>
                  )}
                </div>
                <div className="font-mono text-sm text-[var(--color-text-tertiary)]">
                  {key.maskedKey}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1 flex gap-3">
                  <span>Created {formatDate(key.createdAt)}</span>
                  {key.expiresAt && (
                    <span>Expires {formatDate(key.expiresAt)}</span>
                  )}
                </div>
              </div>

              {!key.isRevoked && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowRevoke(key.id)}
                >
                  Revoke
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create API Key"
      >
        <div className="space-y-4">
          <Input
            label="Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g., Production Backend"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Environment
            </label>
            <div className="flex gap-2">
              {(['sandbox', 'production'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setNewKeyEnv(env)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer capitalize ${newKeyEnv === env
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                    }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Expiration
            </label>
            <select
              value={newKeyExpiry}
              onChange={(e) => setNewKeyExpiry(Number(e.target.value))}
              className="w-full h-10 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            >
              <option value={0}>Never expire</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
              <option value={365}>1 Year</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2 ">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reveal Modal */}
      <Modal
        isOpen={!!showReveal}
        onClose={() => setShowReveal(null)}
        title="API Key Created"
      >
        {showReveal && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400 font-medium">
                ⚠️ This key will not be shown again. Copy it now.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] p-3 rounded-lg border border-[var(--color-border)] break-all">
                {showReveal.key}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(showReveal.key)}
              >
                {copied ? '✓' : 'Copy'}
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={() => setShowReveal(null)}
            >
              Done
            </Button>
          </div>
        )}
      </Modal>

      {/* Revoke Confirmation */}
      <Modal
        isOpen={!!showRevoke}
        onClose={() => setShowRevoke(null)}
        title="Revoke API Key"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to revoke this key? This action cannot be undone.
            Any applications using this key will immediately lose access.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowRevoke(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRevoke}>
              Revoke Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
