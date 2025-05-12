
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

// Mock car data since we don't have a real Supabase table yet
const mockCars: Car[] = [
  {
    id: 1,
    name: "Model X",
    model: "Performance",
    category: "SUV",
    year: "2025",
    price: "$89,990",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1771&auto=format&fit=crop",
    specs: {
      speed: "155 mph",
      acceleration: "2.5s",
      power: "1,020 hp",
      range: "348 mi"
    },
    description: "The Model X is the safest, quickest, most capable SUV ever—with seating for up to seven, storage for all your gear and 348 miles of range on a single charge.",
    featured: true,
    color: "Stealth Grey"
  },
  {
    id: 2,
    name: "Roadster",
    model: "Signature",
    category: "Sports",
    year: "2025",
    price: "$200,000",
    image: "https://images.unsplash.com/photo-1611740677496-3e0ef978784a?q=80&w=1770&auto=format&fit=crop",
    specs: {
      speed: "250+ mph",
      acceleration: "1.9s",
      power: "1,400 hp",
      range: "620 mi"
    },
    description: "The quickest car in the world, with record-setting acceleration, range and performance.",
    featured: true,
    color: "Red Multi-Coat"
  },
  {
    id: 3,
    name: "Model S",
    model: "Plaid",
    category: "Sedan",
    year: "2025",
    price: "$89,990",
    image: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?q=80&w=1932&auto=format&fit=crop",
    specs: {
      speed: "200 mph",
      acceleration: "1.99s",
      power: "1,020 hp",
      range: "396 mi"
    },
    description: "With the longest range and quickest acceleration of any electric vehicle in production, Model S is the highest performing sedan ever built.",
    featured: true,
    color: "Pearl White"
  }
];

// Fetch all cars - using mock data until Supabase table is set up
export const fetchCars = async () => {
  // In the future, replace this with an actual Supabase query
  // const { data, error } = await supabase.from('cars').select('*');
  
  // For now, return our mock data
  return mockCars;
};

// Fetch a single car by ID - using mock data until Supabase table is set up
export const fetchCarById = async (id: number) => {
  // In the future, replace with actual query
  // const { data, error } = await supabase
  //   .from('cars')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  
  // For now, find car in our mock data
  const car = mockCars.find(car => car.id === id);
  
  if (!car) {
    throw new Error(`Car with ID ${id} not found`);
  }
  
  return car;
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
