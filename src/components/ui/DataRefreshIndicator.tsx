import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DataRefreshIndicatorProps {
  isRefetching: boolean;
  refetch: () => void;
  label?: string;
}

export function DataRefreshIndicator({ 
  isRefetching, 
  refetch, 
  label = "Data" 
}: DataRefreshIndicatorProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState<string>("");
  
  // Update the last updated time when the component mounts or refetching completes
  useEffect(() => {
    if (!isRefetching) {
      setLastUpdated(new Date());
    }
  }, [isRefetching]);
  
  // Update the time ago text every minute
  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      
      if (diffSec < 60) {
        setTimeAgo("just now");
      } else if (diffMin < 60) {
        setTimeAgo(`${diffMin} minute${diffMin > 1 ? 's' : ''} ago`);
      } else {
        setTimeAgo(`${diffHour} hour${diffHour > 1 ? 's' : ''} ago`);
      }
    };
    
    calculateTimeAgo();
    const interval = setInterval(calculateTimeAgo, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [lastUpdated]);
  
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
      <span>
        {label} updated {timeAgo}
      </span>
      <motion.button
        onClick={() => refetch()}
        disabled={isRefetching}
        className="p-1.5 rounded-full bg-pollux-blue/10 text-pollux-blue hover:bg-pollux-blue/20 transition-colors"
        title={`Refresh ${label.toLowerCase()}`}
        whileHover={{ rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={isRefetching ? "animate-spin" : ""}
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M8 16H3v5"></path>
        </svg>
      </motion.button>
    </div>
  );
} 