import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { log } from "@/utils/logger";

// Types for car data
export interface CarSpecs {
  speed: string;
  acceleration: string;
  power: string;
  range: string;
}

export interface Car3DModel {
  id: number;
  car_id: number;
  model_path: string;
  thumbnail_path?: string;
  format: string;
  is_default: boolean;
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
  gallery?: string[];
  models_3d?: Car3DModel[];
}

// Filter parameters for cars
export interface CarFilters {
  category?: string;
  year?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

// FIXED: Fetch cars with pagination and separate optimized queries
export const fetchCars = async (options: {
  limit?: number;
  offset?: number;
  category?: string;
  searchQuery?: string;
} = {}): Promise<{ cars: Car[], total: number }> => {
  try {
    const { limit = 12, offset = 0, category, searchQuery } = options;
    log.debug('Fetching cars with options', options, 'fetchCars');
    
    // Build query with filters applied at database level
    let query = supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, description, featured, color', { count: 'exact' });
    
    // Apply filters at database level for better performance
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data: carsData, error: carsError, count } = await query;
    
    if (carsError) {
      const userMessage = handleSupabaseError(carsError, 'fetchCars', 'fetchCars');
      log.error("Error fetching cars", carsError, 'fetchCars');
      throw new Error(userMessage);
    }

    if (!carsData || carsData.length === 0) {
      log.info('No cars found', { options }, 'fetchCars');
      return { cars: [], total: count || 0 };
    }

    // Get car IDs for specs lookup
    const carIds = carsData.map(car => car.id);
    
    // Fetch specs for these specific cars
    const { data: specsData } = await supabase
      .from('car_specs')
      .select('car_id, speed, acceleration, power, range')
      .in('car_id', carIds);

    // Transform the data efficiently
    const cars: Car[] = carsData.map(car => {
      const specs = specsData?.find(spec => spec.car_id === car.id);
      return {
        id: car.id,
        name: car.name,
        model: car.model,
        category: car.category,
        year: car.year,
        price: car.price,
        image: car.image,
        description: car.description,
        featured: car.featured,
        color: car.color,
        specs: specs ? {
          speed: specs.speed || "N/A",
          acceleration: specs.acceleration || "N/A",
          power: specs.power || "N/A",
          range: specs.range || "N/A"
        } : {
          speed: "N/A",
          acceleration: "N/A",
          power: "N/A",
          range: "N/A"
        }
      };
    });
    
    log.info('Successfully fetched cars', { count: cars.length, total: count }, 'fetchCars');
    return { cars, total: count || 0 };
  } catch (error) {
    log.error('Failed to fetch cars', error, 'fetchCars');
    throw error;
  }
};

// DEPRECATED - Use fetchCars with options instead
export const fetchFilteredCars = async (filters: CarFilters = {}): Promise<Car[]> => {
  log.warn('fetchFilteredCars is deprecated, use fetchCars with options instead', filters, 'fetchFilteredCars');
  const { cars } = await fetchCars({
    limit: filters.limit || 12,
    offset: filters.offset || 0,
    category: filters.category,
    searchQuery: filters.searchQuery
  });
  return cars;
};

