// Re-export all components for easier imports

// Existing components
export * from '@/components/ui/button';
export * from '@/components/ui/input';
export * from '@/components/ui/avatar';
export * from '@/components/ui/card';
export * from '@/components/ui/scroll-area';

// Communication components
export { default as Chatbot } from './Chatbot';
export { default as WhatsAppWidget } from './WhatsAppWidget';

// Export company data for direct access
export { companyInfo } from './CompanyData';

// Enhanced modern components
export { default as UserPersonalization } from './UserPersonalization';
export { default as ARVRCarViewer } from './ARVRCarViewer';
export { default as SmartFinancing } from './SmartFinancing';
export { default as MarketIntelligence } from './MarketIntelligence';
export { default as VehicleHealthMonitor } from './VehicleHealthMonitor';

// Hero Components (only keeping the one actually used)
export { default as HeroLuxury } from './hero/HeroLuxury';
export { default as CustomerTestimonials } from './CustomerTestimonials';
export { default as LiveStatistics } from './LiveStatistics';
export { default as BrandPartners } from './BrandPartners'; 