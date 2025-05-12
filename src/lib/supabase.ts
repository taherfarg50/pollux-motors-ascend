
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for car data
export interface CarSpecs {
  speed: string;
  acceleration: string;
  power: string;
  range: string;
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
}

// Fetch all cars from Supabase
export const fetchCars = async (): Promise<Car[]> => {
  const { data: cars, error: carsError } = await supabase
    .from('cars')
    .select('id, name, model, category, year, price, image, description, featured, color');
  
  if (carsError) {
    console.error("Error fetching cars:", carsError);
    throw new Error(carsError.message);
  }
  
  const { data: specs, error: specsError } = await supabase
    .from('car_specs')
    .select('car_id, speed, acceleration, power, range');
  
  if (specsError) {
    console.error("Error fetching car specs:", specsError);
    throw new Error(specsError.message);
  }
  
  // Map the specs to their respective cars
  return cars.map(car => {
    const carSpecs = specs.find(spec => spec.car_id === car.id);
    return {
      ...car,
      specs: carSpecs ? {
        speed: carSpecs.speed,
        acceleration: carSpecs.acceleration,
        power: carSpecs.power,
        range: carSpecs.range
      } : {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    };
  });
};

// Fetch a single car by ID
export const fetchCarById = async (id: number): Promise<Car> => {
  // Using our custom database function to get car with specs in one query
  const { data, error } = await supabase
    .rpc('get_car_with_specs', { car_id: id });
  
  if (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!data || data.length === 0) {
    throw new Error(`Car with ID ${id} not found`);
  }
  
  const carData = data[0];
  
  // Properly type the specs object to match our CarSpecs interface
  const specs: CarSpecs = {
    speed: carData.specs.speed || "N/A",
    acceleration: carData.specs.acceleration || "N/A",
    power: carData.specs.power || "N/A",
    range: carData.specs.range || "N/A"
  };
  
  return {
    ...carData,
    specs
  };
};

// Fetch featured cars
export const fetchFeaturedCars = async (): Promise<Car[]> => {
  const { data: cars, error: carsError } = await supabase
    .from('cars')
    .select('id, name, model, category, year, price, image, description, featured, color')
    .eq('featured', true);
  
  if (carsError) {
    console.error("Error fetching featured cars:", carsError);
    throw new Error(carsError.message);
  }
  
  const { data: specs, error: specsError } = await supabase
    .from('car_specs')
    .select('car_id, speed, acceleration, power, range');
  
  if (specsError) {
    console.error("Error fetching car specs:", specsError);
    throw new Error(specsError.message);
  }
  
  return cars.map(car => {
    const carSpecs = specs.find(spec => spec.car_id === car.id);
    return {
      ...car,
      specs: carSpecs ? {
        speed: carSpecs.speed,
        acceleration: carSpecs.acceleration,
        power: carSpecs.power,
        range: carSpecs.range
      } : {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    };
  });
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
