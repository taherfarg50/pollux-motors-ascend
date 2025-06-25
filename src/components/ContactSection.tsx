import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const ContactSection = () => {
  const location = useLocation();
  const [requestType, setRequestType] = useState('test-drive');
  const [carInfo, setCarInfo] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    model: 'Astra GT-X',
    requestType: 'test-drive'
  });
  
  const [formState, setFormState] = useState({
    submitting: false,
    submitted: false
  });
  
  // Check if we have state from car detail page
  useEffect(() => {
    if (location.state) {
      const { carInfo, requestType } = location.state;
      
      if (carInfo) {
        setCarInfo(carInfo);
        setFormData(prev => ({ ...prev, model: carInfo }));
      }
      
      if (requestType) {
        setRequestType(requestType);
        setFormData(prev => ({ ...prev, requestType }));
      }
    }
  }, [location.state]);
  
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
      toast.success(`${requestType === 'purchase' ? 'Purchase' : 'Buy a Car'} request submitted! We'll be in touch soon.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        model: carInfo || 'Astra GT-X',
        requestType: requestType
      });
    }, 1500);
  };
  
  const getRequestTypeText = () => {
    return requestType === 'purchase' ? 'Purchase' : 'Buy A Car';
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
            {requestType === 'purchase' ? 'Purchase a Vehicle' : 'Buy a Car'}
          </h3>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            {requestType === 'purchase' 
              ? `Ready to own a Pollux vehicle? Fill out the form below and our sales team will contact you to arrange the purchase of ${carInfo ? `your ${carInfo}` : 'your dream car'}.`
              : `Ready to own a Pollux vehicle? Fill out the form below and our team will contact you to finalize your purchase and arrange delivery.`
            }
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
                      {carInfo && <option value={carInfo}>{carInfo}</option>}
                      <option value="Astra GT-X">Astra GT-X</option>
                      <option value="Celestial S-500">Celestial S-500</option>
                      <option value="Solari Quantum E">Solari Quantum E</option>
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
                    `Request ${getRequestTypeText()}`
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="space-y-10">
            <div className="glass-card p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Visit Our Showroom</h4>
              <p className="text-gray-300 mb-2">Silicon oasis HQ FG-07-2</p>
              <p className="text-gray-300 mb-2">Dubai, United Arab Emirates</p>
              <p className="text-gray-300">Open: 9AM - 7:00PM</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Contact Information</h4>
              <p className="text-gray-300 mb-2">Email: info@polluxmotors.com</p>
              <p className="text-gray-300 mb-2">Sales: +971502667937</p>
              <p className="text-gray-300">Website: polluxmotors.com</p>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                title="Pollux Motors Headquarters Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0422758325835!2d55.37946651500878!3d25.12279178393829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f65064064f2a7%3A0x31a9d2eb9b427270!2sPollux%20motors%20FZE!5e0!3m2!1sen!2sae!4v1710337612043!5m2!1sen!2sae"
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
