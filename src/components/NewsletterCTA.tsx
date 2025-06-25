import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Gift, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface NewsletterBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const benefits: NewsletterBenefit[] = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Exclusive Offers",
      description: "VIP access to limited-time deals and member-only pricing"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "First to Know",
      description: "Early access to new vehicle launches and special events"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Premium Content",
      description: "Luxury automotive insights, market reports, and expert reviews"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      if (process.env.NODE_ENV === 'development') {
        console.log('Newsletter signup:', email);
      }
      
      setIsSubmitted(true);
      toast.success('Welcome to the Pollux Motors family! Check your email for exclusive offers.');
      
      // Reset after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 5000);
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-yellow-900/30" />
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(0,102,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(212,175,55,0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(139,69,19,0.2) 0%, transparent 50%)
            `,
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <Mail className="w-4 h-4 mr-2" />
              VIP Membership
            </Badge>
            <h2 className="heading-2 mb-8">
              Join The Elite Circle of
              <span className="block text-gradient-luxury">Automotive Enthusiasts</span>
            </h2>
            <p className="text-body-lg max-w-3xl mx-auto">
              Get exclusive access to luxury vehicles, member-only events, and personalized automotive insights 
              delivered directly to your inbox.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="heading-6 text-white mb-2">{benefit.title}</h3>
                      <p className="text-body-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-white">25,000+</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full" />
                    ))}
                  </div>
                </div>
                <p className="text-body-sm text-gray-400">
                  Exclusive members enjoying premium benefits and insider access to luxury automotive world.
                </p>
              </motion.div>
            </motion.div>

            {/* Newsletter Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-blue-400" />
                          </div>
                          <h3 className="heading-5 text-white mb-3">Get Exclusive Updates</h3>
                          <p className="text-body-sm text-gray-400">
                            Join our VIP list for early access to new arrivals and special events.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:bg-white/15"
                                required
                              />
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 group"
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                                Joining...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span>Join VIP List</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            )}
                          </Button>

                          <p className="text-xs text-gray-400 text-center">
                            By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
                          </p>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </motion.div>
                        
                        <h3 className="heading-5 text-white mb-4">Welcome Aboard!</h3>
                        <p className="text-body-sm text-gray-400 mb-6">
                          You've been added to our VIP list. Check your email for exclusive offers and early access to new arrivals.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 rounded-lg bg-white/5">
                            <Gift className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">Exclusive Deals</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <Bell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">Early Access</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">VIP Events</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA; 