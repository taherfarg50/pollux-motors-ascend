import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html, Box, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, PaintBucket, Info, Layers } from 'lucide-react';
import * as THREE from 'three';
import { Car3DModel } from '@/lib/supabase';
import { Group, Mesh, Object3D, Material, MeshStandardMaterial } from 'three';

// Define available colors for the vehicle
const COLORS = [
  { name: 'Obsidian Black', hex: '#0A0A0A', metalness: 0.7, roughness: 0.2 },
  { name: 'Lunar Silver', hex: '#D0D0D0', metalness: 0.8, roughness: 0.1 },
  { name: 'Sapphire Blue', hex: '#0A4D8C', metalness: 0.7, roughness: 0.15 },
  { name: 'Ruby Red', hex: '#7C0A0A', metalness: 0.6, roughness: 0.2 },
  { name: 'Emerald Green', hex: '#0A5C2F', metalness: 0.7, roughness: 0.15 },
];

// Error boundary for 3D model loading
const ModelErrorBoundary = ({ children, fallback }: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Could not load')) {
        console.error('3D model loading error:', event);
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  return hasError ? fallback : children;
};

// Fallback model when the actual model fails to load
const FallbackVehicleModel = ({ color }: { color: { hex: string; metalness: number; roughness: number } }) => {
  const group = useRef<Group>(null);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color.hex),
    metalness: color.metalness,
    roughness: color.roughness
  });
  
  // Gentle floating animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      group.current.rotation.y += 0.002;
    }
  });
  
  return (
    <group ref={group}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.8, 2]} />
      </mesh>
      
      {/* Car top */}
      <mesh position={[0, 1.0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.6, 1.8]} />
      </mesh>
      
      {/* Car hood */}
      <mesh position={[1.5, 0.5, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.3, 1.8]} />
      </mesh>
      
      {/* Car trunk */}
      <mesh position={[-1.5, 0.5, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.3, 1.8]} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1.5, -0.2, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.5, -0.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.5, -0.2, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.5, -0.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.55, 1.7]} />
        <meshPhysicalMaterial 
          color="#aacfff" 
          metalness={0.2} 
          roughness={0.1} 
          transmission={0.9} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[2.25, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#fff" emissive="#fffa80" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2.25, 0.5, -0.6]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#fff" emissive="#fffa80" emissiveIntensity={2} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-2.25, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#f00" emissive="#f00" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-2.25, 0.5, -0.6]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#f00" emissive="#f00" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

// Vehicle model component
const VehicleModel = ({ modelPath, color, showInterior, openDoors }: {
  modelPath: string;
  color: { hex: string; metalness: number; roughness: number };
  showInterior: boolean;
  openDoors: boolean;
}) => {
  const group = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Determine if we should actually use the model data
  const shouldLoadModel = useMemo(() => {
    return modelPath && 
           typeof modelPath === 'string' && 
           modelPath.trim() !== '' &&
           modelPath !== '/media/models/luxury_sedan.glb';
  }, [modelPath]);
  
  // Always call useGLTF with a valid path to avoid hook rule violations
  // Use a placeholder path when the actual model shouldn't be loaded
  const effectiveModelPath = shouldLoadModel ? modelPath : '/placeholder.glb';
  
  // Always call the hook - this is required by React Rules of Hooks
  const gltfData = useGLTF(effectiveModelPath);
  
  // Conditionally use the data based on our loading logic
  const modelData: { scene: Object3D | null; nodes: Record<string, Object3D> | null; materials: Record<string, Material> | null } = shouldLoadModel ? {
    scene: gltfData.scene,
    nodes: gltfData.nodes,
    materials: gltfData.materials
  } : { 
    scene: null, 
    nodes: null, 
    materials: null 
  };
  
  const { scene, nodes, materials } = modelData;
  
  // Check for model loading issues
  useEffect(() => {
    if (modelPath === '/media/models/luxury_sedan.glb') {
      console.warn('Using known problematic model path, triggering fallback');
      setModelError(true);
      return;
    }
    
    if (modelPath && modelPath.includes('supabase.co/storage')) {
      console.log('Loading model from Supabase storage:', modelPath);
    }
    
    // Check if the scene is valid after loading attempt
    if (!scene || !scene.children || scene.children.length === 0) {
      if (modelPath && shouldLoadModel) {
        console.error('Model loaded but scene is empty or invalid');
        setModelError(true);
      }
    } else {
      setModelLoaded(true);
      setModelError(false);
    }
  }, [modelPath, scene, shouldLoadModel]);
  
  // Apply color to the vehicle body material
  useEffect(() => {
    if (!modelError && materials) {
      // Try to find the car paint material by various possible names
      const carPaintMaterial = 
        materials.CarPaint || 
        materials.car_paint || 
        materials.Body || 
        materials.body ||
        Object.values(materials).find((m: Material) => 
          m.name && (m.name.toLowerCase().includes('paint') || 
                    m.name.toLowerCase().includes('body') || 
                    m.name.toLowerCase().includes('car'))
        ) as MeshStandardMaterial | undefined;
      
      if (carPaintMaterial && carPaintMaterial instanceof MeshStandardMaterial) {
        carPaintMaterial.color.set(color.hex);
        carPaintMaterial.metalness = color.metalness;
        carPaintMaterial.roughness = color.roughness;
      }
    }
  }, [color, materials, modelError]);
  
  // Handle door animations
  useEffect(() => {
    if (!modelError && nodes) {
      // This is a simplified example - actual implementation would depend on the 3D model structure
      const doorNames = ['door_left', 'door_right', 'door_fl', 'door_fr', 'door_rl', 'door_rr', 'hood', 'trunk'];
      const doors = doorNames
        .map(name => nodes[name] as Object3D)
        .filter(Boolean);
      
      doors.forEach(door => {
        if (door && openDoors) {
          // Animate door opening
          door.rotation.y = Math.PI / 4; // Example rotation
        } else if (door) {
          // Reset door position
          door.rotation.y = 0;
        }
      });
    }
  }, [openDoors, nodes, modelError]);
  
  // Handle interior/exterior view
  useEffect(() => {
    if (!modelError && nodes) {
      const exterior = nodes.exterior || nodes.Exterior;
      const interior = nodes.interior || nodes.Interior;
      
      if (exterior) exterior.visible = !showInterior;
      if (interior) interior.visible = showInterior;
    }
  }, [showInterior, nodes, modelError]);
  
  // Gentle floating animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });
  
  // If there was an error loading the model, return null to trigger the fallback
  if (modelError || !scene) {
    return null;
  }
  
  return (
    <group ref={group}>
      {scene && <primitive object={scene} dispose={null} />}
    </group>
  );
};

// Hotspot component for interactive points
const Hotspot = ({ position, children }: {
  position: [number, number, number];
  children: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <Html center>
        <div 
          className={`hotspot ${hovered ? 'hotspot-active' : ''}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="hotspot-dot"></div>
          {hovered && (
            <motion.div 
              className="hotspot-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Model selector component
const ModelSelector = ({ models, currentModel, onSelectModel }: {
  models: Car3DModel[];
  currentModel: Car3DModel | null;
  onSelectModel: (model: Car3DModel) => void;
}) => {
  if (!models || models.length <= 1) return null;
  
  return (
    <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md p-2 rounded-lg">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 bg-black/50 text-white hover:bg-white/20"
        onClick={() => onSelectModel(models[0])}
      >
        <Layers className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline-block">Change Model</span>
      </Button>
      
      <div className="mt-2 space-y-1">
        {models.map((model) => (
          <Button
            key={model.id}
            variant={currentModel?.id === model.id ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onSelectModel(model)}
          >
            {model.is_default ? "Default" : `Model ${model.id}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Main 3D car viewer component
const CarViewer3D = ({ 
  modelPath = '/media/models/luxury_sedan.glb',
  initialColor = COLORS[0],
  specifications = {
    engine: "4.0L V8 Twin-Turbo",
    power: "550 hp",
    torque: "700 Nm",
    acceleration: "3.8s (0-100 km/h)",
    topSpeed: "320 km/h"
  },
  models3D = [] // Array of available 3D models from Supabase
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [showInterior, setShowInterior] = useState(false);
  const [openDoors, setOpenDoors] = useState(false);
  const [viewMode, setViewMode] = useState('exterior');
  const [showSpecs, setShowSpecs] = useState(false);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Car3DModel | null>(null);
  
  // Select the default model or the first one available
  useEffect(() => {
    if (models3D && models3D.length > 0) {
      const defaultModel = models3D.find(model => model.is_default) || models3D[0];
      setSelectedModel(defaultModel);
    } else {
      // If no models from database, use the provided modelPath
      setSelectedModel({ 
        model_path: modelPath, 
        id: 0, 
        car_id: 0,
        format: 'glb',
        is_default: true,
        thumbnail_path: undefined
      } as Car3DModel);
    }
  }, [models3D, modelPath]);
  
  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Give the model 2 seconds to load before showing controls
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get the current model path to display
  const currentModelPath = selectedModel?.model_path || modelPath;
  
  return (
    <div className="w-full h-[600px] relative bg-gradient-to-b from-black to-gray-900 rounded-lg overflow-hidden">
      {/* Controls overlay - only show when not in error state */}
      {!modelLoadError && !isLoading && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
            <TabsList className="bg-black/50 backdrop-blur-md">
              <TabsTrigger value="exterior" onClick={() => setShowInterior(false)}>
                Exterior
              </TabsTrigger>
              <TabsTrigger value="interior" onClick={() => setShowInterior(true)}>
                Interior
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="bg-black/50 backdrop-blur-md hover:bg-white/20"
              onClick={() => setOpenDoors(!openDoors)}
            >
              {openDoors ? "Close Doors" : "Open Doors"}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-black/50 backdrop-blur-md hover:bg-white/20"
              onClick={() => setShowSpecs(!showSpecs)}
            >
              <Info className="mr-2 h-4 w-4" />
              {showSpecs ? "Hide Specs" : "Show Specs"}
            </Button>
          </div>
        </div>
      )}
      
      {/* Model selector - only show when multiple models are available */}
      {!modelLoadError && !isLoading && models3D && models3D.length > 0 && (
        <ModelSelector 
          models={models3D}
          currentModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      )}
      
      {/* Color selector - only show when not in error state */}
      {!modelLoadError && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/50 backdrop-blur-md p-4 rounded-lg">
          <p className="text-white mb-2 flex items-center">
            <PaintBucket className="mr-2 h-4 w-4" />
            Vehicle Color: {selectedColor.name}
          </p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full transition-all duration-300 ${selectedColor.name === color.name ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Specifications overlay */}
      {showSpecs && !modelLoadError && !isLoading && (
        <motion.div 
          className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-[300px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <h3 className="text-white font-bold mb-2">Vehicle Specifications</h3>
          <ul className="text-white/80 space-y-1">
            {Object.entries(specifications).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Model error notification */}
      {modelLoadError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md p-6 rounded-lg z-20 text-center max-w-[80%]">
          <h3 className="text-white text-xl font-bold mb-3">Using Simplified 3D Model</h3>
          <p className="text-gray-300 mb-4">
            We're displaying a simplified version of our vehicle model for demonstration purposes.
          </p>
          <p className="text-gray-400 text-sm">
            The detailed 3D model could not be loaded. You can still interact with the simplified model.
          </p>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={
          <Html center>
            <div className="text-white flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading 3D Model...</p>
            </div>
          </Html>
        }>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
          
          <ErrorBoundary fallback={
            <React.Fragment>
              <FallbackVehicleModel color={selectedColor} />
            </React.Fragment>
          }>
            <VehicleModel 
              modelPath={currentModelPath}
              color={selectedColor} 
              showInterior={showInterior}
              openDoors={openDoors}
            />
          </ErrorBoundary>
          
          {/* Interactive hotspots - only visible when specs are shown */}
          {showSpecs && !modelLoadError && (
            <>
              <Hotspot position={[1, 0.5, 2]}>
                <div className="p-2 bg-black/80 rounded text-white text-sm w-[150px]">
                  <h4 className="font-bold">LED Matrix Headlights</h4>
                  <p>Adaptive lighting with 84 individual LED elements</p>
                </div>
              </Hotspot>
              
              <Hotspot position={[-1, 0.8, -2]}>
                <div className="p-2 bg-black/80 rounded text-white text-sm w-[150px]">
                  <h4 className="font-bold">Carbon Fiber Spoiler</h4>
                  <p>Active aerodynamics for optimal downforce</p>
                </div>
              </Hotspot>
            </>
          )}
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Custom ErrorBoundary component for React Three Fiber
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to the console
    console.error("3D Model Error:", error);
    console.error("Error Info:", errorInfo);
    
    // Check if the error is related to HTML content in JSON
    const errorMessage = error?.message || '';
    const isHtmlError = errorMessage.includes('<!DOCTYPE') || 
                        errorMessage.includes('Unexpected token') ||
                        errorMessage.includes('is not valid JSON');
    
    if (isHtmlError) {
      console.warn("Detected HTML in response when expecting GLB file. This usually means the file doesn't exist or the server returned an error page.");
    }
    
    // Store error info for potential display
    this.setState({ errorInfo: errorInfo });
    
    // You could also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default CarViewer3D; 