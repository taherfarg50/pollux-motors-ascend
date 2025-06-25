import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Percent,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  FileText,
  Handshake,
  Star,
  Bot,
  Video,
  MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface FinancingOption {
  id: string;
  provider: string;
  type: 'loan' | 'lease' | 'cash' | 'subscription';
  apr: number;
  term: number;
  monthlyPayment: number;
  totalCost: number;
  downPayment: number;
  features: string[];
  rating: number;
  processingTime: string;
  preApproved: boolean;
}

interface CreditProfile {
  score: number;
  income: number;
  debt: number;
  employment: string;
  creditHistory: number;
  downPayment: number;
}

interface VirtualAdvisor {
  name: string;
  specialty: string;
  rating: number;
  isAvailable: boolean;
  languages: string[];
  avatar: string;
}

const SmartFinancing: React.FC<{ carPrice: number; carName: string }> = ({ carPrice, carName }) => {
  const [creditProfile, setCreditProfile] = useState<CreditProfile>({
    score: 700,
    income: 75000,
    debt: 15000,
    employment: 'full-time',
    creditHistory: 5,
    downPayment: Math.round(carPrice * 0.2)
  });

  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'processing' | 'approved' | 'declined'>('idle');
  const [virtualMeeting, setVirtualMeeting] = useState(false);

  const virtualAdvisors: VirtualAdvisor[] = [
    {
      name: 'Sarah Wilson',
      specialty: 'Luxury Vehicle Financing',
      rating: 4.9,
      isAvailable: true,
      languages: ['English', 'Arabic'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5eb?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Ahmed Hassan',
      specialty: 'First-time Buyer Expert',
      rating: 4.8,
      isAvailable: true,
      languages: ['Arabic', 'English', 'French'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Maria Rodriguez',
      specialty: 'Lease & Subscription Plans',
      rating: 4.9,
      isAvailable: false,
      languages: ['English', 'Spanish'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  // Calculate financing options based on credit profile
  useEffect(() => {
    calculateFinancingOptions();
  }, [creditProfile, carPrice]);

  const calculateFinancingOptions = async () => {
    setIsCalculating(true);
    
    // Simulate AI-powered calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const options: FinancingOption[] = [
      {
        id: 'premium-loan',
        provider: 'Emirates NBD',
        type: 'loan',
        apr: calculateAPR('loan'),
        term: 60,
        monthlyPayment: calculateMonthlyPayment('loan', 60),
        totalCost: calculateTotalCost('loan', 60),
        downPayment: creditProfile.downPayment,
        features: ['No prepayment penalty', 'Gap insurance included', 'Extended warranty option'],
        rating: 4.8,
        processingTime: '24 hours',
        preApproved: creditProfile.score > 650
      },
      {
        id: 'flex-lease',
        provider: 'ADCB Auto Finance',
        type: 'lease',
        apr: calculateAPR('lease'),
        term: 36,
        monthlyPayment: calculateMonthlyPayment('lease', 36),
        totalCost: calculateTotalCost('lease', 36),
        downPayment: Math.round(carPrice * 0.1),
        features: ['Maintenance included', 'Upgrade option after 24 months', 'Insurance package'],
        rating: 4.6,
        processingTime: '48 hours',
        preApproved: creditProfile.score > 600
      },
      {
        id: 'subscription',
        provider: 'Pollux Flex',
        type: 'subscription',
        apr: 0,
        term: 12,
        monthlyPayment: Math.round(carPrice * 0.08),
        totalCost: Math.round(carPrice * 0.96),
        downPayment: 0,
        features: ['All-inclusive', 'Insurance & maintenance', 'Swap vehicles quarterly'],
        rating: 4.9,
        processingTime: '2 hours',
        preApproved: true
      }
    ];

    setFinancingOptions(options);
    setIsCalculating(false);
  };

  const calculateAPR = (type: string): number => {
    const baseRate = type === 'loan' ? 4.5 : type === 'lease' ? 3.8 : 0;
    const creditAdjustment = (750 - creditProfile.score) * 0.01;
    return Math.max(baseRate + creditAdjustment, 2.9);
  };

  const calculateMonthlyPayment = (type: string, term: number): number => {
    const principal = carPrice - creditProfile.downPayment;
    const apr = calculateAPR(type);
    const monthlyRate = apr / 100 / 12;
    
    if (type === 'lease') {
      // Simplified lease calculation
      return Math.round((principal * 0.6) / term);
    } else if (type === 'subscription') {
      return Math.round(carPrice * 0.08);
    } else {
      // Loan calculation
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                     (Math.pow(1 + monthlyRate, term) - 1);
      return Math.round(payment);
    }
  };

  const calculateTotalCost = (type: string, term: number): number => {
    const monthly = calculateMonthlyPayment(type, term);
    return (monthly * term) + creditProfile.downPayment;
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const applyForFinancing = async (optionId: string) => {
    setApplicationStatus('processing');
    setSelectedOption(optionId);
    
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const option = financingOptions.find(o => o.id === optionId);
    if (option?.preApproved) {
      setApplicationStatus('approved');
      toast.success('Congratulations! Your financing has been approved.');
    } else {
      setApplicationStatus('declined');
      toast.error('Application needs additional review. Our advisor will contact you.');
    }
  };

  const startVirtualMeeting = (advisor: VirtualAdvisor) => {
    if (!advisor.isAvailable) {
      toast.error(`${advisor.name} is currently unavailable. Please schedule an appointment.`);
      return;
    }
    setVirtualMeeting(true);
    toast.success(`Starting virtual meeting with ${advisor.name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Financing</h2>
            <p className="text-blue-100 mt-1">AI-powered financing solutions for {carName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Vehicle Price</p>
            <p className="text-3xl font-bold text-white">AED {carPrice.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="advisors">Virtual Advisors</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>

        {/* Financing Calculator */}
        <TabsContent value="calculator">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Credit Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="credit-score">Credit Score</Label>
                  <div className="mt-2">
                    <Slider
                      value={[creditProfile.score]}
                      onValueChange={(value) => 
                        setCreditProfile(prev => ({ ...prev, score: value[0] }))
                      }
                      max={850}
                      min={300}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>300</span>
                      <span className={getCreditScoreColor(creditProfile.score)}>
                        {creditProfile.score} - {getCreditScoreLabel(creditProfile.score)}
                      </span>
                      <span>850</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="income">Annual Income (AED)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={creditProfile.income}
                    onChange={(e) => 
                      setCreditProfile(prev => ({ ...prev, income: Number(e.target.value) }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="debt">Monthly Debt (AED)</Label>
                  <Input
                    id="debt"
                    type="number"
                    value={creditProfile.debt}
                    onChange={(e) => 
                      setCreditProfile(prev => ({ ...prev, debt: Number(e.target.value) }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="employment">Employment Status</Label>
                  <Select 
                    value={creditProfile.employment}
                    onValueChange={(value) => 
                      setCreditProfile(prev => ({ ...prev, employment: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time Employee</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="down-payment">Down Payment (AED)</Label>
                  <Input
                    id="down-payment"
                    type="number"
                    value={creditProfile.downPayment}
                    onChange={(e) => 
                      setCreditProfile(prev => ({ ...prev, downPayment: Number(e.target.value) }))
                    }
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: {Math.round(carPrice * 0.2).toLocaleString()} AED (20%)
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Quick Estimate
              </h3>
              
              {isCalculating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Calculating best options...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {financingOptions.slice(0, 2).map((option) => (
                    <div 
                      key={option.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{option.provider}</h4>
                          <Badge variant="outline" className="mt-1">
                            {option.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {option.monthlyPayment.toLocaleString()} AED
                          </p>
                          <p className="text-sm text-gray-500">per month</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">APR:</span>
                          <span className="ml-2 font-medium">{option.apr.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Term:</span>
                          <span className="ml-2 font-medium">{option.term} months</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Down Payment:</span>
                          <span className="ml-2 font-medium">{option.downPayment.toLocaleString()} AED</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Cost:</span>
                          <span className="ml-2 font-medium">{option.totalCost.toLocaleString()} AED</span>
                        </div>
                      </div>

                      {option.preApproved && (
                        <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pre-approved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Financing Options */}
        <TabsContent value="options">
          <div className="grid lg:grid-cols-3 gap-6">
            {financingOptions.map((option) => (
              <Card key={option.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{option.provider}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {option.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{option.rating}</span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {option.monthlyPayment.toLocaleString()} AED
                  </p>
                  <p className="text-gray-500">per month</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>APR:</span>
                    <span className="font-medium">{option.apr.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Term:</span>
                    <span className="font-medium">{option.term} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Down Payment:</span>
                    <span className="font-medium">{option.downPayment.toLocaleString()} AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Cost:</span>
                    <span className="font-medium">{option.totalCost.toLocaleString()} AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing:</span>
                    <span className="font-medium">{option.processingTime}</span>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full"
                  onClick={() => applyForFinancing(option.id)}
                  disabled={applicationStatus === 'processing' && selectedOption === option.id}
                >
                  {applicationStatus === 'processing' && selectedOption === option.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : option.preApproved ? (
                    'Get Pre-approved'
                  ) : (
                    'Apply Now'
                  )}
                </Button>

                {option.preApproved && (
                  <p className="text-xs text-green-600 text-center mt-2">
                    ✓ Pre-qualified based on your profile
                  </p>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Virtual Advisors */}
        <TabsContent value="advisors">
          <div className="grid lg:grid-cols-3 gap-6">
            {virtualAdvisors.map((advisor) => (
              <Card key={advisor.name} className="p-6">
                <div className="text-center mb-4">
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-bold text-lg">{advisor.name}</h3>
                  <p className="text-gray-500 text-sm">{advisor.specialty}</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{advisor.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      advisor.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      {advisor.isAvailable ? 'Available Now' : 'Busy'}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Languages:</p>
                    <p className="text-sm">{advisor.languages.join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => startVirtualMeeting(advisor)}
                    disabled={!advisor.isAvailable}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Video Call
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Application Status */}
        <TabsContent value="application">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Application Status</h3>
            
            <AnimatePresence mode="wait">
              {applicationStatus === 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Ready to Apply</h4>
                  <p className="text-gray-500 mb-4">
                    Choose a financing option to start your application
                  </p>
                  <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    View Options
                  </Button>
                </motion.div>
              )}

              {applicationStatus === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <h4 className="text-lg font-medium mb-2">Processing Application</h4>
                  <p className="text-gray-500 mb-4">
                    Our AI is reviewing your application and credit profile
                  </p>
                  <Progress value={75} className="w-64 mx-auto" />
                </motion.div>
              )}

              {applicationStatus === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2 text-green-600">
                    Congratulations! Approved
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Your financing has been approved. Next steps:
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Document verification</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm">Schedule vehicle delivery</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Handshake className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm">Complete final paperwork</span>
                    </div>
                  </div>
                  <Button className="mr-2">
                    Schedule Delivery
                  </Button>
                  <Button variant="outline">
                    Contact Advisor
                  </Button>
                </motion.div>
              )}

              {applicationStatus === 'declined' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2 text-red-600">
                    Additional Review Required
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Your application needs additional documentation. 
                    Our advisor will contact you within 24 hours.
                  </p>
                  <Button>
                    Speak with Advisor
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Virtual Meeting Modal */}
      <AnimatePresence>
        {virtualMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setVirtualMeeting(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Video className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Virtual Meeting</h3>
                <p className="text-gray-500 mb-6">
                  Connecting you with your financing advisor...
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center mb-4">
                  <p className="text-gray-500">Video call interface would appear here</p>
                </div>
                <Button onClick={() => setVirtualMeeting(false)}>
                  End Meeting
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartFinancing; 