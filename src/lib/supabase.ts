
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
export const fetchCars = async () => {
  const { data, error } = await supabase.from('cars').select('*');
  
  if (error) {
    console.error("Error fetching cars:", error);
    throw new Error(error.message);
  }
  
  return data as Car[];
};

// Fetch a single car by ID
export const fetchCarById = async (id: number) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data as Car;
};

// React Query hooks
export const useCars = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  });
};

export const useCar = (id: number) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};
