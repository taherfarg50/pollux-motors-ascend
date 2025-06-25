import { motion } from 'framer-motion';
import { X, Twitter, Facebook, Linkedin, Link2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareModalProps {
  postId: number;
  onClose: () => void;
}

const ShareModal = ({ postId, onClose }: ShareModalProps) => {
  // Mock URL for the blog post
  const postUrl = `https://polluxmotors.com/blog/${postId}`;
  
  const shareOptions = [
    { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2] hover:bg-[#1a94e1]', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2] hover:bg-[#166fe0]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0A66C2] hover:bg-[#095baf]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90', url: `https://www.instagram.com/` },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-lg p-6 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Share this article</h3>
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${option.color} text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-transform hover:scale-105`}
            >
              <option.icon className="h-5 w-5" />
              <span>{option.name}</span>
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-lg px-4 py-2 truncate">
            {postUrl}
          </div>
          <Button
            className="bg-pollux-red hover:bg-red-700 text-white"
            onClick={copyToClipboard}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal; 