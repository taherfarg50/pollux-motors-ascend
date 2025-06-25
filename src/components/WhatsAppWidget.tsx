import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// WhatsApp icon component
const WhatsAppIcon = ({ className = "h-4 w-4 sm:h-5 sm:w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type WhatsAppWidgetProps = {
  position?: 'bottom' | 'top' | 'inline';
};

export default function WhatsAppWidget({ position = 'bottom' }: WhatsAppWidgetProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Function to construct WhatsApp URL
  const constructWhatsAppUrl = (message: string) => {
    const phoneNumber = "971503866702"; // Updated to use business phone
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const handleWhatsAppClick = (customMessage = "Hello! I'm interested in purchasing a car from Pollux Motors.") => {
    const url = constructWhatsAppUrl(customMessage);
    window.open(url, "_blank");
  };

  const commonMessages = [
    "I'd like to inquire about vehicle availability.",
    "I'm interested in financing options.",
    "What documents do I need for purchasing a car?",
    "Do you have any special offers currently?"
  ];

  // Get position styles based on prop
  const getPositionStyles = () => {
    if (position === 'top') {
      return "bottom-full mb-2";
    } else if (position === 'inline') {
      return "bottom-0 right-full mr-2";
    } else {
      return "bottom-16 sm:bottom-20";
    }
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className={`fixed ${getPositionStyles()} right-3 sm:right-6 w-[calc(100%-2rem)] sm:w-80 bg-white dark:bg-navy rounded-xl shadow-2xl z-50 overflow-hidden`}
            initial={{ opacity: 0, y: position === 'top' ? 20 : -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 20 : -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-green-500 p-3 sm:p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm sm:text-base">Pollux Motors</h3>
                  <p className="text-white/80 text-[10px] sm:text-xs">Typically replies within 10 minutes</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                How can we help you today? Choose an option below or send us a custom message on WhatsApp.
              </p>
              
              <div className="space-y-1.5 sm:space-y-2">
                {commonMessages.map((message, index) => (
                  <motion.button
                    key={index}
                    className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 dark:bg-navy/60 dark:hover:bg-navy/90 rounded-lg transition-colors"
                    onClick={() => handleWhatsAppClick(message)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {message}
                  </motion.button>
                ))}
              </div>
              
              <Button 
                className="w-full mt-3 sm:mt-4 bg-green-500 hover:bg-green-600 text-white h-8 sm:h-10 text-xs sm:text-sm"
                onClick={() => handleWhatsAppClick()}
              >
                <WhatsAppIcon className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start Chat
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TooltipProvider>
        <Tooltip open={isTooltipOpen && !isExpanded} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="sr-only">Contact on WhatsApp</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white text-xs sm:text-sm">
            <p>Chat with us on WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
} 