
import { useState } from 'react';
import { toast } from 'sonner';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    model: 'Astra GT-X'
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
      toast.success("Request submitted! We'll be in touch soon.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        model: 'Astra GT-X'
      });
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full">
          <img 
            src="https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3" 
            alt="Contact Background" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
            Get In Touch
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold">
            Schedule a Test Drive
          </h3>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Experience the thrill of driving a Pollux vehicle. Fill out the form below 
            and our team will contact you to arrange a personalized test drive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card rounded-lg p-8 md:p-10">
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
                    <label htmlFor="model" className="block text-sm mb-2">Preferred Model</label>
                    <select
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                    >
                      <option>Astra GT-X</option>
                      <option>Celestial S-500</option>
                      <option>Solari Quantum E</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="message" className="block text-sm mb-2">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-gray-800 focus:border-pollux-red rounded-md px-4 py-3 outline-none transition-colors"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={formState.submitting}
                  className="w-full px-8 py-4 bg-pollux-red hover:bg-red-700 disabled:bg-gray-700 text-white rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  {formState.submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Request Test Drive'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="space-y-10">
            <div className="glass-card p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Visit Our Showroom</h4>
              <p className="text-gray-300 mb-2">123 Luxury Drive</p>
              <p className="text-gray-300 mb-2">Beverly Hills, CA 90210</p>
              <p className="text-gray-300">Mon-Sat: 9AM - 8PM</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Contact Information</h4>
              <p className="text-gray-300 mb-2">Email: info@polluxmotors.com</p>
              <p className="text-gray-300 mb-2">Sales: +1 (800) 123-4567</p>
              <p className="text-gray-300">Support: +1 (800) 765-4321</p>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden">
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
      </div>
    </section>
  );
};

export default ContactSection;
