import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, X, MessageSquareText, ArrowRight, User, CornerRightDown, ThumbsUp, Clock, Calendar, Car, Wrench, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "@/context/ChatbotContext";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { sendMessageToGemini } from "@/services/geminiService";
import { Message } from "@/types/chatbot";
import { debounce } from "@/lib/utils";

// Chatbot suggestion buttons
const suggestedQuestions = [
  { text: "Buy a car", icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> },
  { text: "Available car models", icon: <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> },
  { text: "Financing options", icon: <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> },
  { text: "Service & maintenance", icon: <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> },
];

// Fallback responses in case the AI service fails
const fallbackResponses = [
  "I'm sorry, I'm having trouble connecting to my knowledge base. How can I assist you further?",
  "It seems I'm experiencing a technical issue. Could you try asking something else?",
  "I apologize for the inconvenience. Would you like me to connect you with a human representative?",
  "Let me try to help you with a different approach. What specific information are you looking for?",
];

// Modern chatbot icon for the floating button
const ModernChatbotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="16" rx="2" />
    <path d="M6 16v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
    <circle cx="12" cy="10" r="2" />
    <path d="M8 8a2 2 0 1 0-4 0" />
    <path d="M16 8a2 2 0 1 1 4 0" />
  </svg>
);

export default function Chatbot() {
  const { isOpen, closeChatbot, openChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Pollux Motors. I'm powered by Gemini 2.0 Flash. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(true); // Flag to track if AI service is available
  const [errorCount, setErrorCount] = useState(0); // Counter for consecutive errors
  const [isModelLoading, setIsModelLoading] = useState(false); // Track when model is loading
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Create a debounced version of the scroll function for better performance
  const debouncedScrollToBottom = useCallback(
    debounce(() => {
      if (messagesEndRef.current && viewportRef.current) {
        // Two different scroll methods for better compatibility
        // Method 1: Using scrollIntoView
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
        
        // Method 2: Direct scroll control on the viewport
        if (viewportRef.current) {
          viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
      }
    }, 50),
    [messagesEndRef, viewportRef]
  );
  
  // Improved scroll function that ensures reliable scrolling
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && viewportRef.current) {
      // For immediate actions like sending a message, use immediate scroll
      if (viewportRef.current) {
        // First do an immediate scroll
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        
        // Then use the debounced smooth scroll for animation
        debouncedScrollToBottom();
        
        // Force another scroll after a short delay to ensure it works
        setTimeout(() => {
          if (viewportRef.current) {
            viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
          }
        }, 100);
      }
    }
  }, [debouncedScrollToBottom]);

  // Scroll when messages change or typing indicator appears/disappears
  useEffect(() => {
    scrollToBottom();
    // Add a second scroll attempt after a delay to ensure it works
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 300);
    return () => clearTimeout(timer);
  }, [messages, isTyping, scrollToBottom]);

  // Also scroll when the chat window opens
  useEffect(() => {
    if (isOpen) {
      // Initial scroll
      scrollToBottom();
      
      // Additional scroll attempts with increasing delays
      const timers = [
        setTimeout(() => scrollToBottom(), 100),
        setTimeout(() => scrollToBottom(), 300),
        setTimeout(() => scrollToBottom(), 500)
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [isOpen, scrollToBottom]);
  
  // Use MutationObserver to detect DOM changes and scroll accordingly
  useEffect(() => {
    if (!viewportRef.current) return;
    
    const chatContainer = viewportRef.current;
    
    // Create a mutation observer to watch for changes in the chat content
    const observer = new MutationObserver((mutations) => {
      // Check if the mutations affect the chat content
      const shouldScroll = mutations.some(mutation => 
        mutation.type === 'childList' || 
        mutation.attributeName === 'style'
      );
      
      if (shouldScroll) {
        scrollToBottom();
      }
    });
    
    // Start observing the chat container
    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    // Clean up the observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [viewportRef, scrollToBottom, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);
    setIsModelLoading(true);

    try {
      let botReply: string;
      
      if (isAiEnabled) {
        // Use Gemini API for more natural responses
        botReply = await sendMessageToGemini(input, messages);
        
        // Reset error count on successful response
        if (botReply && !botReply.includes("I'm having trouble connecting")) {
          setErrorCount(0);
        } else {
          // Increment error count if response indicates connection issues
          setErrorCount(prev => prev + 1);
          
          // Disable AI after 3 consecutive errors
          if (errorCount >= 2) {
            setIsAiEnabled(false);
            console.warn("Gemini AI service disabled after multiple failures");
            
            // Add a message to inform the user
            const aiDisabledMessage: Message = {
              id: (Date.now() + 2).toString(),
              text: "I'm currently experiencing connectivity issues with my AI service. I'll switch to basic mode to continue helping you.",
              sender: "bot",
              timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, aiDisabledMessage]);
          }
        }
      } else {
        // Fallback to basic responses if AI service is disabled
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        botReply = fallbackResponses[randomIndex];
      }

      // Add bot message after a delay
      setTimeout(() => {
        setIsTyping(false);
        setIsModelLoading(false);
        
        const newBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botReply,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, newBotMessage]);
      }, isAiEnabled ? 800 : 500); // Shorter delay for fallback responses
    } catch (error) {
      console.error("Error generating bot response:", error);
      setIsTyping(false);
      setIsModelLoading(false);
      
      // Handle error gracefully with fallback response
      const fallbackReply = "I'm experiencing a technical issue with my AI service. Please try again or contact our sales team directly at info@polluxmotors.com.";
      
      const errorBotMessage: Message = {
          id: (Date.now() + 1).toString(),
        text: fallbackReply,
          sender: "bot",
          timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorBotMessage]);
      
      // Increment error count
      setErrorCount(prev => prev + 1);
      
      // Disable AI after 3 consecutive errors
      if (errorCount >= 2) {
        setIsAiEnabled(false);
        console.warn("Gemini AI service disabled after multiple failures");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    // Add user message for the suggested question
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    
    // Show typing indicator
    setIsTyping(true);

    try {
      let botReply: string;
      
      if (isAiEnabled) {
        // Use Gemini API
        botReply = await sendMessageToGemini(question, messages);
        
        // Reset error count on successful response
        if (botReply && !botReply.includes("I'm having trouble connecting")) {
          setErrorCount(0);
        } else {
          setErrorCount(prev => prev + 1);
          if (errorCount >= 2) {
            setIsAiEnabled(false);
          }
        }
      } else {
        // Fallback
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        botReply = fallbackResponses[randomIndex];
      }

      // Add bot message after a delay
      setTimeout(() => {
        setIsTyping(false);
        
        const newBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botReply,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, newBotMessage]);
      }, 1200);
    } catch (error) {
      console.error("Error generating bot response:", error);
      setIsTyping(false);
      
      const fallbackReply = "I'm experiencing a technical issue. Please try again or contact our sales team directly at info@polluxmotors.com.";
      
      const errorBotMessage: Message = {
          id: (Date.now() + 1).toString(),
        text: fallbackReply,
          sender: "bot",
          timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorBotMessage]);
      setErrorCount(prev => prev + 1);
      
      if (errorCount >= 2) {
        setIsAiEnabled(false);
      }
    }
  };

  // Optimize message rendering with memo
  const MessageItem = useCallback(({ message }: { message: Message }) => (
    <div
      key={message.id}
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } w-full`}
    >
      {message.sender === "bot" && (
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mr-1.5 sm:mr-2 mt-1 flex-shrink-0">
          <AvatarFallback className="bg-blue-500 text-white">
            <Bot size={14} className="sm:size-16" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[75%] p-2 sm:p-3 text-sm ${
          message.sender === "user"
            ? "bg-blue-600 text-white rounded-t-lg rounded-bl-lg"
            : "bg-gray-100 dark:bg-navy/50 rounded-t-lg rounded-br-lg"
        } shadow-sm`}
      >
        <p className="text-xs sm:text-sm">{message.text}</p>
        <p className="text-[10px] sm:text-xs opacity-70 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      
      {message.sender === "user" && (
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ml-1.5 sm:ml-2 mt-1 flex-shrink-0">
          <AvatarFallback className="bg-gray-500 text-white">
            <User size={14} className="sm:size-16" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  ), []);

  if (!isOpen) {
  return (
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
          <Button
          onClick={openChatbot}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 flex items-center justify-center text-white"
        >
          <ModernChatbotIcon />
          </Button>
      </motion.div>
    );
  }
      
  return (
        <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-80 md:w-96 h-[450px] sm:h-[500px] shadow-xl z-50 border-none overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 flex flex-row justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 border-2 border-white/40">
              <AvatarImage src="/placeholder.svg" alt="Bot" />
              <AvatarFallback className="bg-blue-500"><Bot size={16} className="sm:size-20" /></AvatarFallback>
                </Avatar>
                <div>
              <p className="font-semibold text-sm sm:text-base">Pollux Motors Assistant</p>
              <div className="flex items-center text-xs text-blue-100">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mr-1.5 sm:mr-2"></div>
                Online
                  </div>
                </div>
              </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeChatbot} 
            className="hover:bg-white/10 text-white rounded-full h-7 w-7 sm:h-8 sm:w-8"
                >
            <X size={16} className="sm:size-18" />
                </Button>
            </CardHeader>
            
        <CardContent className="p-0 h-[calc(450px-130px)] sm:h-[calc(500px-142px)]">
          <ScrollArea 
            className="h-full py-3 sm:py-4 px-1" 
            ref={scrollAreaRef}
            viewportRef={viewportRef}
          >
            <div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-4">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex justify-start w-full">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mr-1.5 sm:mr-2 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <Bot size={14} className="sm:size-16" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-navy/50 p-2 sm:p-3 rounded-t-lg rounded-br-lg shadow-sm max-w-[75%]">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    {isModelLoading && (
                      <p className="text-[10px] text-gray-500 mt-1">Gemini 2.0 Flash is thinking...</p>
                    )}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>
        </CardContent>
            
        {messages.length === 1 && (
          <div className="px-3 sm:px-4 mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                  className="text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3 flex items-center border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    {question.icon}
                    {question.text}
                  </Button>
                ))}
              </div>
            </div>
        )}
            
        <CardFooter className="border-t p-2 sm:p-3 gap-1.5 sm:gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
            className="flex-1 bg-gray-100 dark:bg-navy/50 border-0 focus-visible:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
              />
              <Button 
                onClick={handleSendMessage} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center"
                disabled={!input.trim()}
              >
            <Send size={16} className="sm:size-18" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
  );
} 