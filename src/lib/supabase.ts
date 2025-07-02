import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { log } from "@/utils/logger";
import { createClient } from '@supabase/supabase-js';

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

// Type for database response that includes car_specs
type CarWithSpecs = {
  id: number;
  name: string;
  model: string | null;
  category: string;
  year: string;
  price: string;
  image: string;
  description: string | null;
  featured: boolean | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  gallery: string[] | null;
  car_specs: Array<{
    speed: string;
    acceleration: string;
    power: string;
    range: string;
  }> | null;
};

// UPDATED: Fetch cars using Supabase images directly
export const fetchCars = async (options: {
  limit?: number;
  offset?: number;
  category?: string;
  searchQuery?: string;
  featured?: boolean;
} = {}): Promise<{ cars: Car[], total: number }> => {
  try {
    const { limit = 12, offset = 0, category, searchQuery, featured } = options;
    log.debug('Fetching cars with options', options, 'fetchCars');
    
    // Build query with filters applied at database level
    let query = supabase
      .from('cars')
      .select(`
        *,
        car_specs (
          speed,
          acceleration,
          power,
          range
        )
      `, { count: 'exact' });
    
    // Apply filters at database level for better performance
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }
    
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`name.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data: cars, error: carsError, count } = await query;
    
    if (carsError) {
      const userMessage = handleSupabaseError(carsError, 'fetchCars', 'fetchCars');
      log.error("Error fetching cars", { error: carsError }, 'fetchCars');
      throw new Error(userMessage);
    }

    if (!cars) {
      return { cars: [], total: 0 };
    }

    // Type the cars data properly
    const carsWithSpecs = cars as unknown as CarWithSpecs[];

    // Use Supabase images directly from database
    const carsWithSupabaseImages: Car[] = carsWithSpecs.map(car => {
      const { car_specs, ...carWithoutSpecs } = car;
      return {
        ...carWithoutSpecs,
        image: car.image, // Use Supabase image URL from database
        gallery: car.gallery || [], // Use Supabase gallery URLs from database
        specs: car_specs?.[0] ? {
          speed: car_specs[0].speed,
          acceleration: car_specs[0].acceleration,
          power: car_specs[0].power,
          range: car_specs[0].range
        } : {
          speed: "N/A",
          acceleration: "N/A",
          power: "N/A",
          range: "N/A"
        }
      };
    });
    
    log.info(`Successfully fetched ${carsWithSupabaseImages.length} cars with Supabase images (offset: ${offset}, limit: ${limit})`, { count }, 'fetchCars');
    
    return { 
      cars: carsWithSupabaseImages, 
      total: count || 0 
    };
  } catch (error) {
    log.error('Failed to fetch cars', error, 'fetchCars');
    throw error;
  }
};

// DEPRECATED - Use fetchCars with options instead
export const fetchFilteredCars = async (filters: CarFilters = {}): Promise<Car[]> => {
  log.warn('fetchFilteredCars is deprecated, use fetchCars with options instead', { filters }, 'fetchFilteredCars');
  const { cars } = await fetchCars({
    limit: filters.limit || 12,
    offset: filters.offset || 0,
    category: filters.category,
    searchQuery: filters.searchQuery
  });
  return cars;
};

// Fetch a single car by ID
export const fetchCarById = async (id: number): Promise<Car> => {
  log.debug(`Fetching car with ID: ${id}`, { id }, 'fetchCarById');
  
  const { data: car, error: carError } = await supabase
    .from('cars')
    .select(`
      *,
      car_specs (
        speed,
        acceleration,
        power,
        range
      )
    `)
    .eq('id', id)
    .single();

  if (carError) {
    const userMessage = handleSupabaseError(carError, 'fetchCarById', 'fetchCarById');
    log.error(`Error fetching car with ID ${id}`, { error: carError }, 'fetchCarById');
    throw new Error(userMessage);
  }
  
  if (!car) {
    throw new Error(`Car with ID ${id} not found`);
  }

  // Use Supabase images directly from database
  const carWithSpecs = car as unknown as CarWithSpecs;
  const { car_specs, ...carWithoutSpecs } = carWithSpecs;
  const carWithSupabaseImages: Car = {
    ...carWithoutSpecs,
    image: carWithSpecs.image, // Use Supabase image URL from database
    gallery: carWithSpecs.gallery || [], // Use Supabase gallery URLs from database
    specs: car_specs?.[0] ? {
      speed: car_specs[0].speed,
      acceleration: car_specs[0].acceleration,
      power: car_specs[0].power,
      range: car_specs[0].range
    } : {
      speed: "N/A",
      acceleration: "N/A", 
      power: "N/A",
      range: "N/A"
    }
  };

  log.info(`Successfully fetched car: ${carWithSpecs.name}`, { carId: id }, 'fetchCarById');
  return carWithSupabaseImages;
};

// FIXED: Fast featured cars with galleries
export const fetchFeaturedCars = async (limit: number = 6): Promise<Car[]> => {
  try {
    log.debug('Fetching featured cars with galleries', { limit }, 'fetchFeaturedCars');
    
    // First, get featured cars with gallery
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, gallery, description, featured, color')
      .eq('featured', true)
      .limit(limit);
    
    if (carsError) {
      const userMessage = handleSupabaseError(carsError, 'fetchFeaturedCars', 'fetchFeaturedCars');
      log.error("Error fetching featured cars", { error: carsError }, 'fetchFeaturedCars');
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
    
    // Transform data efficiently using Supabase images
    const cars: Car[] = carsData.map(car => {
      const specs = specsData?.find(spec => spec.car_id === car.id);
      
      return {
        id: car.id,
        name: car.name,
        model: car.model,
        category: car.category,
        year: car.year,
        price: car.price,
        image: car.image, // Use Supabase image URL from database
        gallery: car.gallery || [], // Use Supabase gallery URLs from database
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
    
    log.info('Successfully fetched featured cars with galleries', { 
      count: cars.length,
      totalGalleryImages: cars.reduce((sum, car) => sum + (car.gallery?.length || 0), 0)
    }, 'fetchFeaturedCars');
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
      log.error("Error fetching user favorites", { error: favError }, 'fetchUserFavorites');
      throw new Error(favError.message);
    }
    
    if (!favorites || favorites.length === 0) {
      return [];
    }
    
    const carIds = favorites.map(fav => fav.car_id);
    
    // Get car details for these IDs
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, gallery, description, featured, color')
      .in('id', carIds);
    
    if (carsError) {
      log.error("Error fetching favorite cars details", { error: carsError }, 'fetchUserFavorites');
      throw new Error(carsError.message);
    }
    
    // Return cars with default specs
    return (cars || []).map(car => ({
      ...car,
      gallery: car.gallery || [],
      specs: {
        speed: "N/A",
        acceleration: "N/A",
        power: "N/A",
        range: "N/A"
      }
    }));
  } catch (error) {
    log.error('Failed to fetch user favorites', { error }, 'fetchUserFavorites');
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
      log.error("Error removing favorite", { error }, 'toggleFavorite');
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, car_id: carId });
    
    if (error) {
      log.error("Error adding favorite", { error }, 'toggleFavorite');
      throw new Error(error.message);
    }
  }
};

// Fetch similar cars by category, excluding the current car
export const fetchSimilarCars = async (categoryName: string, currentCarId: number, limit: number = 3): Promise<Car[]> => {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('id, name, model, category, year, price, image, gallery, description, featured, color')
      .eq('category', categoryName)
      .neq('id', currentCarId)
      .limit(limit);
    
    if (error) {
      log.error("Error fetching similar cars", { error }, 'fetchSimilarCars');
      throw new Error(error.message);
    }
    
    // Return cars with Supabase images and default specs
    return (cars || []).map(car => {
      return {
        ...car,
        image: car.image, // Use Supabase image URL from database
        gallery: car.gallery || [], // Use Supabase gallery URLs from database
        specs: {
          speed: "N/A",
          acceleration: "N/A", 
          power: "N/A",
          range: "N/A"
        }
      };
    });
  } catch (error) {
    log.error('Failed to fetch similar cars', { error }, 'fetchSimilarCars');
    throw error;
  }
};

// Sample data creation for development
export const createSampleData = async (): Promise<{ success: boolean; message: string; count: number }> => {
  try {
    log.info('Creating sample car data...', undefined, 'createSampleData');
    
    // Sample cars data
    const sampleCars = [
      {
        name: "Mercedes-Benz G 63 AMG",
        model: "G 63 AMG",
        category: "Luxury SUV",
        year: "2024",
        price: "AED 850,000",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
        description: "The ultimate luxury SUV with unparalleled performance and prestige.",
        featured: true,
        color: "Black"
      },
      {
        name: "Toyota Land Cruiser 300",
        model: "Land Cruiser 300",
        category: "SUV",
        year: "2024",
        price: "AED 320,000",
        image: "https://images.unsplash.com/photo-1544829150-6e4d999de2a0?w=800&h=600&fit=crop",
        description: "Legendary off-road capability meets modern luxury and technology.",
        featured: true,
        color: "White"
      },
      {
        name: "BMW X6 M Competition",
        model: "X6 M Competition",
        category: "Sport SUV",
        year: "2024",
        price: "AED 650,000",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        description: "Sports car performance in an SUV body with M division engineering.",
        featured: true,
        color: "Blue"
      },
      {
        name: "Audi Q8 55 TFSI",
        model: "Q8 55 TFSI",
        category: "Luxury SUV",
        year: "2024",
        price: "AED 420,000",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        description: "Sophisticated design meets cutting-edge technology and performance.",
        featured: false,
        color: "Silver"
      },
      {
        name: "Range Rover Vogue",
        model: "Vogue",
        category: "Luxury SUV",
        year: "2024",
        price: "AED 580,000",
        image: "https://images.unsplash.com/photo-1494976688153-ca3ce9609806?w=800&h=600&fit=crop",
        description: "The pinnacle of luxury SUV design and British craftsmanship.",
        featured: false,
        color: "Grey"
      },
      {
        name: "Porsche Cayenne Turbo",
        model: "Cayenne Turbo",
        category: "Sport SUV",
        year: "2024",
        price: "AED 750,000",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        description: "Pure sports car DNA in a luxurious SUV package.",
        featured: true,
        color: "Red"
      },
      {
        name: "Lexus LX 600",
        model: "LX 600",
        category: "Luxury SUV",
        year: "2024",
        price: "AED 480,000",
        image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop",
        description: "Japanese luxury meets uncompromising reliability and comfort.",
        featured: false,
        color: "Black"
      },
      {
        name: "Tesla Model X Plaid",
        model: "Model X Plaid",
        category: "Electric SUV",
        year: "2024",
        price: "AED 420,000",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
        description: "Revolutionary electric performance with falcon wing doors.",
        featured: true,
        color: "White"
      },
      {
        name: "Bentley Bentayga",
        model: "Bentayga",
        category: "Ultra Luxury SUV",
        year: "2024",
        price: "AED 950,000",
        image: "https://images.unsplash.com/photo-1544829150-6e4d999de2a0?w=800&h=600&fit=crop",
        description: "The ultimate expression of luxury and handcrafted excellence.",
        featured: true,
        color: "Navy"
      },
      {
        name: "Rolls-Royce Cullinan",
        model: "Cullinan",
        category: "Ultra Luxury SUV",
        year: "2024",
        price: "AED 1,200,000",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        description: "The most luxurious SUV ever created, with unparalleled comfort.",
        featured: true,
        color: "Black"
      },
      {
        name: "Toyota Corolla",
        model: "Corolla",
        category: "Sedan",
        year: "2024",
        price: "AED 85,000",
        image: "https://images.unsplash.com/photo-1549399578-f71f0b5f8b98?w=800&h=600&fit=crop",
        description: "Reliable, efficient, and feature-packed family sedan.",
        featured: false,
        color: "Silver"
      },
      {
        name: "Honda Civic",
        model: "Civic",
        category: "Sedan",
        year: "2024",
        price: "AED 95,000",
        image: "https://images.unsplash.com/photo-1619362280261-c381b121e544?w=800&h=600&fit=crop",
        description: "Sporty design meets practical everyday functionality.",
        featured: false,
        color: "Blue"
      }
    ];

    // Insert cars
    const { data: insertedCars, error: carsError } = await supabase
      .from('cars')
      .insert(sampleCars)
      .select();

    if (carsError) {
      throw new Error(carsError.message);
    }

    if (!insertedCars || insertedCars.length === 0) {
      throw new Error('No cars were inserted');
    }

    // Create sample specs for the cars
    const sampleSpecs = [
      { speed: "320 km/h", acceleration: "3.8s", power: "630 HP", range: "600 km" }, // Mercedes G63
      { speed: "220 km/h", acceleration: "7.2s", power: "415 HP", range: "800 km" }, // Land Cruiser
      { speed: "290 km/h", acceleration: "3.8s", power: "625 HP", range: "550 km" }, // BMW X6 M
      { speed: "250 km/h", acceleration: "5.9s", power: "340 HP", range: "650 km" }, // Audi Q8
      { speed: "225 km/h", acceleration: "6.1s", power: "400 HP", range: "700 km" }, // Range Rover
      { speed: "286 km/h", acceleration: "3.7s", power: "550 HP", range: "500 km" }, // Porsche Cayenne
      { speed: "210 km/h", acceleration: "6.9s", power: "409 HP", range: "750 km" }, // Lexus LX
      { speed: "262 km/h", acceleration: "2.6s", power: "1020 HP", range: "500 km" }, // Tesla Model X
      { speed: "290 km/h", acceleration: "4.5s", power: "542 HP", range: "600 km" }, // Bentley
      { speed: "250 km/h", acceleration: "5.2s", power: "563 HP", range: "650 km" }, // Rolls-Royce
      { speed: "180 km/h", acceleration: "9.2s", power: "139 HP", range: "900 km" }, // Corolla
      { speed: "200 km/h", acceleration: "8.1s", power: "158 HP", range: "850 km" }  // Civic
    ];

    const specsData = insertedCars.map((car, index) => ({
      car_id: car.id,
      ...sampleSpecs[index]
    }));

    const { error: specsError } = await supabase
      .from('car_specs')
      .insert(specsData);

    if (specsError) {
      log.warn('Failed to insert car specs', { error: specsError }, 'createSampleData');
    }

    log.info('Sample data created successfully', { count: insertedCars.length }, 'createSampleData');
    return {
      success: true,
      message: `Successfully created ${insertedCars.length} sample cars with specifications`,
      count: insertedCars.length
    };

  } catch (error) {
    log.error('Failed to create sample data', { error }, 'createSampleData');
    return {
      success: false,
      message: `Failed to create sample data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
};