// Fetch a single car by ID
export const fetchCarById = async (id: number): Promise<{car: Car, relatedCars?: Car[]}> => {
  try {
    log.debug('Fetching car by ID', { id }, 'fetchCarById');
    
         // Get the specific car
     const { data: carData, error: carError } = await supabase
       .from('cars')
       .select('id, name, model, category, year, price, image, description, featured, color')
       .eq('id', id)
       .single();
    
    if (carError) {
      const userMessage = handleSupabaseError(carError, 'fetchCarById', 'fetchCarById');
      log.error(`Error fetching car with ID ${id}`, carError, 'fetchCarById');
      throw new Error(userMessage);
    }
    
    if (!carData) {
      throw new Error(`Car with ID ${id} not found`);
    }
    
    // Get car specs
    const { data: carSpecs, error: specsError } = await supabase
      .from('car_specs')
      .select('speed, acceleration, power, range')
      .eq('car_id', id)
      .single();
    
    if (specsError) {
      log.warn(`No specs found for car ID ${id}`, specsError, 'fetchCarById');
    }
    
    // Get related cars (same category, excluding current car)
    const { data: relatedCarsData, error: relatedError } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, description, featured, color')
      .eq('category', carData.category)
      .neq('id', id)
      .limit(3);
    
    if (relatedError) {
      log.warn(`Error fetching related cars for car ID ${id}`, relatedError, 'fetchCarById');
    }
    
    // Build the car object
    const car: Car = {
      ...carData,
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
    
    // Build related cars with default specs
    const relatedCars: Car[] = (relatedCarsData || []).map(relatedCar => ({
      ...relatedCar,
      specs: {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    }));
    
    log.info('Successfully fetched car by ID', { id, relatedCount: relatedCars.length }, 'fetchCarById');
    return { car, relatedCars };
  } catch (error) {
    log.error('Failed to fetch car by ID', error, 'fetchCarById');
    throw error;
  }
};

// FIXED: Fast featured cars with separate optimized queries
export const fetchFeaturedCars = async (limit: number = 6): Promise<Car[]> => {
  try {
    log.debug('Fetching featured cars', { limit }, 'fetchFeaturedCars');
    
    // First, get featured cars
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, description, featured, color')
      .eq('featured', true)
      .limit(limit);
    
    if (carsError) {
      const userMessage = handleSupabaseError(carsError, 'fetchFeaturedCars', 'fetchFeaturedCars');
      log.error("Error fetching featured cars", carsError, 'fetchFeaturedCars');
      throw new Error(userMessage);
    }
    
    if (!carsData || carsData.length === 0) {
      log.info('No featured cars found', undefined, 'fetchFeaturedCars');
      return [];
    }

    // Get car IDs for specs lookup
    const carIds = carsData.map(car => car.id);
    
    // Fetch specs for these specific cars
    const { data: specsData } = await supabase
      .from('car_specs')
      .select('car_id, speed, acceleration, power, range')
      .in('car_id', carIds);
    
    // Transform data efficiently
    const cars: Car[] = carsData.map(car => {
      const specs = specsData?.find(spec => spec.car_id === car.id);
      return {
        id: car.id,
        name: car.name,
        model: car.model,
        category: car.category,
        year: car.year,
        price: car.price,
        image: car.image,
        description: car.description,
        featured: car.featured,
        color: car.color,
        specs: specs ? {
          speed: specs.speed || "N/A",
          acceleration: specs.acceleration || "N/A",
          power: specs.power || "N/A",
          range: specs.range || "N/A"
        } : {
          speed: "N/A",
          acceleration: "N/A",
          power: "N/A",
          range: "N/A"
        }
      };
    });
    
    log.info('Successfully fetched featured cars', { count: cars.length }, 'fetchFeaturedCars');
    return cars;
  } catch (error) {
    log.error('Failed to fetch featured cars', error, 'fetchFeaturedCars');
    throw error;
  }
};

// User favorites functions
export const fetchUserFavorites = async (userId: string): Promise<Car[]> => {
  try {
    // Get user's favorite car IDs
    const { data: favorites, error: favError } = await supabase
      .from('user_favorites')
      .select('car_id')
      .eq('user_id', userId);
    
    if (favError) {
      log.error("Error fetching user favorites", favError, 'fetchUserFavorites');
      throw new Error(favError.message);
    }
    
    if (!favorites || favorites.length === 0) {
      return [];
    }
    
    const carIds = favorites.map(fav => fav.car_id);
    
    // Get car details for these IDs
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, description, featured, color')
      .in('id', carIds);
    
    if (carsError) {
      log.error("Error fetching favorite cars details", carsError, 'fetchUserFavorites');
      throw new Error(carsError.message);
    }
    
    // Return cars with default specs
    return (cars || []).map(car => ({
      ...car,
      specs: {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    }));
  } catch (error) {
    log.error('Failed to fetch user favorites', error, 'fetchUserFavorites');
    throw error;
  }
};

export const toggleFavorite = async (userId: string, carId: number, isFavorite: boolean) => {
  if (isFavorite) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .match({ user_id: userId, car_id: carId });
    
    if (error) {
      log.error("Error removing favorite", error, 'toggleFavorite');
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, car_id: carId });
    
    if (error) {
      log.error("Error adding favorite", error, 'toggleFavorite');
      throw new Error(error.message);
    }
  }
};

// Fetch similar cars by category, excluding the current car
export const fetchSimilarCars = async (categoryName: string, currentCarId: number, limit: number = 3): Promise<Car[]> => {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, description, featured, color')
      .eq('category', categoryName)
      .neq('id', currentCarId)
      .limit(limit);
    
    if (error) {
      log.error("Error fetching similar cars", error, 'fetchSimilarCars');
      throw new Error(error.message);
    }
    
    // Return cars with default specs (optimize later if needed)
    return (cars || []).map(car => ({
      ...car,
      specs: {
        speed: "N/A",
        acceleration: "N/A", 
        power: "N/A",
        range: "N/A"
      }
    }));
  } catch (error) {
    log.error('Failed to fetch similar cars', error, 'fetchSimilarCars');
    throw error;
  }
};

