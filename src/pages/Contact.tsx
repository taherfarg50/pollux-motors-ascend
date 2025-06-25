import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Phone, Mail, Clock, X, Loader2, Send, ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formState, setFormState] = useState({
    submitting: false,
    submitted: false,
    errors: {} as Record<string, string>
  });

  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [mapView, setMapView] = useState<'standard' | 'satellite'>('standard');
  
  // Create refs for animation triggers
  const [formRef, formInView] = useInView({ 
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [mapRef, mapInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  // Updated company contact information
  const companyInfo = {
    contact: {
      phone: "+971502667937",
      email: "info@polluxmotors.com",
      address: "Silicon oasis HQ FG-07-2, Dubai, United Arab Emirates",
      website: "polluxmotors.com",
      social: {
        instagram: "@polluxmotors",
        linkedin: "polluxmotors",
        youtube: "polluxmotors"
      }
    },
    hours: {
      weekdays: "9:00 AM - 7:00 PM",
      saturday: "9:00 AM - 7:00 PM",
      sunday: "9:00 AM - 7:00 PM"
    },
    locations: [
      {
        name: "Dubai Headquarters",
        address: "Silicon oasis HQ FG-07-2",
        city: "Dubai",
        country: "United Arab Emirates",
        mapsLink: "https://www.google.com/maps/place/Pollux+motors+FZE/@25.1227918,55.3794665,17.25z/data=!4m6!3m5!1s0x3e5f65064064f2a7:0x31a9d2eb9b427270!8m2!3d25.1227918!4d55.3794665!16s%2Fg%2F11fttpc_1y"
      },
      {
        name: "France Office",
        address: "Paris Location",
        city: "Paris",
        country: "France",
        mapsLink: "https://maps.google.com"
      },
      {
        name: "Belgium Office",
        address: "Brussels Location",
        city: "Brussels",
        country: "Belgium",
        mapsLink: "https://maps.google.com"
      }
    ]
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject) errors.subject = "Please select a subject";
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length < 10) {
      errors.message = "Message is too short";
    }
    
    return errors;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }
    
    setFormState({ submitting: true, submitted: false, errors: {} });
    
    // Simulate form submission
    setTimeout(() => {
      setFormState({ submitting: false, submitted: true, errors: {} });
      setShowThankYouModal(true);
      toast.success("Message sent! We'll be in touch soon.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        className="relative h-[50vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-black">
          <motion.img 
            src="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3" 
            alt="Contact Pollux Motors" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-xl text-center px-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            We'd love to hear from you. Contact us with any questions about our vehicles, services, or dealerships.
          </motion.p>
          
          <motion.div
            className="flex gap-4 mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button 
              className="bg-pollux-red hover:bg-red-700 flex items-center gap-2"
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                  contactForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Send className="h-4 w-4" /> Message Us
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                const findUs = document.getElementById('find-us');
                if (findUs) {
                  findUs.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <MapPin className="h-4 w-4" /> Find Us
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Contact Form and Info Section */}
      <section className="py-24" id="contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              ref={formRef}
              className="glass-card rounded-lg p-8 md:p-10"
              initial={{ opacity: 0, x: -50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-gray-400 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} aria-label="Contact form">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-white/5 border ${formState.errors.name ? 'border-red-500' : 'border-gray-800 focus:border-pollux-red'} rounded-md px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-pollux-red/50`}
                        aria-required="true"
                        aria-invalid={!!formState.errors.name}
                        aria-describedby={formState.errors.name ? "name-error" : undefined}
                        required
                      />
                      {formState.errors.name && (
                        <p id="name-error" className="text-red-500 text-xs mt-1" aria-live="polite">{formState.errors.name}</p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-white/5 border ${formState.errors.email ? 'border-red-500' : 'border-gray-800 focus:border-pollux-red'} rounded-md px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-pollux-red/50`}
                        aria-required="true"
                        aria-invalid={!!formState.errors.email}
                        aria-describedby={formState.errors.email ? "email-error" : undefined}
                        required
                      />
                      {formState.errors.email && (
                        <p id="email-error" className="text-red-500 text-xs mt-1" aria-live="polite">{formState.errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-pollux-red/50"
                        aria-describedby="phone-description"
                      />
                      <p id="phone-description" className="text-xs text-gray-500 mt-1">We'll only use this to contact you about your inquiry</p>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject <span className="text-red-500">*</span></label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full bg-white/5 border ${formState.errors.subject ? 'border-red-500' : 'border-gray-800 focus:border-pollux-red'} rounded-md px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-pollux-red/50`}
                        aria-required="true"
                        aria-invalid={!!formState.errors.subject}
                        aria-describedby={formState.errors.subject ? "subject-error" : undefined}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="sales">Vehicle Sales</option>
                        <option value="export">Export Services</option>
                        <option value="support">Customer Support</option>
                        <option value="other">Other</option>
                      </select>
                      {formState.errors.subject && (
                        <p id="subject-error" className="text-red-500 text-xs mt-1" aria-live="polite">{formState.errors.subject}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message <span className="text-red-500">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full bg-white/5 border ${formState.errors.message ? 'border-red-500' : 'border-gray-800 focus:border-pollux-red'} rounded-md px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-pollux-red/50`}
                      aria-required="true"
                      aria-invalid={!!formState.errors.message}
                      aria-describedby={formState.errors.message ? "message-error" : undefined}
                      required
                    ></textarea>
                    {formState.errors.message && (
                      <p id="message-error" className="text-red-500 text-xs mt-1" aria-live="polite">{formState.errors.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-pollux-red hover:bg-red-700 px-6 py-3 min-h-[48px]"
                      disabled={formState.submitting}
                      aria-busy={formState.submitting}
                    >
                      {formState.submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
            
            <div className="space-y-8" ref={infoRef} id="find-us">
              <motion.div 
                className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={infoInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pollux-red p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Find Us</h2>
                </div>
                
                <div className="space-y-6">
                  {companyInfo.locations.map((location, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-none pt-1">
                        <div className="w-2 h-2 rounded-full bg-pollux-red"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">{location.name}</h3>
                        <p className="text-gray-300">{location.address}</p>
                        <p className="text-gray-300">{location.city}, {location.country}</p>
                        <a 
                          href={location.mapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pollux-red hover:underline mt-2 inline-flex items-center gap-1 text-sm"
                        >
                          Get Directions <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={infoInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pollux-red p-2 rounded-full">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Main Contact</h3>
                    <p className="text-gray-300">{companyInfo.contact.phone}</p>
                    <a href={`mailto:${companyInfo.contact.email}`} className="text-pollux-red hover:underline">{companyInfo.contact.email}</a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Website</h3>
                    <a href={`https://${companyInfo.contact.website}`} className="text-pollux-red hover:underline">{companyInfo.contact.website}</a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Social Media</h3>
                    <div className="flex gap-4">
                      <a href="https://www.instagram.com/pollux_motors" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pollux-red">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="https://www.linkedin.com/in/pollux-motors-95aa1a322" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pollux-red">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="https://www.youtube.com/channel/UC7iZZ3r9vN76DMUtQjD3MZQ" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pollux-red">
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={infoInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pollux-red p-2 rounded-full">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Hours of Operation</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <p>Monday - Friday</p>
                    <p className="text-gray-300 font-medium">{companyInfo.hours.weekdays}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <p>Saturday</p>
                    <p className="text-gray-300 font-medium">{companyInfo.hours.saturday}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>Sunday</p>
                    <p className="text-gray-300 font-medium">{companyInfo.hours.sunday}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12" ref={mapRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="glass-card rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={mapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-pollux-red" />
                Location
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={mapView === 'standard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('standard')}
                  className={mapView === 'standard' ? 'bg-pollux-red hover:bg-red-700' : ''}
                >
                  Map
                </Button>
                <Button
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('satellite')}
                  className={mapView === 'satellite' ? 'bg-pollux-red hover:bg-red-700' : ''}
                >
                  Satellite
                </Button>
              </div>
            </div>
            <div className="aspect-[21/9] w-full p-2">
              <iframe
                title="Pollux Motors Headquarters Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0422758325835!2d55.37946651500878!3d25.12279178393829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f65064064f2a7%3A0x31a9d2eb9b427270!2sPollux%20motors%20FZE!5e${mapView === 'satellite' ? '1' : '0'}!3m2!1sen!2sae!4v1710337612043!5m2!1sen!2sae`}
                className="border-0 rounded-md"
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYouModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-background border border-gray-800 rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowThankYouModal(false)}
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-400 mb-6">
                  Your message has been sent successfully. We'll get back to you as soon as possible.
                </p>
                <Button 
                  className="bg-pollux-red hover:bg-red-700 w-full"
                  onClick={() => setShowThankYouModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact;
