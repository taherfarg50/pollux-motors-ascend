import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useUserFavorites, useToggleFavorite } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import LottieAnimation from '@/components/ui/LottieAnimation';
import favoriteAnimation from '@/assets/lottie/favorite-animation.json';

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
  const [animationDirection, setAnimationDirection] = useState<1 | -1>(1);
  const [animationSegment, setAnimationSegment] = useState<[number, number]>([0, 30]);
  
  // Set the animation state based on favorite status
  useEffect(() => {
    if (isFavorite) {
      setAnimationSegment([0, 30]);
      setAnimationDirection(1);
    } else {
      setAnimationSegment([30, 0]);
      setAnimationDirection(-1);
    }
  }, [isFavorite]);
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save cars to your favorites.",
      });
      navigate('/auth');
      return;
    }
    
    // Set animation segment and direction before API call for immediate feedback
    if (!isFavorite) {
      setAnimationSegment([0, 30]);
      setAnimationDirection(1);
    } else {
      setAnimationSegment([30, 0]);
      setAnimationDirection(-1);
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
      className="rounded-full relative transition-all"
      onClick={handleToggleFavorite}
      disabled={toggleFavoriteMutation.isPending}
      data-state={isFavorite ? "active" : "inactive"}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <LottieAnimation
          animationData={favoriteAnimation}
          loop={false}
          autoplay={false}
          width={36}
          height={36}
          initialSegment={animationSegment}
          direction={animationDirection}
        />
      </div>
      
      {/* Fallback icon for accessibility or if animation fails */}
      <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  );
};

export default FavoriteButton;
