import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Car, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Ship,
  DollarSign,
  Info,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'contact';
}

// Simple predefined responses for common queries
const commonResponses = {
  greeting: [
    "Hello! Welcome to Pollux Motors. How can I help you today?",
    "Hi there! I'm here to help you with vehicles, export services, and general inquiries.",
    "Welcome! Feel free to ask about our cars, export services, or contact information."
  ],
  vehicles: [
    "We have a wide selection of quality vehicles. You can browse our available cars on the 'Available Cars' page or tell me what type of vehicle you're looking for.",
    "Our inventory includes luxury sedans, SUVs, sports cars, and family vehicles. What kind of car interests you?",
    "I'd be happy to help you find the perfect vehicle. What's your budget range and preferred vehicle type?"
  ],
  export: [
    "We offer professional vehicle export services to Egypt, Algeria, Morocco, Tunisia, and worldwide. We handle all documentation, shipping, and customs clearance.",
    "Our export process is simple: vehicle selection, documentation, preparation, shipping, and delivery. The entire process typically takes 8-21 days depending on destination.",
    "For export services, we provide complete support including shipping arrangements, export documentation, and customs handling. Would you like more details about exporting to a specific country?"
  ],
  financing: [
    "We offer various financing options including traditional loans, leasing, and export financing for international buyers. Contact our finance team for personalized quotes.",
    "Our financing solutions include competitive rates, flexible terms, and quick approval. We work with multiple lenders to find the best option for you.",
    "For financing information, I recommend speaking with our finance specialists who can provide detailed options based on your situation."
  ],
  contact: [
    "You can reach us at:\n📞 Phone: +971502667937\n✉️ Email: info@polluxmotors.com\n🕒 Hours: Mon-Fri 8AM-6PM\n📍 Or visit our Contact page for more details.",
    "Our team is available Monday through Friday, 8AM to 6PM. You can call us, send an email, or use WhatsApp for quick responses.",
    "For immediate assistance, try our WhatsApp chat or call our main number. For export inquiries, email export@polluxmotors.com"
  ],
  default: [
    "I'm here to help with questions about our vehicles, export services, financing, or contact information. What would you like to know?",
    "I can assist you with information about our cars, export services, or how to get in touch with our team. How can I help?",
    "Feel free to ask about our vehicle inventory, export process, financing options, or contact details. What interests you?"
  ]
};

// Quick suggestions for common inquiries
const quickSuggestions = [
  { text: "Show me available cars", category: "vehicles", icon: <Car className="w-4 h-4" /> },
  { text: "Export services to Egypt", category: "export", icon: <Ship className="w-4 h-4" /> },
  { text: "Financing options", category: "financing", icon: <DollarSign className="w-4 h-4" /> },
  { text: "Contact information", category: "contact", icon: <Phone className="w-4 h-4" /> },
  { text: "Export process steps", category: "export", icon: <Info className="w-4 h-4" /> },
  { text: "Business hours", category: "contact", icon: <Clock className="w-4 h-4" /> }
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Pollux Motors. I'm here to help you with information about our vehicles, export services, financing options, and contact details. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simple keyword matching for responses
  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greeting patterns
    if (input.match(/hello|hi|hey|good\s?(morning|afternoon|evening)/)) {
      return getRandomResponse(commonResponses.greeting);
    }
    
    // Vehicle-related queries
    if (input.match(/car|vehicle|auto|sedan|suv|truck|inventory|browse|available/)) {
      return getRandomResponse(commonResponses.vehicles);
    }
    
    // Export-related queries
    if (input.match(/export|ship|international|egypt|algeria|morocco|tunisia|overseas|abroad/)) {
      return getRandomResponse(commonResponses.export);
    }
    
    // Financing queries
    if (input.match(/finance|loan|payment|credit|lease|buy|purchase|price|cost/)) {
      return getRandomResponse(commonResponses.financing);
    }
    
    // Contact queries
    if (input.match(/contact|phone|email|address|hours|location|reach|call/)) {
      return getRandomResponse(commonResponses.contact);
    }
    
    // Default response
    return getRandomResponse(commonResponses.default);
  };

  const getRandomResponse = (responses: string[]): string => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse = getResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        type: "text"
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Chat with Pollux Motors
            </h1>
            <p className="text-gray-400 text-lg">
              Get instant help with vehicles, export services, and more
            </p>
          </div>

          {/* Chat Container */}
          <Card className="bg-black/40 border-gray-700 h-[600px] flex flex-col">
            {/* Messages Area */}
            <CardContent className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-pollux-blue text-white' 
                        : 'bg-gray-700 text-gray-100'
                    } rounded-lg p-4 shadow-lg`}>
                      <div className="flex items-start gap-3">
                        {message.sender === 'bot' && (
                          <div className="w-8 h-8 bg-pollux-blue rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap">{message.text}</div>
                          <div className="text-xs opacity-60 mt-2">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-pollux-blue rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="px-6 py-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-3">Quick questions:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto py-2 px-3 border-gray-600 hover:border-pollux-blue"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      <div className="flex items-center gap-2">
                        {suggestion.icon}
                        <span className="text-xs">{suggestion.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="bg-pollux-blue hover:bg-pollux-blue-dark self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-gray-700 text-center">
              <CardContent className="p-4">
                <Phone className="w-8 h-8 text-pollux-blue mx-auto mb-2" />
                <p className="text-white font-medium">Call Us</p>
                <p className="text-gray-400 text-sm">+971502667937</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-700 text-center">
              <CardContent className="p-4">
                <Mail className="w-8 h-8 text-pollux-blue mx-auto mb-2" />
                <p className="text-white font-medium">Email Us</p>
                <p className="text-gray-400 text-sm">info@polluxmotors.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-700 text-center">
              <CardContent className="p-4">
                <Clock className="w-8 h-8 text-pollux-blue mx-auto mb-2" />
                <p className="text-white font-medium">Business Hours</p>
                <p className="text-gray-400 text-sm">Mon-Fri 8AM-6PM</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage; 