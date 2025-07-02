import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ExportServices = () => {

  const exportDestinations = [
    {
      country: "Egypt",
      flag: "🇪🇬",
      details: "Popular destination with established shipping routes and local partnerships.",
      shippingTime: "14-21 days",
      requirements: "Import permit, customs documentation"
    },
    {
      country: "Algeria",
      flag: "🇩🇿",
      details: "Growing market with streamlined import processes for quality vehicles.",
      shippingTime: "10-18 days",
      requirements: "Import license, vehicle registration"
    },
    {
      country: "Morocco",
      flag: "🇲🇦",
      details: "Strategic location with excellent port facilities and efficient customs.",
      shippingTime: "12-16 days",
      requirements: "Import authorization, technical inspection"
    },
    {
      country: "Tunisia",
      flag: "🇹🇳",
      details: "Emerging market with simplified procedures for vehicle imports.",
      shippingTime: "8-14 days",
      requirements: "Import permit, conformity certificate"
    }
  ];

  const exportProcess = [
    {
      step: 1,
      title: "Vehicle Selection",
      description: "Choose your vehicle from our extensive inventory or let us source specific models."
    },
    {
      step: 2,
      title: "Documentation",
      description: "We handle all export paperwork, permits, and customs documentation."
    },
    {
      step: 3,
      title: "Preparation",
      description: "Pre-export inspection, cleaning, and preparation for international shipping."
    },
    {
      step: 4,
      title: "Shipping",
      description: "Professional transportation via our trusted shipping partners."
    },
    {
      step: 5,
      title: "Delivery",
      description: "Door-to-port delivery and assistance with local customs clearance."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-pollux-blue to-pollux-blue-light">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Vehicle Export Services
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your trusted partner for exporting quality vehicles to Egypt, Algeria, and beyond. 
              Professional service, reliable delivery, complete peace of mind.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" className="bg-white text-pollux-blue hover:bg-gray-100">
                Start Export Process
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>



        {/* Export Destinations */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Popular Export Destinations
              </h2>
              <p className="text-gray-400 text-lg">
                We specialize in vehicle exports to key markets across Africa and the Middle East.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {exportDestinations.map((destination, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/40 border-gray-700 hover:border-pollux-gold/50 transition-all hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{destination.flag}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{destination.country}</h3>
                      <p className="text-gray-400 text-sm mb-4">{destination.details}</p>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-500 text-xs pt-2">
                          {destination.requirements}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Export Process */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Simple 5-Step Export Process
              </h2>
              <p className="text-gray-400 text-lg">
                Our streamlined process makes vehicle export easy and stress-free.
              </p>
            </div>

            <div className="relative">
              {/* Process Steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {exportProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="text-center relative"
                  >
                    <div className="w-16 h-16 bg-pollux-blue rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 border-4 border-pollux-blue-light">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                    
                    {/* Arrow */}
                    {index < exportProcess.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-8 -ml-4">
                        <ArrowRight className="w-6 h-6 text-pollux-blue" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-r from-pollux-blue to-pollux-blue-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Export Your Vehicle?
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Contact our export specialists today for a free consultation and personalized quote.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-white">+971502667937</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white">info@polluxmotors.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white">Mon-Fri 8AM-6PM</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-pollux-blue hover:bg-gray-100">
                Get Export Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pollux-blue">
                View Available Vehicles
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExportServices; 