// Enhanced useCars hook with better error handling and fallback
export const useCars = (options: {
  limit?: number;
  offset?: number;
  category?: string;
  searchQuery?: string;
} = {}) => {
  return useQuery({
    queryKey: ['cars', options],
    queryFn: async () => {
      try {
        const result = await fetchCars(options);
        // If no cars found and this is the first page, it might mean empty database
        if (result.cars.length === 0 && (!options.offset || options.offset === 0)) {
          log.warn('No cars found in database', { options }, 'useCars');
        }
        return result;
      } catch (error) {
        log.error('Error in useCars', { error }, 'useCars');
        // Return empty result instead of throwing
        return { cars: [], total: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times, but not for certain errors
      if (failureCount >= 3) return false;
      // Don't retry if it's a network error or server error
      if (error?.message?.includes('fetch')) return false;
      return true;
    },
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
    log.error(`Error fetching 3D models for car ID ${carId}`, { error }, 'fetchCarModels');
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
    log.error('Error adding 3D model', { error }, 'addCarModel');
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
    log.error(`Error updating 3D model with ID ${id}`, { error }, 'updateCarModel');
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
    log.error(`Error deleting 3D model with ID ${id}`, { error }, 'deleteCarModel');
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
export const prefetchCars = async (queryClient: ReturnType<typeof useQueryClient>, options: {
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

export const prefetchFeaturedCars = async (queryClient: ReturnType<typeof useQueryClient>, limit: number = 6) => {
  await queryClient.prefetchQuery({
    queryKey: ['featuredCars', limit],
    queryFn: () => fetchFeaturedCars(limit),
    staleTime: 5 * 60 * 1000,
  });
};
