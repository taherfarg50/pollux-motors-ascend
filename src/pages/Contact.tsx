
import { useState } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

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
    submitted: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ submitting: true, submitted: false });
    
    // Simulate form submission
    setTimeout(() => {
      setFormState({ submitting: false, submitted: true });
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Contact Pollux Motors" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center">
              Get in Touch
            </h1>
            <p className="text-gray-300 max-w-xl text-center px-4">
              We'd love to hear from you. Contact us with any questions about our vehicles, services, or dealerships.
            </p>
          </div>
        </section>
        
        {/* Contact Form and Info Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="glass-card rounded-lg p-8 md:p-10 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm mb-2">Your Name</label>
                        <input 
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="email" className="block text-sm mb-2">Email Address</label>
                        <input 
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="phone" className="block text-sm mb-2">Phone Number</label>
                        <input 
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="subject" className="block text-sm mb-2">Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="Sales Inquiry">Sales Inquiry</option>
                          <option value="Test Drive Request">Test Drive Request</option>
                          <option value="Service Appointment">Service Appointment</option>
                          <option value="General Information">General Information</option>
                          <option value="Feedback">Feedback</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="message" className="block text-sm mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                        required
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={formState.submitting}
                      className="w-full bg-pollux-red hover:bg-red-700 disabled:bg-gray-700 text-white py-3 rounded-md font-medium transition-colors"
                    >
                      {formState.submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="space-y-8">
                <div 
                  className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                  style={{ transitionDelay: '100ms' }}
                >
                  <h2 className="text-2xl font-bold mb-6">Find Us</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Global Headquarters</h3>
                      <p className="text-gray-300">123 Luxury Drive</p>
                      <p className="text-gray-300">Beverly Hills, CA 90210</p>
                      <p className="text-gray-300">United States</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">European Design Center</h3>
                      <p className="text-gray-300">45 Via Elegante</p>
                      <p className="text-gray-300">Milan, 20121</p>
                      <p className="text-gray-300">Italy</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Asia-Pacific Hub</h3>
                      <p className="text-gray-300">88 Innovation Tower</p>
                      <p className="text-gray-300">Tokyo, 100-0001</p>
                      <p className="text-gray-300">Japan</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                  style={{ transitionDelay: '200ms' }}
                >
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Sales</h3>
                      <p className="text-gray-300">+1 (800) 123-4567</p>
                      <p className="text-gray-300">sales@polluxmotors.com</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Customer Support</h3>
                      <p className="text-gray-300">+1 (800) 765-4321</p>
                      <p className="text-gray-300">support@polluxmotors.com</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Media Inquiries</h3>
                      <p className="text-gray-300">+1 (800) 987-6543</p>
                      <p className="text-gray-300">media@polluxmotors.com</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="glass-card p-8 rounded-lg transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg"
                  style={{ transitionDelay: '300ms' }}
                >
                  <h2 className="text-2xl font-bold mb-6">Hours of Operation</h2>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Monday - Friday</p>
                      <p className="text-gray-300">9:00 AM - 8:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Saturday</p>
                      <p className="text-gray-300">10:00 AM - 6:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Sunday</p>
                      <p className="text-gray-300">11:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-lg overflow-hidden p-2">
              <div className="aspect-[21/9] w-full">
                <iframe
                  title="Pollux Motors Headquarters Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26553.058239801906!2d-118.44175364477283!3d34.07471859678826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2C%20USA!5e0!3m2!1sen!2suk!4v1651234567890!5m2!1sen!2suk"
                  className="border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
