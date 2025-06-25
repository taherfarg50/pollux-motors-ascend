# Pollux Motors Ascend

A luxury car dealership website featuring a modern UI, dynamic content management, and multilingual support. Built with React, TypeScript, and Supabase for backend storage and data management.

## Features

- **Modern Luxury Design**: Premium UI with animations and transitions for a high-end car dealership experience
- **Dynamic Car Listings**: Display and filter cars by category, price, and features
- **Featured Cars Section**: Highlight premium brand vehicles
- **Car Details Pages**: Comprehensive information with image galleries and specifications
- **Multilingual Support**: Available in English, Arabic, and French
- **Responsive Design**: Optimized for all device sizes
- **Chat Integration**: Real-time customer support feature
- **Supabase Integration**: Cloud database for car listings, images, and specifications

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or bun package manager
- Supabase account with an active project

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pollux-motors-ascend.git
   cd pollux-motors-ascend
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   ```sh
   # Copy the example file
   cp supabase.env.example .env
   
   # Edit the file with your Supabase credentials
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   ```

4. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

## Car Data Management

### Complete Synchronization

To set up everything at once (environment, uploads, galleries, featured cars):

```bash
npm run sync-all
```

### Uploading New Cars

1. Prepare your car folders in the `cars_for_supabase` directory following the naming convention: `MAKE_MODEL_YEAR`
2. Place all images inside the folder
3. Create a `metadata.json` file with car details (see [Car Data Management](#car-data-management))
4. Run:
   ```bash
   npm run upload-cars
   ```

### Verifying Car Galleries

To verify that all cars have proper gallery images:

```bash
npm run verify-galleries
```

### Marking Featured Cars

Premium brands can be automatically marked as featured:

```bash
npm run mark-featured
```

## Brand Logos

Brand logos are displayed in the "We Offer Renowned Auto Marques" section on the homepage with two tabs:
- Luxury Brands (Bentley, Bugatti, Rolls-Royce, etc.)
- Popular Brands (Toyota, Mitsubishi, Volkswagen, etc.)

To add official brand logos:
1. Add SVG/PNG files to `/public/media/images/brands/`
2. Use the brand's lowercase name as the filename (e.g., `bmw.svg`)

## Database Schema

The application uses the following tables:

### cars
- `id`: Auto-incrementing ID
- `name`: Car name (e.g., "BMW X6 M Competition")
- `model`: Specific model (e.g., "X6 M Competition")
- `category`: Vehicle category (e.g., "SUV", "Sedan", "Truck")
- `year`: Model year
- `price`: Formatted price string
- `image`: URL to the main car image
- `gallery`: Array of image URLs for the car
- `description`: Text description of the car
- `featured`: Boolean flag for featured cars
- `color`: CSS color code or name

### car_specs
- `car_id`: Foreign key to the cars table
- `speed`: Top speed (e.g., "240 km/h")
- `acceleration`: 0-100 km/h time (e.g., "4.2s")
- `power`: Engine power (e.g., "350 HP")
- `range`: Vehicle range (e.g., "750 km")

## UI Enhancements

Recent UI improvements include:
1. **Navbar Height Reduction**: Streamlined navigation bar
2. **Centered Hero Content**: Better visual balance
3. **Background Video Support**: Dynamic background for hero section
4. **Advanced Animations**: Smooth transitions using Framer Motion

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Database & Storage**: Supabase
- **Internationalization**: i18next
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack Query

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Lint the codebase
- `npm run setup-env` - Set up environment and fix metadata files
- `npm run upload-cars` - Upload car data to Supabase
- `npm run mark-featured` - Mark premium brands as featured
- `npm run verify-galleries` - Verify and update car galleries
- `npm run sync-all` - Run all data synchronization scripts
- `npm run apply-db-function` - Apply database functions for car details

## Deployment

This project is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Set up environment variables (SUPABASE_URL, SUPABASE_KEY)
3. Deploy using the Netlify dashboard or CLI

## Troubleshooting

- **Image Upload Errors**: Check that your images are valid JPG, PNG, or WebP files and not corrupted
- **Missing Images**: Run `npm run verify-galleries` to fix gallery links
- **Car Not Found Errors**: Apply the database function with `npm run apply-db-function`
- **Rate Limiting**: The scripts include delays to avoid Supabase rate limits

## License

This project is licensed under the MIT License - see the LICENSE file for details.
