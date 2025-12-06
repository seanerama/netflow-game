import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  shareOptions,
  users,
  correctPermissions,
  wrongPermissionWarnings,
  everyoneFullAccessDialogue,
  testShareDialogue,
  testSuccessDialogue,
  smbExplanation,
  type PermissionLevel,
  type SharePermission,
} from '../../data/mission1-6';

interface FileShareSetupProps {
  onComplete: () => void;
}

type SetupPhase = 'shares' | 'permissions' | 'testing' | 'explanation' | 'complete';

export function FileShareSetup({ onComplete }: FileShareSetupProps) {
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);

  const [phase, setPhase] = useState<SetupPhase>('shares');
  const [selectedShares, setSelectedShares] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<SharePermission[]>([]);
  const [currentShare, setCurrentShare] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const handleToggleShare = (shareId: string) => {
    if (selectedShares.includes(shareId)) {
      setSelectedShares(selectedShares.filter((s) => s !== shareId));
    } else {
      setSelectedShares([...selectedShares, shareId]);
    }
  };

  const handleContinueToPermissions = () => {
    if (selectedShares.length === 0) return;

    // Initialize default permissions (everyone = read)
    const defaultPerms: SharePermission[] = [];
    selectedShares.forEach((shareId) => {
      users.forEach((user) => {
        defaultPerms.push({
          shareId,
          userId: user.id,
          level: 'read',
        });
      });
    });
    setPermissions(defaultPerms);
    setCurrentShare(selectedShares[0]);
    setPhase('permissions');
  };

  const getPermission = (shareId: string, userId: string): PermissionLevel => {
    const perm = permissions.find(
      (p) => p.shareId === shareId && p.userId === userId
    );
    return perm?.level || 'none';
  };

  const setPermission = (
    shareId: string,
    userId: string,
    level: PermissionLevel
  ) => {
    const newPerms = permissions.filter(
      (p) => !(p.shareId === shareId && p.userId === userId)
    );
    newPerms.push({ shareId, userId, level });
    setPermissions(newPerms);

    // Check for warnings
    const warningKey = `${shareId}-${userId}`;
    if (wrongPermissionWarnings[warningKey] && level !== 'none') {
      if (!warnings.includes(warningKey)) {
        setWarnings([...warnings, warningKey]);
      }
    }
  };

  const checkForBadConfig = (): boolean => {
    // Check if everyone has full access to everything
    const allFull = permissions.every((p) => p.level === 'full');
    if (allFull && permissions.length > 0) {
      addDialogue(everyoneFullAccessDialogue);
      return true;
    }

    // Check accounting permissions specifically
    const accountingPerms = permissions.filter((p) => p.shareId === 'accounting');
    const wrongAccountingAccess = accountingPerms.filter(
      (p) => p.userId !== 'bubba' && p.userId !== 'mama' && p.level !== 'none'
    );
    if (wrongAccountingAccess.length > 0) {
      return true;
    }

    return false;
  };

  const validatePermissions = (): boolean => {
    let isValid = true;

    // Check each selected share
    selectedShares.forEach((shareId) => {
      const sharePerms = permissions.filter((p) => p.shareId === shareId);
      const correct = correctPermissions.filter((p) => p.shareId === shareId);

      // For accounting, strictly check
      if (shareId === 'accounting') {
        sharePerms.forEach((perm) => {
          const correctPerm = correct.find((c) => c.userId === perm.userId);
          if (correctPerm && correctPerm.level === 'none' && perm.level !== 'none') {
            isValid = false;
          }
        });
      }
    });

    return isValid;
  };

  const handleApplyPermissions = () => {
    if (checkForBadConfig()) {
      return;
    }

    if (!validatePermissions()) {
      // Show warning but still allow to continue
      setWarnings([...warnings, 'Some permissions may not be ideal']);
    }

    addDialogue(testShareDialogue);
    setPhase('testing');

    // Simulate testing after a delay
    setTimeout(() => {
      const results: Record<string, boolean> = {};
      users.forEach((user) => {
        results[user.id] = true; // All tests pass
      });
      setTestResults(results);
    }, 1500);
  };

  const handleTestComplete = () => {
    addDialogue([...testSuccessDialogue, ...smbExplanation]);
    setPhase('explanation');
  };

  const handleDialogueComplete = () => {
    if (phase === 'explanation') {
      setPhase('complete');
      onComplete();
    }
  };

  const getPermissionColor = (level: PermissionLevel) => {
    switch (level) {
      case 'full':
        return 'text-[var(--color-accent-green)]';
      case 'read':
        return 'text-[var(--color-accent-yellow)]';
      case 'none':
        return 'text-[var(--color-accent-red)]';
    }
  };

  const getPermissionBg = (level: PermissionLevel, isSelected: boolean) => {
    if (!isSelected) return 'bg-[var(--color-bg-dark)] border-[var(--color-border)]';
    switch (level) {
      case 'full':
        return 'bg-[var(--color-accent-green)]/20 border-[var(--color-accent-green)]';
      case 'read':
        return 'bg-[var(--color-accent-yellow)]/20 border-[var(--color-accent-yellow)]';
      case 'none':
        return 'bg-[var(--color-accent-red)]/20 border-[var(--color-accent-red)]';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-3 border-b-4 border-[#0f3460]">
        <div className="flex items-center justify-between">
          <div className="text-[var(--color-accent-blue)] text-sm font-bold">
            Windows File Sharing Setup
          </div>
          <div className="text-[var(--color-text-secondary)] text-xs">
            {phase === 'shares' && 'Step 1: Select folders to share'}
            {phase === 'permissions' && 'Step 2: Set permissions'}
            {phase === 'testing' && 'Step 3: Testing access'}
            {phase === 'explanation' && 'Complete!'}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-bg-medium)]">
          {phase === 'shares' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg mb-4">Select Folders to Share</h2>
              <p className="text-[10px] text-[var(--color-text-secondary)] mb-6">
                Choose which folders on Bubba's PC should be accessible to others on the network.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {shareOptions.map((share) => {
                  const isSelected = selectedShares.includes(share.id);
                  return (
                    <div
                      key={share.id}
                      onClick={() => handleToggleShare(share.id)}
                      className={`p-4 border-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-dark)] hover:border-[var(--color-accent-blue)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{share.icon}</span>
                        <div>
                          <div className="font-bold">{share.name}</div>
                          <div className="text-[8px] text-[var(--color-text-muted)]">
                            {share.path}
                          </div>
                          <div className="text-[10px] text-[var(--color-text-secondary)]">
                            {share.description}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[var(--color-accent-green)] text-xl ml-auto">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="warning-box mb-4">
                <p className="text-[10px]">
                  <strong>Warning:</strong> Only share specific folders, never the entire C: drive!
                </p>
              </div>

              <div className="text-center">
                <PixelButton
                  variant="primary"
                  onClick={handleContinueToPermissions}
                  disabled={selectedShares.length === 0}
                >
                  Continue to Permissions
                </PixelButton>
              </div>
            </div>
          )}

          {phase === 'permissions' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg mb-2">Set Share Permissions</h2>
              <p className="text-[10px] text-[var(--color-text-secondary)] mb-4">
                For each folder, decide who can read, modify, or have no access.
              </p>

              {/* Share Tabs */}
              <div className="flex gap-2 mb-4">
                {selectedShares.map((shareId) => {
                  const share = shareOptions.find((s) => s.id === shareId);
                  return (
                    <button
                      key={shareId}
                      onClick={() => setCurrentShare(shareId)}
                      className={`px-4 py-2 border-2 text-[10px] ${
                        currentShare === shareId
                          ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/20'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {share?.icon} {share?.name}
                    </button>
                  );
                })}
              </div>

              {currentShare && (
                <PixelPanel
                  title={`\\\\BUBBA-PC\\${shareOptions.find((s) => s.id === currentShare)?.name}`}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    {users.map((user) => {
                      const level = getPermission(currentShare, user.id);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 bg-[var(--color-bg-dark)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--color-pc)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs font-bold">
                              {user.icon}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold">{user.name}</div>
                              <div className="text-[8px] text-[var(--color-text-muted)]">
                                {user.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {(['none', 'read', 'full'] as PermissionLevel[]).map(
                              (permLevel) => (
                                <button
                                  key={permLevel}
                                  onClick={() =>
                                    setPermission(currentShare, user.id, permLevel)
                                  }
                                  className={`px-3 py-1 text-[8px] border-2 transition-all ${getPermissionBg(
                                    permLevel,
                                    level === permLevel
                                  )} ${getPermissionColor(permLevel)}`}
                                >
                                  {permLevel === 'none' && '🚫 None'}
                                  {permLevel === 'read' && '👁️ Read'}
                                  {permLevel === 'full' && '✏️ Full'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </PixelPanel>
              )}

              {/* Permission Legend */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-[8px]">
                <div className="p-2 bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]">
                  <strong>None:</strong> Cannot see or access the folder
                </div>
                <div className="p-2 bg-[var(--color-accent-yellow)]/10 border border-[var(--color-accent-yellow)]">
                  <strong>Read:</strong> Can view files but not change them
                </div>
                <div className="p-2 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]">
                  <strong>Full:</strong> Can read, write, and delete files
                </div>
              </div>

              <div className="text-center">
                <PixelButton variant="primary" onClick={handleApplyPermissions}>
                  Apply & Test Shares
                </PixelButton>
              </div>
            </div>
          )}

          {phase === 'testing' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg mb-4 text-center">Testing Network Shares</h2>

              <div className="space-y-4">
                {users.map((user) => {
                  const result = testResults[user.id];
                  return (
                    <div
                      key={user.id}
                      className={`p-4 border-4 ${
                        result === undefined
                          ? 'border-[var(--color-border)] bg-[var(--color-bg-dark)]'
                          : result
                          ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                          : 'border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-pc)] border-2 border-[var(--color-border)] flex items-center justify-center font-bold">
                            {user.icon}
                          </div>
                          <div>
                            <div className="font-bold">{user.name}'s PC</div>
                            <div className="text-[8px] text-[var(--color-text-muted)]">
                              Testing access to shared folders...
                            </div>
                          </div>
                        </div>
                        <div>
                          {result === undefined && (
                            <span className="text-[var(--color-accent-yellow)] animate-pulse">
                              Testing...
                            </span>
                          )}
                          {result === true && (
                            <span className="text-[var(--color-accent-green)]">
                              ✓ Access OK
                            </span>
                          )}
                          {result === false && (
                            <span className="text-[var(--color-accent-red)]">
                              ✗ Failed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {Object.keys(testResults).length === users.length && (
                <div className="text-center mt-6">
                  <PixelButton variant="primary" onClick={handleTestComplete}>
                    Continue
                  </PixelButton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Share Preview */}
        {phase === 'permissions' && (
          <div className="w-64 p-4 border-l-4 border-[var(--color-border)] bg-[var(--color-bg-dark)]">
            <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">
              NETWORK SHARES
            </h3>

            <div className="space-y-3 mb-6">
              {selectedShares.map((shareId) => {
                const share = shareOptions.find((s) => s.id === shareId);
                return (
                  <div
                    key={shareId}
                    className="p-2 bg-[var(--color-bg-medium)] border border-[var(--color-border)]"
                  >
                    <div className="text-[10px] font-bold flex items-center gap-2">
                      {share?.icon} {share?.name}
                    </div>
                    <div className="text-[8px] text-[var(--color-accent-blue)]">
                      \\BUBBA-PC\{share?.name}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 className="text-xs text-[var(--color-accent-yellow)] mb-2">
              TIPS
            </h3>
            <div className="text-[8px] text-[var(--color-text-secondary)] space-y-2">
              <p>• Accountants need access to financial data</p>
              <p>• Agents need property and maintenance access</p>
              <p>• Reception needs to read contracts</p>
              <p>• Keep sensitive data restricted!</p>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue overlay */}
      {dialogueQueue.length > 0 && (
        <DialogueManager onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}
