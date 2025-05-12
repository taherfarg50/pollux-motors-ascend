
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useUserFavorites, useToggleFavorite } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  carId: number;
}

const FavoriteButton = ({ carId }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: favorites = [] } = useUserFavorites(user?.id);
  const toggleFavoriteMutation = useToggleFavorite();
  
  const isFavorite = favorites.includes(carId);
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save cars to your favorites.",
      });
      navigate('/auth');
      return;
    }
    
    toggleFavoriteMutation.mutate({
      userId: user.id,
      carId,
      isFavorite
    }, {
      onSuccess: () => {
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: isFavorite 
            ? "The car has been removed from your favorites." 
            : "The car has been added to your favorites.",
        });
      }
    });
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${isFavorite ? 'text-pollux-red' : 'text-gray-400'} hover:text-pollux-red transition-colors`}
      onClick={handleToggleFavorite}
      disabled={toggleFavoriteMutation.isPending}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pollux-red' : ''}`} />
    </Button>
  );
};

export default FavoriteButton;
