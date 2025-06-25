import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SideFloatingButtonsProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

const SideFloatingButtons = ({
  whatsappNumber = "97150386702",
  whatsappMessage = "Hello, I'm interested in Pollux Motors services. Can you help me?"
}: SideFloatingButtonsProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <Button 
        onClick={handleWhatsApp}
        className="w-12 h-12 rounded-full p-0 bg-[#25D366] hover:bg-[#1da851] shadow-lg"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </Button>
      
      {/* Chat Button */}
      <Button 
        onClick={toggleChat}
        className="w-12 h-12 rounded-full p-0 bg-pollux-red hover:bg-red-700 shadow-lg"
        aria-label="Open chat"
      >
        <MessageSquare size={20} />
      </Button>
      
      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-lg w-80 z-40 border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Chat with us</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X size={18} />
            </Button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How can we help you today? Our team is ready to assist you with any questions about our vehicles.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none text-sm max-w-[80%]">
                Welcome to Pollux Motors! How can I assist you today?
              </div>
              <div className="flex justify-end">
                <div className="bg-pollux-red text-white p-3 rounded-lg rounded-br-none text-sm max-w-[80%]">
                  I'm interested in scheduling a test drive.
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none text-sm max-w-[80%]">
                Great choice! I'd be happy to help you schedule a test drive. Which vehicle are you interested in?
              </div>
            </div>
            <div className="mt-4 flex">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l-md px-3 py-2 text-sm bg-transparent"
              />
              <Button className="rounded-l-none bg-pollux-red hover:bg-red-700">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideFloatingButtons; 