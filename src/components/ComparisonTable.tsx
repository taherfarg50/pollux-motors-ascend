
import { useEffect, useState } from "react";
import { Car } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ComparisonTableProps {
  cars: Car[];
  onRemoveCar: (carId: number) => void;
}

const ComparisonTable = ({ cars, onRemoveCar }: ComparisonTableProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const tableContainer = document.getElementById('comparison-table-container');
    if (tableContainer) {
      const handleScroll = () => {
        setHasScrolled(tableContainer.scrollLeft > 0);
      };
      
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!cars.length) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium">No cars selected for comparison</p>
        <p className="text-muted-foreground mt-2">
          Add cars to compare their specifications side by side
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        id="comparison-table-container" 
        className="overflow-x-auto max-w-full pb-4"
      >
        <div className={`absolute left-0 top-1/2 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 transition-opacity ${hasScrolled ? 'opacity-100' : 'opacity-0'}`} />
        
        <Table className="w-full">
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead className="min-w-[180px] w-[180px]">Specifications</TableHead>
              {cars.map((car) => (
                <TableHead key={car.id} className="min-w-[220px] w-[220px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-base">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.model || "Model"}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-6 w-6"
                      onClick={() => onRemoveCar(car.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Image</TableCell>
              {cars.map((car) => (
                <TableCell key={`img-${car.id}`}>
                  <div className="h-32 w-full rounded-md overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              {cars.map((car) => (
                <TableCell key={`price-${car.id}`} className="text-lg font-medium">{car.price}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Category</TableCell>
              {cars.map((car) => (
                <TableCell key={`cat-${car.id}`}>{car.category}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Year</TableCell>
              {cars.map((car) => (
                <TableCell key={`year-${car.id}`}>{car.year}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Top Speed</TableCell>
              {cars.map((car) => (
                <TableCell key={`speed-${car.id}`}>{car.specs.speed}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Acceleration</TableCell>
              {cars.map((car) => (
                <TableCell key={`accel-${car.id}`}>{car.specs.acceleration}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Power</TableCell>
              {cars.map((car) => (
                <TableCell key={`power-${car.id}`}>{car.specs.power}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Range</TableCell>
              {cars.map((car) => (
                <TableCell key={`range-${car.id}`}>{car.specs.range}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="absolute right-0 top-1/2 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default ComparisonTable;
