import React, { createContext, useState, useCallback, useMemo } from 'react';
import { ToolPermissionSecurityGateway, ToolDefinition, ToolActionLog } from '@/lib/ai/tool-permissions';
import { ToolPermissionModal } from '@/components/auth/ToolPermissionModal';
import { useAuth } from '@/hooks/useAuth';

export interface ToolPermissionContextType {
  requestToolExecution: (
    toolName: string,
    actionRequested: string,
    onApproved: () => void | Promise<void>
  ) => Promise<boolean>;
  actionHistory: ToolActionLog[];
}

export const ToolPermissionContext = createContext<ToolPermissionContextType | undefined>(undefined);

export const ToolPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<{
    toolDef: ToolDefinition;
    actionRequested: string;
    onApproved: () => void | Promise<void>;
  } | null>(null);

  const [history, setHistory] = useState<ToolActionLog[]>([]);

  const requestToolExecution = useCallback(
    async (
      toolName: string,
      actionRequested: string,
      onApproved: () => void | Promise<void>
    ): Promise<boolean> => {
      const evalResult = ToolPermissionSecurityGateway.evaluatePermission(toolName);

      if (evalResult.autoGranted) {
        // Auto grant low risk tools
        ToolPermissionSecurityGateway.logAction({
          userId: user?.id,
          toolName,
          actionRequested,
          status: 'auto_granted',
        });
        setHistory([...ToolPermissionSecurityGateway.getActionHistory()]);
        await onApproved();
        return true;
      }

      // High Risk / Confirmation Required -> Open Modal
      if (evalResult.toolDef) {
        setActiveRequest({
          toolDef: evalResult.toolDef,
          actionRequested,
          onApproved,
        });
      }
      return false;
    },
    [user?.id]
  );

  const handleApprove = async () => {
    if (activeRequest) {
      ToolPermissionSecurityGateway.logAction({
        userId: user?.id,
        toolName: activeRequest.toolDef.name,
        actionRequested: activeRequest.actionRequested,
        status: 'approved',
      });
      setHistory([...ToolPermissionSecurityGateway.getActionHistory()]);
      await activeRequest.onApproved();
      setActiveRequest(null);
    }
  };

  const handleDeny = () => {
    if (activeRequest) {
      ToolPermissionSecurityGateway.logAction({
        userId: user?.id,
        toolName: activeRequest.toolDef.name,
        actionRequested: activeRequest.actionRequested,
        status: 'denied',
        resultSummary: 'Denied by user in permission security modal.',
      });
      setHistory([...ToolPermissionSecurityGateway.getActionHistory()]);
      setActiveRequest(null);
    }
  };

  const value = useMemo<ToolPermissionContextType>(
    () => ({
      requestToolExecution,
      actionHistory: history,
    }),
    [requestToolExecution, history]
  );

  return (
    <ToolPermissionContext.Provider value={value}>
      {children}
      {activeRequest && (
        <ToolPermissionModal
          toolDef={activeRequest.toolDef}
          actionRequested={activeRequest.actionRequested}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      )}
    </ToolPermissionContext.Provider>
  );
};
