import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car as CarIcon, Gauge, Clock3, Zap, Route } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCar } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/animation';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCounter from '@/components/StatsCounter';
import { Separator } from '@/components/ui/separator';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
} 