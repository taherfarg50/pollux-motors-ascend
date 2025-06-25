import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the context type
interface ChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

// Create context with default values
const ChatbotContext = createContext<ChatbotContextType>({
  isOpen: false,
  openChatbot: () => {},
  closeChatbot: () => {},
  toggleChatbot: () => {},
});

// Add global type declaration for the openChat function
declare global {
  interface Window {
    polluxOpenChat?: () => void;
  }
}

// Provider component
export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Chat state management functions
  const openChatbot = () => {
    setIsOpen(true);
    console.log('Chatbot opened');
  };

  const closeChatbot = () => {
    setIsOpen(false);
    console.log('Chatbot closed');
  };

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
    console.log(`Chatbot ${isOpen ? 'closed' : 'opened'}`);
  };

  // Register the global openChat function
  useEffect(() => {
    // Make the openChat function globally available
    window.polluxOpenChat = openChatbot;

    return () => {
      // Clean up when component unmounts
      delete window.polluxOpenChat;
    };
  }, []);

  // Listen for custom events to open the chat
  useEffect(() => {
    const handleCustomOpenEvent = () => {
      openChatbot();
    };

    // Add event listener for custom events
    window.addEventListener('pollux:open-chat', handleCustomOpenEvent);

    return () => {
      // Clean up event listener
      window.removeEventListener('pollux:open-chat', handleCustomOpenEvent);
    };
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        openChatbot,
        closeChatbot,
        toggleChatbot,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the context
export const useChatbot = () => useContext(ChatbotContext); 