import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WhatsAppChatContextType {
  isOpen: boolean;
  openChat: (initialMsg?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  queuedMessage: string | null;
  clearQueuedMessage: () => void;
}

const WhatsAppChatContext = createContext<WhatsAppChatContextType | undefined>(undefined);

export function WhatsAppChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

  const openChat = useCallback((initialMsg?: string) => {
    if (initialMsg) {
      setQueuedMessage(initialMsg);
    }
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearQueuedMessage = useCallback(() => {
    setQueuedMessage(null);
  }, []);

  return (
    <WhatsAppChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        queuedMessage,
        clearQueuedMessage,
      }}
    >
      {children}
    </WhatsAppChatContext.Provider>
  );
}

export function useWhatsAppChat() {
  const context = useContext(WhatsAppChatContext);
  if (!context) {
    throw new Error('useWhatsAppChat must be used within a WhatsAppChatProvider');
  }
  return context;
}
