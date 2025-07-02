import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Instagram, Linkedin, Youtube, ArrowRight, Clock, Award, Users, Car } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  
  const [heroRef, heroInView] = useInView({ 
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [storyRef, storyInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [videoRef, videoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [timelineRef, timelineInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  

  
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [socialRef, socialInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const handlePlayVideo = () => {
    const video = document.getElementById('brand-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  

  
  const companyInfo = {
    founded: "2018",
    location: "Dubai, United Arab Emirates",
    globalPresence: "France and Belgium",
    contact: {
      phone: "+971502667937",
      email: "info@polluxmotors.com",
      address: "Silicon oasis HQ FG-07-2, Dubai, United Arab Emirates"
    },
    vision: "To be the premier luxury automotive dealership in the UAE and beyond, providing exceptional vehicles and service while building lasting relationships with our clients.",
    mission: "To deliver an unparalleled luxury automotive experience through personalized service, expert knowledge, and a carefully curated selection of the world's finest vehicles.",
    luxuryBrands: ["Bentley", "Bugatti", "Rolls Royce", "Lamborghini", "Audi", "Mercedes", "BMW", "Range Rover"],
    globalBrands: ["Toyota", "Mitsubishi", "Volkswagen", "Nissan", "Hyundai", "KIA", "Suzuki"],
    services: [
      "New & Pre-Owned Luxury Vehicles",
      "UAE and International Export Services",
      "RTA Registration Assistance",
      "Shipping and Customs Clearance",
      "GSO & Certificate of Origin Processing"
    ]
  };
  
  const milestones = [
    {
      year: 2018,
      title: "Company Founding",
      description: "Pollux Motors was established in Dubai, United Arab Emirates with an initial focus on luxury vehicle imports."
    },
    {
      year: 2019,
      title: "Showroom Opening",
      description: "Opened our flagship showroom in Dubai Silicon Oasis, featuring a curated collection of premium vehicles."
    },
    {
      year: 2020,
      title: "Global Expansion",
      description: "Expanded operations into France and Belgium, establishing a European presence for our export business."
    },
    {
      year: 2021,
      title: "Regional Network",
      description: "Built a solid network of customers and partners across the Middle East & North Africa region."
    },
    {
      year: 2022,
      title: "Luxury Brand Partnerships",
      description: "Formed exclusive partnerships with prestigious automotive manufacturers and authorized dealers."
    },
    {
      year: 2023,
      title: "Service Expansion",
      description: "Expanded services to include comprehensive shipping, clearance, and RTA registration assistance."
    }
      ];
    
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };
    
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
      }
    };
  
    return (
    <>
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="min-h-[70vh] pt-32 pb-16 relative overflow-hidden flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 -z-10">
          <motion.video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover opacity-30"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <source src="https://cdn.coverr.co/videos/coverr-luxury-car-showroom-2741/1080p.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About <span className="text-pollux-red">Pollux Motors</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                Established in {companyInfo.founded}, Pollux Motors is a leading luxury car dealership and export company based in Dubai, specializing in premium brands and providing exceptional automotive experiences.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-6 justify-center">
                <Button 
                  className="bg-pollux-red hover:bg-red-700 px-6"
                  onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Our Story
                </Button>
                <Button 
                  variant="outline" 
                  className="px-6"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Company Overview */}
      <section id="our-story" className="py-24" ref={storyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-400 mb-8">
                Pollux Motors was established in {companyInfo.founded} in {companyInfo.location} with global operations in {companyInfo.globalPresence}. Founded by automotive enthusiasts with decades of industry experience, we began with a vision to create a different kind of luxury car dealership.
              </p>
              <p className="text-gray-400 mb-8">
                Over the years, we've built a reputation for exceptional service, transparent dealings, and an unrivaled selection of premium vehicles. Our team includes industry experts with specialized knowledge of luxury automotive brands and international export requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-lg text-center">
                  <div className="bg-pollux-red/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-6 w-6 text-pollux-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Premium Vehicles</h3>
                  <p className="text-gray-400 text-sm">Finest selection of luxury cars from top global brands</p>
                </div>
                
                <div className="glass-card p-6 rounded-lg text-center">
                  <div className="bg-pollux-red/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-pollux-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Global Exports</h3>
                  <p className="text-gray-400 text-sm">Seamless international shipping and documentation</p>
                </div>
                
                <div className="glass-card p-6 rounded-lg text-center">
                  <div className="bg-pollux-red/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-pollux-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-gray-400 text-sm">Award-winning customer service and after-sales support</p>
                </div>
              </div>
              
              <Button
                className="mt-6 bg-pollux-red hover:bg-red-700"
                asChild
              >
                <Link to="/cars" className="inline-flex items-center gap-2">
                  View Our Collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Pollux Motors Showroom" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Luxury Redefined</h3>
                  <p className="text-gray-300">Exceptional collection of premium luxury vehicles</p>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 max-w-[200px] glass-card p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-sm font-bold text-pollux-red">Since {companyInfo.founded}</p>
                <p className="text-xs text-gray-400">Leading UAE's automotive luxury market</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Vision & Mission Section */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Committed to excellence and customer satisfaction across all aspects of our business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-pollux-red mb-4">Vision Statement</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {companyInfo.vision}
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-pollux-red mb-4">Mission Statement</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {companyInfo.mission}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brands We Offer Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Renowned Auto Marques</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We are the foremost autonomous suppliers of world's most sought-after, exclusive collection of premium luxury Cars and SUVs.
            </p>
          </div>
          
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-pollux-red">Luxury Brands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
              {companyInfo.luxuryBrands.map((brand, index) => {
                const brandLogos = {
                  'Bentley': 'https://logos-world.net/wp-content/uploads/2021/04/Bentley-Logo-2002-present.png',
                  'Bugatti': 'https://logos-world.net/wp-content/uploads/2021/04/Bugatti-Logo.png',
                  'Rolls Royce': 'https://logos-world.net/wp-content/uploads/2021/04/Rolls-Royce-Logo.png',
                  'Lamborghini': 'https://logos-world.net/wp-content/uploads/2021/04/Lamborghini-Logo.png',
                  'Audi': 'https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png',
                  'Mercedes': 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Benz-Logo.png',
                  'BMW': 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png',
                  'Range Rover': 'https://logos-world.net/wp-content/uploads/2021/04/Range-Rover-Logo.png'
                };
                
                return (
                  <div key={index} className="glass-card p-4 rounded-lg text-center hover:border-pollux-red transition-all duration-300 hover:scale-105 group">
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-white rounded-lg p-2 group-hover:shadow-lg transition-shadow">
                      <img 
                        src={brandLogos[brand] || 'https://via.placeholder.com/64x64/333/fff?text=' + brand.charAt(0)} 
                        alt={brand + ' logo'} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          ((e.currentTarget.nextElementSibling as HTMLElement)).style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full bg-pollux-red rounded flex items-center justify-center text-white font-bold text-xl hidden"
                      >
                        {brand.charAt(0)}
                      </div>
                    </div>
                    <p className="font-bold text-sm">{brand}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-8 text-pollux-red">Global Auto Brands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
              {companyInfo.globalBrands.map((brand, index) => {
                const brandLogos = {
                  'Toyota': 'https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png',
                  'Mitsubishi': 'https://logos-world.net/wp-content/uploads/2021/04/Mitsubishi-Logo.png',
                  'Volkswagen': 'https://logos-world.net/wp-content/uploads/2020/04/Volkswagen-Logo.png',
                  'Nissan': 'https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png',
                  'Hyundai': 'https://logos-world.net/wp-content/uploads/2020/04/Hyundai-Logo.png',
                  'KIA': 'https://logos-world.net/wp-content/uploads/2021/03/Kia-Logo.png',
                  'Suzuki': 'https://logos-world.net/wp-content/uploads/2021/04/Suzuki-Logo.png'
                };
                
                return (
                  <div key={index} className="glass-card p-4 rounded-lg text-center hover:border-pollux-red transition-all duration-300 hover:scale-105 group">
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-white rounded-lg p-2 group-hover:shadow-lg transition-shadow">
                      <img 
                        src={brandLogos[brand] || 'https://via.placeholder.com/64x64/333/fff?text=' + brand.charAt(0)} 
                        alt={brand + ' logo'} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          ((e.currentTarget.nextElementSibling as HTMLElement)).style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full bg-pollux-red rounded flex items-center justify-center text-white font-bold text-xl hidden"
                      >
                        {brand.charAt(0)}
                      </div>
                    </div>
                    <p className="font-bold text-sm">{brand}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Services We Offer</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pollux Motors always focuses on the needs of the customers and offers them tailored services before, during and after their purchase decision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {companyInfo.services.map((service, index) => (
              <div key={index} className="glass-card p-6 rounded-lg text-center transform transition-all duration-500 hover:translate-y-[-5px]">
                <div className="bg-pollux-red/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-pollux-red font-bold text-xl">{index + 1}</div>
                </div>
                <h3 className="text-lg font-bold">{service}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              The strong relationship we have with top-tier automotive companies is testimonial to the high level of skill and quality of services offered to our clients. Our sales team has years of experience and will be pleased to help with queries you may have.
            </p>
            <Button 
              className="bg-pollux-red hover:bg-red-700"
              asChild
            >
              <Link to="/contact" className="inline-flex items-center gap-2">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24" ref={timelineRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From our humble beginnings to becoming a global luxury automotive leader.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-800 md:block hidden"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12 relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="md:w-1/2 flex justify-center md:justify-end p-4">
                    <div 
                      className={`glass-card p-6 rounded-lg max-w-md cursor-pointer transition-all duration-300 ${selectedMilestone === index ? 'ring-2 ring-pollux-red border-pollux-red' : 'hover:border-gray-700'}`}
                      onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-pollux-red/20 p-3 rounded-full">
                          <Clock className="h-5 w-5 text-pollux-red" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{milestone.title}</h3>
                          <p className="text-pollux-red font-bold mb-2">{milestone.year}</p>
                          <p className="text-gray-400">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative my-4 md:my-0">
                    <div className="h-4 w-4 rounded-full bg-pollux-red absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                    <div className="h-12 w-12 rounded-full bg-pollux-red/30 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping-slow"></div>
                  </div>
                  
                  <div className="md:w-1/2 text-center md:text-left p-4 md:hidden">
                    <p className="text-xl font-bold">{milestone.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      


      {/* Contact Information */}
      <section id="contact" className="py-24" ref={contactRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400">Get in touch with our team for any inquiries</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            <motion.div className="glass-card p-6 rounded-lg" variants={itemVariants}>
              <MapPin className="h-8 w-8 text-pollux-red mb-4" />
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-400">{companyInfo.contact.address}</p>
              <a 
                href="https://www.google.com/maps/place/Pollux+motors+FZE/@25.1227918,55.3794665,17.25z/data=!4m6!3m5!1s0x3e5f65064064f2a7:0x31a9d2eb9b427270!8m2!3d25.1227918!4d55.3794665!16s%2Fg%2F11fttpc_1y" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pollux-red hover:underline mt-2 inline-flex items-center gap-1"
              >
                View on Map <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            
            <motion.div className="glass-card p-6 rounded-lg" variants={itemVariants}>
              <Phone className="h-8 w-8 text-pollux-red mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">{companyInfo.contact.phone}</p>
              <a 
                href={`tel:${companyInfo.contact.phone}`} 
                className="text-pollux-red hover:underline mt-2 inline-flex items-center gap-1"
              >
                Call Us <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            
            <motion.div className="glass-card p-6 rounded-lg" variants={itemVariants}>
              <Mail className="h-8 w-8 text-pollux-red mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-400">{companyInfo.contact.email}</p>
              <a 
                href={`mailto:${companyInfo.contact.email}`} 
                className="text-pollux-red hover:underline mt-2 inline-flex items-center gap-1"
              >
                Send Email <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            
            <motion.div className="glass-card p-6 rounded-lg" variants={itemVariants}>
              <Globe className="h-8 w-8 text-pollux-red mb-4" />
              <h3 className="text-lg font-semibold mb-2">Website</h3>
              <p className="text-gray-400">www.polluxmotors.com</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 h-8"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Social Media */}
      <section className="py-24 bg-secondary" ref={socialRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={socialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Follow Us</h2>
            <p className="text-gray-400">Stay updated with our latest news and offers</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={socialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a 
              href="https://www.instagram.com/pollux_motors" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pollux-red transition-colors p-4 glass-card rounded-lg"
            >
              <Instagram className="h-8 w-8" />
            </a>
            <a 
              href="https://www.linkedin.com/in/pollux-motors-95aa1a322/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pollux-red transition-colors p-4 glass-card rounded-lg"
            >
              <Linkedin className="h-8 w-8" />
            </a>
            <a 
              href="https://www.youtube.com/channel/UC7iZZ3r9vN76DMUtQjD3MZQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pollux-red transition-colors p-4 glass-card rounded-lg"
            >
              <Youtube className="h-8 w-8" />
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-16 glass-card p-8 rounded-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={socialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Join Our Newsletter</h3>
              <p className="text-gray-400 mb-6">Subscribe to receive updates on new inventory, exclusive offers, and automotive insights.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md outline-none transition-colors"
                />
                <Button className="bg-pollux-red hover:bg-red-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
