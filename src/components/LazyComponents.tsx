import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Component Loading Spinner
export const ComponentLoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Car Grid Loading Skeleton
export const CarGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

// Lazy load heavy 3D components
export const LazyCarViewer3D = lazy(() => import('@/components/CarViewer3D'));
export const LazyVehicleConfigurator = lazy(() => import('@/components/VehicleConfigurator'));

// Lazy load animation-heavy components  
export const LazySmartFinancing = lazy(() => import('@/components/SmartFinancing'));
export const LazyFeaturedCars = lazy(() => import('@/components/FeaturedCars'));
export const LazyVehicleComparisonTool = lazy(() => import('@/components/VehicleComparisonTool'));

// Lazy load pages
export const LazySmartFinancingPage = lazy(() => import('@/pages/SmartFinancingPage'));
export const LazyChatPage = lazy(() => import('@/pages/ChatPage'));

// Component prop interfaces
interface CarViewer3DProps {
  modelPath?: string;
  initialColor?: { name: string; hex: string; metalness: number; roughness: number };
  specifications?: {
    engine: string;
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: string;
  };
  models3D?: Array<{
    id: number;
    name: string;
    modelPath: string;
    previewImage: string;
  }>;
}

interface VehicleConfiguratorProps {
  carId?: number;
  onConfigurationChange?: (config: {
    carId: number;
    color: string;
    wheels: string;
    interior: string;
    performance: string;
    features: string[];
    estimatedPrice: number;
  }) => void;
}

interface SmartFinancingProps {
  carPrice: number;
  carName: string;
}

// FeaturedCars and VehicleComparisonTool don't take props
type FeaturedCarsProps = Record<string, never>;
type VehicleComparisonToolProps = Record<string, never>;
type SmartFinancingPageProps = Record<string, never>;
type ChatPageProps = Record<string, never>;

// Wrapped components with Suspense
export const CarViewer3D = (props: CarViewer3DProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazyCarViewer3D {...props} />
  </Suspense>
);

export const VehicleConfigurator = (props: VehicleConfiguratorProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazyVehicleConfigurator {...props} />
  </Suspense>
);

export const SmartFinancing = (props: SmartFinancingProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazySmartFinancing {...props} />
  </Suspense>
);

export const FeaturedCars = (props: FeaturedCarsProps) => (
  <Suspense fallback={<CarGridSkeleton />}>
    <LazyFeaturedCars {...props} />
  </Suspense>
);

export const VehicleComparisonTool = (props: VehicleComparisonToolProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazyVehicleComparisonTool {...props} />
  </Suspense>
);

export const SmartFinancingPage = (props: SmartFinancingPageProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazySmartFinancingPage {...props} />
  </Suspense>
);

export const ChatPage = (props: ChatPageProps) => (
  <Suspense fallback={<ComponentLoadingSpinner />}>
    <LazyChatPage {...props} />
  </Suspense>
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Use requestIdleCallback to preload during browser idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('@/components/FeaturedCars');
      import('@/components/SmartFinancing');
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      import('@/components/FeaturedCars');
      import('@/components/SmartFinancing');
    }, 2000);
  }
}; 