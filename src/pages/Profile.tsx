import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserFavorites, useCars, Car } from '@/lib/supabase';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car as CarIcon } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: favorites = [] } = useUserFavorites(user?.id);
  const { data: allCars = [] } = useCars();
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  
  useEffect(() => {
    if (favorites.length > 0 && allCars.length > 0) {
      const userFavoriteCars = allCars.filter(car => favorites.includes(car.id));
      setFavoriteCars(userFavoriteCars);
    }
  }, [favorites, allCars]);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
          
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              {favoriteCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoriteCars.map((car, index) => (
                    <Link key={car.id} to={`/cars/${car.id}`}>
                      <CarCard 
                        id={car.id}
                        name={car.name}
                        category={car.category}
                        year={car.year}
                        price={car.price}
                        image={car.image}
                        specs={car.specs}
                        index={index}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No Favorites Yet</h3>
                  <p className="text-gray-400 mb-8">
                    You haven't saved any cars to your favorites yet.
                  </p>
                  <Button asChild>
                    <Link to="/cars">Browse Cars</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="max-w-2xl bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Account Settings</h3>
                <p className="text-gray-400 mb-6">
                  Account management features will be available soon.
                </p>
                <Button disabled>
                  Update Profile
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
