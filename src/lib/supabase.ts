import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Updated Types for car data
export interface CarSpecs {
  speed: string;
  acceleration: string;
  power: string;
  range: string;
  topSpeed?: string;
  batteryCapacity?: string;
  driveTrain?: string;
  chargingTime?: string;
}

export interface Car {
  id: number;
  name: string;
  model?: string;
  category: string;
  year: string;
  price: string;
  image: string;
  specs: CarSpecs;
  description?: string;
  featured?: boolean;
  color?: string;
  gallery?: string[]; // Multiple images for car detail view
  options?: {
    interior?: string[];
    wheels?: string[];
    technology?: string[];
  };
  performance?: {
    maxPower?: string;
    torque?: string;
    driveMode?: string;
  };
}

// Fetch all cars with optimized query 
export const fetchCars = async (): Promise<Car[]> => {
  console.time('fetchCars'); // Performance measurement
  
  // Optimized query using a single request with array relationships
  const { data, error } = await supabase
    .from('cars')
    .select(`
      id, name, model, category, year, price, image, description, featured, color,
      car_specs (speed, acceleration, power, range, topSpeed, batteryCapacity, driveTrain, chargingTime)
    `);
  
  if (error) {
    console.error("Error fetching cars:", error);
    throw new Error(error.message);
  }
  
  const cars = data.map(car => {
    const carSpecs = car.car_specs && car.car_specs[0] ? car.car_specs[0] : null;
    
    return {
      ...car,
      specs: carSpecs ? {
        speed: carSpecs.speed || "N/A",
        acceleration: carSpecs.acceleration || "N/A",
        power: carSpecs.power || "N/A",
        range: carSpecs.range || "N/A",
        topSpeed: carSpecs.topSpeed,
        batteryCapacity: carSpecs.batteryCapacity,
        driveTrain: carSpecs.driveTrain,
        chargingTime: carSpecs.chargingTime
      } : {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    };
  });
  
  console.timeEnd('fetchCars'); // Performance measurement
  return cars;
};

// Fetch a single car by ID with optimized query
export const fetchCarById = async (id: number): Promise<Car> => {
  console.time(`fetchCarById:${id}`); // Performance measurement
  
  // Fixed the ambiguous car_id issue by using aliases in the query
  // Using a single query with join instead of RPC
  const { data, error } = await supabase
    .from('cars')
    .select(`
      id, name, model, category, year, price, image, description, featured, color,
      specs:car_specs(speed, acceleration, power, range, topSpeed, batteryCapacity, driveTrain, chargingTime)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error(`Car with ID ${id} not found`);
  }
  
  // Extract specs from the nested object
  const specsData = data.specs && data.specs[0] ? data.specs[0] : null;
  
  const result: Car = {
    ...data,
    specs: {
      speed: specsData?.speed || "N/A",
      acceleration: specsData?.acceleration || "N/A",
      power: specsData?.power || "N/A",
      range: specsData?.range || "N/A",
      topSpeed: specsData?.topSpeed,
      batteryCapacity: specsData?.batteryCapacity,
      driveTrain: specsData?.driveTrain,
      chargingTime: specsData?.chargingTime
    }
  };
  
  console.timeEnd(`fetchCarById:${id}`); // Performance measurement
  return result;
};

// Fetch featured cars with optimized query
export const fetchFeaturedCars = async (): Promise<Car[]> => {
  console.time('fetchFeaturedCars'); // Performance measurement
  
  // Optimized query using a single request with array relationships
  const { data, error } = await supabase
    .from('cars')
    .select(`
      id, name, model, category, year, price, image, description, featured, color,
      car_specs (speed, acceleration, power, range, topSpeed, batteryCapacity, driveTrain, chargingTime)
    `)
    .eq('featured', true);
  
  if (error) {
    console.error("Error fetching featured cars:", error);
    throw new Error(error.message);
  }
  
  const cars = data.map(car => {
    const carSpecs = car.car_specs && car.car_specs[0] ? car.car_specs[0] : null;
    
    return {
      ...car,
      specs: carSpecs ? {
        speed: carSpecs.speed || "N/A",
        acceleration: carSpecs.acceleration || "N/A",
        power: carSpecs.power || "N/A",
        range: carSpecs.range || "N/A",
        topSpeed: carSpecs.topSpeed,
        batteryCapacity: carSpecs.batteryCapacity,
        driveTrain: carSpecs.driveTrain,
        chargingTime: carSpecs.chargingTime
      } : {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    };
  });
  
  console.timeEnd('fetchFeaturedCars'); // Performance measurement
  return cars;
};

// User favorites functions
export const fetchUserFavorites = async (userId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('car_id')
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching user favorites:", error);
    throw new Error(error.message);
  }
  
  return data.map(item => item.car_id);
};

export const toggleFavorite = async (userId: string, carId: number, isFavorite: boolean) => {
  if (isFavorite) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .match({ user_id: userId, car_id: carId });
    
    if (error) {
      console.error("Error removing favorite:", error);
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, car_id: carId });
    
    if (error) {
      console.error("Error adding favorite:", error);
      throw new Error(error.message);
    }
  }
};

// React Query hooks
export const useCars = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  });
};

export const useFeaturedCars = () => {
  return useQuery({
    queryKey: ['featuredCars'],
    queryFn: fetchFeaturedCars,
  });
};

export const useCar = (id: number) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useUserFavorites = (userId?: string) => {
  return useQuery({
    queryKey: ['userFavorites', userId],
    queryFn: () => fetchUserFavorites(userId as string),
    enabled: !!userId, // Only run the query if userId is provided
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, carId, isFavorite }: 
      { userId: string; carId: number; isFavorite: boolean }) => 
      toggleFavorite(userId, carId, isFavorite),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites', userId] });
    }
  });
};
