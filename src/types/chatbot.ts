// Define the message type for chat interactions
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Type for suggested questions
export interface SuggestedQuestion {
  text: string;
  icon?: React.ReactNode;
}

// Chat history structure
export type ChatHistory = Message[]; 