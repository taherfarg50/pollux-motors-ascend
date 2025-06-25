import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Globe, Zap, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BrandPartner {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  partnership: string;
  since: string;
  website: string;
  featured: boolean;
  tier: 'platinum' | 'gold' | 'silver';
}

interface Partnership {
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  color: string;
}

const BrandPartners: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const brandPartners: BrandPartner[] = [
    {
      id: 'mercedes',
      name: 'Mercedes-Benz',
      logo: '/media/images/brands/Mercedes-Benz-Logo.wine.svg',
      category: 'Luxury',
      description: 'Premium luxury vehicles with cutting-edge technology and unmatched sophistication.',
      partnership: 'Exclusive Dealership',
      since: '2018',
      website: 'https://mercedes-benz.com',
      featured: true,
      tier: 'platinum'
    },
    {
      id: 'bmw',
      name: 'BMW',
      logo: '/media/images/brands/BMW-Logo.wine.svg',
      category: 'Performance',
      description: 'The ultimate driving machines combining performance, luxury, and innovation.',
      partnership: 'Authorized Dealer',
      since: '2019',
      website: 'https://bmw.com',
      featured: true,
      tier: 'platinum'
    },
    {
      id: 'audi',
      name: 'Audi',
      logo: '/media/images/brands/Audi-Logo.wine.svg',
      category: 'Luxury',
      description: 'Vorsprung durch Technik - Progress through technology in every vehicle.',
      partnership: 'Premier Partner',
      since: '2020',
      website: 'https://audi.com',
      featured: true,
      tier: 'platinum'
    },
    {
      id: 'porsche',
      name: 'Porsche',
      logo: '/media/images/brands/Porsche-Logo.wine.svg',
      category: 'Sports',
      description: 'Legendary sports cars engineered for pure driving pleasure and performance.',
      partnership: 'Exclusive Dealership',
      since: '2021',
      website: 'https://porsche.com',
      featured: true,
      tier: 'gold'
    },
    {
      id: 'tesla',
      name: 'Tesla',
      logo: '/media/images/brands/Tesla,_Inc.-Logo.wine.svg',
      category: 'Electric',
      description: 'Revolutionary electric vehicles leading the sustainable transportation future.',
      partnership: 'Authorized Partner',
      since: '2022',
      website: 'https://tesla.com',
      featured: true,
      tier: 'gold'
    },
    {
      id: 'bentley',
      name: 'Bentley',
      logo: '/media/images/brands/Bentley-Logo.wine.svg',
      category: 'Ultra Luxury',
      description: 'Extraordinary handcrafted luxury vehicles for the most discerning customers.',
      partnership: 'Exclusive Partner',
      since: '2019',
      website: 'https://bentley.com',
      featured: true,
      tier: 'platinum'
    },
    {
      id: 'lexus',
      name: 'Lexus',
      logo: '/media/images/brands/Lexus-Logo.wine.svg',
      category: 'Luxury',
      description: 'Pursuit of perfection in luxury vehicles with exceptional reliability.',
      partnership: 'Premier Dealer',
      since: '2020',
      website: 'https://lexus.com',
      featured: false,
      tier: 'gold'
    },
    {
      id: 'landrover',
      name: 'Land Rover',
      logo: '/media/images/brands/Land_Rover-Logo.wine.svg',
      category: 'SUV',
      description: 'Above and beyond luxury SUVs designed for any terrain and adventure.',
      partnership: 'Authorized Dealer',
      since: '2021',
      website: 'https://landrover.com',
      featured: false,
      tier: 'silver'
    }
  ];

  const partnerships: Partnership[] = [
    {
      title: 'AI-Powered Personalization',
      description: 'Advanced algorithms to match customers with their perfect vehicle',
      benefits: ['Behavioral Analysis', 'Preference Learning', 'Smart Recommendations'],
      icon: <Zap className="w-8 h-8" />,
      color: 'blue'
    },
    {
      title: 'Virtual Reality Showrooms',
      description: 'Immersive 3D experiences for remote vehicle exploration',
      benefits: ['360° Vehicle Tours', 'Interactive Features', 'Real-time Customization'],
      icon: <Globe className="w-8 h-8" />,
      color: 'purple'
    },
    {
      title: 'Premium Service Network',
      description: 'Comprehensive support and maintenance across all locations',
      benefits: ['24/7 Support', 'Mobile Service', 'Certified Technicians'],
      icon: <Award className="w-8 h-8" />,
      color: 'yellow'
    },
    {
      title: 'Exclusive Member Benefits',
      description: 'VIP treatment and special privileges for valued customers',
      benefits: ['Priority Access', 'Special Events', 'Concierge Service'],
      icon: <Star className="w-8 h-8" />,
      color: 'green'
    }
  ];

  const categories = ['all', ...new Set(brandPartners.map(partner => partner.category))];

  const filteredPartners = selectedCategory === 'all' 
    ? brandPartners 
    : brandPartners.filter(partner => partner.category === selectedCategory);

  const getTierColor = (tier: 'platinum' | 'gold' | 'silver') => {
    switch (tier) {
      case 'platinum':
        return 'from-slate-300 to-slate-500 text-slate-300';
      case 'gold':
        return 'from-yellow-300 to-yellow-500 text-yellow-300';
      case 'silver':
        return 'from-gray-300 to-gray-500 text-gray-300';
      default:
        return 'from-slate-300 to-slate-500 text-slate-300';
    }
  };

  const getTierBadge = (tier: 'platinum' | 'gold' | 'silver') => {
    switch (tier) {
      case 'platinum':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'silver':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <section className="py-32 bg-gradient-to-b from-black/50 to-transparent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(212,175,55,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0,102,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            Premium Partnerships
          </Badge>
          <h2 className="heading-2 mb-8">
            Trusted By The World's
            <span className="block text-gradient-luxury">Leading Brands</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Exclusive partnerships with premium automotive manufacturers, bringing you the finest selection 
            of luxury vehicles and unparalleled service excellence.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category === 'all' ? 'All Partners' : category}
            </Button>
          ))}
        </motion.div>

        {/* Brand Partners Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredPartner(partner.id)}
                onHoverEnd={() => setHoveredPartner(null)}
                className="group cursor-pointer"
              >
                <Card className="p-8 h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden">
                  {/* Tier Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`text-xs ${getTierBadge(partner.tier)}`}>
                      {partner.tier.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {partner.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10 text-center">
                    {/* Brand Logo */}
                    <div className="mb-6 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/10 p-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback for missing images
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg items-center justify-center text-2xl font-bold text-white hidden">
                          {partner.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Brand Info */}
                    <h3 className="heading-6 text-white mb-2">{partner.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{partner.category}</p>
                    <p className="text-xs text-gray-500 mb-4">Partner since {partner.since}</p>
                    
                    {/* Partnership Details */}
                    <AnimatePresence>
                      {hoveredPartner === partner.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                            <p className="text-xs text-gray-300 mb-2">{partner.description}</p>
                            <div className="flex items-center justify-center">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                {partner.partnership}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Partnership Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-white mb-4">Partnership Benefits</h3>
            <p className="text-body-md text-gray-400 max-w-2xl mx-auto">
              Our strategic partnerships enable us to deliver exceptional value and innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partnership, index) => (
              <motion.div
                key={partnership.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className={`p-6 h-full bg-gradient-to-br from-${partnership.color}-500/20 to-${partnership.color}-600/20 border border-${partnership.color}-500/30 hover:shadow-luxury-lg transition-all duration-500`}>
                  <div className={`text-${partnership.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {partnership.icon}
                  </div>
                  
                  <h4 className="heading-6 text-white mb-3">{partnership.title}</h4>
                  <p className="text-body-sm text-gray-400 mb-4">{partnership.description}</p>
                  
                  <div className="space-y-2">
                    {partnership.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <CheckCircle className={`w-4 h-4 text-${partnership.color}-400 mr-2 flex-shrink-0`} />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partnership Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{brandPartners.length}+</div>
                <p className="text-gray-400">Brand Partners</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">5</div>
                <p className="text-gray-400">Platinum Tier</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <p className="text-gray-400">Satisfaction Rate</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <p className="text-gray-400">Partner Support</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandPartners; 