// OPTIMIZED React Query hooks with better caching and pagination support
export const useCars = (options: {
  limit?: number;
  offset?: number;
  category?: string;
  searchQuery?: string;
} = {}) => {
  return useQuery({
    queryKey: ['cars', options],
    queryFn: () => fetchCars(options),
    staleTime: 2 * 60 * 1000, // 2 minutes - faster updates
    gcTime: 10 * 60 * 1000, // 10 minutes - more aggressive cleanup
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
};

// Legacy hook for backward compatibility - will return just the cars array
export const useCarsLegacy = (filters: CarFilters = {}) => {
  return useQuery({
    queryKey: ['carsLegacy', filters],
    queryFn: () => fetchFilteredCars(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useFeaturedCars = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featuredCars', limit],
    queryFn: () => fetchFeaturedCars(limit),
    staleTime: 5 * 60 * 1000, // Featured cars change less frequently
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCar = (id: number) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useUserFavorites = (userId?: string) => {
  return useQuery({
    queryKey: ['userFavorites', userId],
    queryFn: () => fetchUserFavorites(userId as string),
    enabled: !!userId,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, carId, isFavorite }: { userId: string, carId: number, isFavorite: boolean }) => 
      toggleFavorite(userId, carId, isFavorite),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch user favorites
      queryClient.invalidateQueries({ queryKey: ['userFavorites', userId] });
    },
  });
};

export const useSimilarCars = (category: string, carId: number, limit: number = 3) => {
  return useQuery({
    queryKey: ['similarCars', category, carId, limit],
    queryFn: () => fetchSimilarCars(category, carId, limit),
    enabled: !!category && !!carId,
  });
};

// Fetch 3D models for a car
export const fetchCarModels = async (carId: number): Promise<Car3DModel[]> => {
  const { data, error } = await supabase
    .from('car_3d_models')
    .select('*')
    .eq('car_id', carId);
  
  if (error) {
    log.error(`Error fetching 3D models for car ID ${carId}`, error, 'fetchCarModels');
    throw new Error(error.message);
  }
  
  return data || [];
};

// Add a new 3D model for a car
export const addCarModel = async (model: Omit<Car3DModel, 'id'>): Promise<Car3DModel> => {
  const { data, error } = await supabase
    .from('car_3d_models')
    .insert({
      car_id: model.car_id,
      model_path: model.model_path,
      thumbnail_path: model.thumbnail_path || null,
      format: model.format,
      is_default: model.is_default || false
    })
    .select()
    .single();
  
  if (error) {
    log.error('Error adding 3D model', error, 'addCarModel');
    throw new Error(error.message);
  }
  
  return data;
};

// Update a 3D model
export const updateCarModel = async (id: number, updates: Partial<Car3DModel>): Promise<Car3DModel> => {
  const { data, error } = await supabase
    .from('car_3d_models')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    log.error(`Error updating 3D model with ID ${id}`, error, 'updateCarModel');
    throw new Error(error.message);
  }
  
  return data;
};

// Delete a 3D model
export const deleteCarModel = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('car_3d_models')
    .delete()
    .eq('id', id);
  
  if (error) {
    log.error(`Error deleting 3D model with ID ${id}`, error, 'deleteCarModel');
    throw new Error(error.message);
  }
};

// React Query hooks for 3D models
export const useCarModels = (carId: number) => {
  return useQuery({
    queryKey: ['carModels', carId],
    queryFn: () => fetchCarModels(carId),
    enabled: !!carId,
  });
};

export const useAddCarModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (model: Omit<Car3DModel, 'id'>) => addCarModel(model),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carModels', variables.car_id] });
      queryClient.invalidateQueries({ queryKey: ['car', variables.car_id] });
    },
  });
};

export const useUpdateCarModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Car3DModel> }) => 
      updateCarModel(id, updates),
    onSuccess: (_, variables) => {
      if (variables.updates.car_id) {
        queryClient.invalidateQueries({ queryKey: ['carModels', variables.updates.car_id] });
        queryClient.invalidateQueries({ queryKey: ['car', variables.updates.car_id] });
      }
    },
  });
};

export const useDeleteCarModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteCarModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carModels'] });
    },
  });
};

// PERFORMANCE: Prefetch functions for better caching
export const prefetchCars = async (queryClient: any, options: {
  limit?: number;
  offset?: number;
  category?: string;
  searchQuery?: string;
} = {}) => {
  await queryClient.prefetchQuery({
    queryKey: ['cars', options],
    queryFn: () => fetchCars(options),
    staleTime: 2 * 60 * 1000,
  });
};

export const prefetchFeaturedCars = async (queryClient: any, limit: number = 6) => {
  await queryClient.prefetchQuery({
    queryKey: ['featuredCars', limit],
    queryFn: () => fetchFeaturedCars(limit),
    staleTime: 5 * 60 * 1000,
  });
};
