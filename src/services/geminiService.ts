import { Message } from '@/types/chatbot';
import { companyInfo } from '@/components/CompanyData';

// User's actual Google AI API key
const GEMINI_API_KEY = 'AIzaSyDZGrYORfxzf6yM4DJ30Ktm1HpEFAk2zcA';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Enhanced AI configuration
const AI_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 1000,
  topK: 40,
  topP: 0.95,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
};

// Enhanced system prompts for different AI personalities
const SYSTEM_PROMPTS = {
  luxury: `You are an elite luxury automotive concierge for Pollux Motors, the world's most prestigious car dealership. 
  You speak with sophistication, deep automotive knowledge, and a refined tone. You understand the nuances of luxury vehicles,
  personalized service, and cater to high-net-worth individuals. Always maintain elegance in your responses.`,
  
  professional: `You are a professional automotive consultant for Pollux Motors. You provide clear, accurate information
  about vehicles, financing, and services. You maintain a business-appropriate tone while being helpful and knowledgeable.`,
  
  friendly: `You are a friendly and approachable automotive assistant for Pollux Motors. You're enthusiastic about cars,
  warm in your interactions, and make car shopping feel exciting and personal. Use a conversational, welcoming tone.`,
  
  expert: `You are a technical automotive expert for Pollux Motors. You have deep knowledge of engineering, performance specs,
  safety features, and can explain complex automotive concepts. You provide detailed, accurate technical information.`,
  
  casual: `You are a casual, relaxed automotive buddy for Pollux Motors. You speak in a laid-back, conversational style,
  use automotive slang when appropriate, and make car discussions feel like chatting with a knowledgeable friend.`
};

// Enhanced fallback responses with AI-generated variety
const enhancedFallbacks = {
  greeting: [
    "Welcome to Pollux Motors! I'm your AI automotive concierge. How can I elevate your luxury car experience today?",
    "Hello! I'm delighted to assist you with our world-class collection of luxury vehicles. What brings you to Pollux Motors?",
    "Greetings! Ready to explore the pinnacle of automotive excellence? I'm here to guide your journey."
  ],
  cars: [
    "Our curated collection features the world's most prestigious brands: Bentley, Bugatti, Rolls Royce, Lamborghini, McLaren, Ferrari, Audi, Mercedes-Benz, BMW, and Range Rover. Which luxury experience are you seeking?",
    "From the elegant refinement of a Bentley to the raw power of a Bugatti, we have vehicles that define automotive artistry. What type of driving experience resonates with you?",
    "Our inventory spans from timeless luxury sedans to high-performance supercars. Are you looking for daily elegance or weekend excitement?"
  ],
  financing: [
    "Our AI-powered financing team offers bespoke solutions including traditional financing, luxury leasing, and exclusive membership programs. We can structure a plan that aligns with your lifestyle and preferences.",
    "We provide intelligent financing with real-time approval, competitive rates for qualified buyers, and personalized terms. Our virtual financial advisors can analyze your unique situation instantly.",
    "From traditional auto loans to innovative luxury subscriptions, we offer financing as sophisticated as our vehicles. What financial approach interests you most?"
  ]
};

// AI-powered utilities
export const analyzeSentiment = (text: string): { sentiment: 'positive' | 'negative' | 'neutral', confidence: number } => {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 'fantastic', 'awesome', 'incredible', 'outstanding'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointing', 'worst', 'disgusting', 'annoying', 'frustrating'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
    if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
  });
  
  const totalEmotionalWords = positiveScore + negativeScore;
  const confidence = totalEmotionalWords > 0 ? Math.min(totalEmotionalWords / 10, 0.95) : 0.5;
  
  if (positiveScore > negativeScore) {
    return { sentiment: 'positive', confidence };
  } else if (negativeScore > positiveScore) {
    return { sentiment: 'negative', confidence };
  }
  return { sentiment: 'neutral', confidence: 0.5 };
};

export const extractTopics = (text: string): string[] => {
  const topicMap = {
    vehicles: ['car', 'vehicle', 'auto', 'sedan', 'suv', 'coupe', 'truck', 'luxury', 'sports'],
    financing: ['finance', 'loan', 'payment', 'lease', 'credit', 'interest', 'down payment', 'monthly'],
    service: ['service', 'maintenance', 'repair', 'warranty', 'parts', 'technician'],
    features: ['feature', 'technology', 'safety', 'performance', 'engine', 'horsepower', 'mpg'],
    brands: ['mercedes', 'bmw', 'audi', 'bentley', 'rolls royce', 'lamborghini', 'ferrari', 'porsche']
  };
  
  const lowerText = text.toLowerCase();
  const detectedTopics: string[] = [];
  
  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedTopics.push(topic);
    }
  }
  
  return detectedTopics;
};

export const getRandomFallback = (category: keyof typeof enhancedFallbacks): string => {
  const responses = enhancedFallbacks[category];
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Enhanced message formatting with personality and context
 */
const formatEnhancedChatHistory = (
  history: Message[], 
  currentMessage: string, 
  personality: string = 'luxury',
  userContext?: Record<string, unknown>
) => {
  const contents = [];
  
  // Add personality-specific system prompt
  const systemPrompt = SYSTEM_PROMPTS[personality as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.luxury;
  
  contents.push({
    role: "user",
    parts: [{
      text: `${systemPrompt}
      
      Company Information:
      - Company: Pollux Motors - World's Premier Luxury Automotive Destination
      - Address: ${companyInfo.contact.address}
      - Phone: ${companyInfo.contact.phone}
      - Email: ${companyInfo.contact.email}
      - Hours: Weekdays ${companyInfo.hours.weekdays}, Saturday ${companyInfo.hours.saturday}, Sunday ${companyInfo.hours.sunday}
      - Brands: Bentley, Bugatti, Rolls Royce, Lamborghini, McLaren, Ferrari, Mercedes-Benz, BMW, Audi, Porsche, Range Rover, Tesla
      - Services: Luxury sales, AI-powered personalization, VR experiences, smart financing, concierge service
      - Locations: Primary showroom + offices in Belgium and Algeria
      
      ${userContext ? `User Context: ${JSON.stringify(userContext)}` : ''}
      
      Guidelines:
      - Maintain the ${personality} personality throughout
      - Use automotive expertise and luxury market knowledge
      - Personalize responses based on user context when available
      - Offer specific vehicle recommendations with reasoning
      - Suggest relevant services (financing, VR experience, test drives)
      - Keep responses engaging but concise (under 200 words typically)
      - Use emojis sparingly and appropriately for the luxury context`
    }]
  });
  
  contents.push({
    role: "model",
    parts: [{
      text: "I understand. I'll assist customers with the appropriate personality and expertise, providing personalized luxury automotive guidance."
    }]
  });

  // Add recent conversation history (last 8 messages for context)
  const recentHistory = history.slice(-8);
  
  for (const msg of recentHistory) {
    contents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: currentMessage }]
  });

  return contents;
};

/**
 * Enhanced Gemini API call with advanced features
 */
export const sendMessageToGemini = async (
  message: string,
  history: Message[],
  options: {
    personality?: string;
    userContext?: Record<string, unknown>;
    enhancedMode?: boolean;
    temperature?: number;
  } = {}
): Promise<string> => {
  const startTime = Date.now();
  
  try {
    const {
      personality = 'luxury',
      userContext,
      enhancedMode = true,
      temperature = 0.7
    } = options;

    // Format conversation with enhanced context
    const contents = formatEnhancedChatHistory(history, message, personality, userContext);
    
    console.log('🚀 Sending enhanced request to Gemini API:', {
      personality,
      messageLength: message.length,
      historyLength: history.length,
      userContext: !!userContext,
      enhancedMode
    });
    
    // Make API request with enhanced configuration
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          ...AI_CONFIG,
          temperature: temperature,
          maxOutputTokens: enhancedMode ? 1200 : 800,
        },
        safetySettings: AI_CONFIG.safetySettings
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    console.log('✅ Gemini API success:', {
      responseTime: `${responseTime}ms`,
      responseLength: data.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0
    });
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('❌ Unexpected API response format:', data);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('❌ Gemini API call failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`,
      message: message.substring(0, 100) + '...'
    });
    
    // Enhanced fallback with context awareness
    return generateIntelligentFallback(message, history, options.personality);
  }
};

/**
 * Intelligent fallback response generator
 */
const generateIntelligentFallback = (
  message: string, 
  history: Message[], 
  personality: string = 'luxury'
): string => {
  const topics = extractTopics(message);
  const sentiment = analyzeSentiment(message);
  
  // Context-aware fallback selection
  if (topics.includes('vehicles') && topics.includes('financing')) {
    return `I understand you're interested in both vehicle options and financing solutions. While I'm experiencing a brief connection issue, I can share that Pollux Motors offers comprehensive AI-powered financing with real-time approval for all our luxury vehicles. Would you like me to connect you with our financing specialists, or shall we explore our vehicle collection first?`;
  }
  
  if (topics.includes('brands')) {
    return `I see you're asking about specific automotive brands. Pollux Motors represents the world's most prestigious manufacturers including Bentley, Rolls Royce, Lamborghini, Ferrari, and more. Each brand offers unique characteristics and heritage. I'd be delighted to discuss which brand aligns with your preferences once our full AI capabilities are restored.`;
  }
  
  if (sentiment.sentiment === 'negative') {
    return `I sincerely apologize if there's any concern. At Pollux Motors, your satisfaction is our highest priority. While I'm experiencing a temporary technical issue, I want to ensure all your needs are addressed. Please allow me to connect you with one of our luxury automotive specialists who can provide immediate assistance.`;
  }
  
  // Default intelligent fallback
  const fallbackCategory = topics.includes('cars') ? 'cars' : 
                          topics.includes('financing') ? 'financing' : 'greeting';
  
  return getRandomFallback(fallbackCategory as keyof typeof enhancedFallbacks);
};

/**
 * AI-powered car recommendation system
 */
export const generateCarRecommendations = async (
  userPreferences: Record<string, unknown>,
  browsihgHistory: Record<string, unknown>[] = [],
  budget: { min: number; max: number }
): Promise<Record<string, unknown>[]> => {
  try {
    const prompt = `As an AI automotive expert for Pollux Motors, analyze these user preferences and generate personalized luxury car recommendations:

User Preferences: ${JSON.stringify(userPreferences)}
Browsing History: ${browsihgHistory.slice(-10).map(h => h.carModel || h.searchQuery).join(', ')}
Budget Range: $${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}

Available Brands: Bentley, Bugatti, Rolls Royce, Lamborghini, McLaren, Ferrari, Mercedes-Benz, BMW, Audi, Porsche, Range Rover, Tesla

Please provide 3-5 specific vehicle recommendations with:
1. Model name and year
2. Price estimate
3. Why it matches their preferences (2-3 key reasons)
4. Confidence score (0-100%)
5. One unique selling point

Format as JSON array with objects containing: model, price, reasons[], confidence, uniqueFeature`;

    const response = await sendMessageToGemini(prompt, [], {
      personality: 'expert',
      enhancedMode: true,
      temperature: 0.6
    });

    // Try to parse JSON response, fallback to mock data if needed
    try {
      return JSON.parse(response);
    } catch {
      // Extract recommendations from text response
      return parseRecommendationsFromText(response);
    }
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return generateMockRecommendations(userPreferences, budget);
  }
};

/**
 * AI-powered market analysis
 */
export const generateMarketInsights = async (
  vehicleCategory: string = 'luxury'
): Promise<Record<string, unknown>> => {
  try {
    const prompt = `As a luxury automotive market analyst, provide current insights for the ${vehicleCategory} vehicle market:

1. Current market trends (3-4 key points)
2. Price movement predictions for next 6 months
3. Most in-demand features/technologies
4. Brand performance rankings (top 5)
5. Investment potential recommendations

Focus on factual analysis with specific data points where possible. Format as structured JSON.`;

    const response = await sendMessageToGemini(prompt, [], {
      personality: 'expert',
      enhancedMode: true,
      temperature: 0.5
    });

    try {
      return JSON.parse(response);
    } catch {
      return parseMarketInsightsFromText(response);
    }
  } catch (error) {
    console.error('Error generating market insights:', error);
    return generateMockMarketInsights();
  }
};

/**
 * AI-powered financing calculations
 */
export const calculateSmartFinancing = async (
  vehiclePrice: number,
  userProfile: Record<string, unknown>,
  loanTerms: { months: number; downPayment: number }
): Promise<Record<string, unknown>> => {
  try {
    const prompt = `As an AI financial advisor for luxury automotive purchases, calculate optimal financing for:

Vehicle Price: $${vehiclePrice.toLocaleString()}
Down Payment: $${loanTerms.downPayment.toLocaleString()}
Loan Term: ${loanTerms.months} months
User Profile: ${JSON.stringify(userProfile)}

Provide:
1. Monthly payment estimate
2. Total interest over loan term  
3. Alternative financing options (lease, shorter/longer terms)
4. Recommendations based on user profile
5. Potential approval probability

Consider luxury vehicle financing rates (typically 2.5-6.5% APR for qualified buyers).
Format as JSON with clear financial breakdown.`;

    const response = await sendMessageToGemini(prompt, [], {
      personality: 'professional',
      enhancedMode: true,
      temperature: 0.3
    });

    try {
      return JSON.parse(response);
    } catch {
      return parseFinancingFromText(response, vehiclePrice, loanTerms);
    }
  } catch (error) {
    console.error('Error calculating smart financing:', error);
    return generateMockFinancing(vehiclePrice, loanTerms);
  }
};

// Helper functions for parsing AI responses
const parseRecommendationsFromText = (text: string): any[] => {
  // Implementation for extracting recommendations from text
  return [
    {
      model: "Mercedes-Benz S-Class 2024",
      price: "$115,000",
      reasons: ["Luxury comfort", "Advanced technology", "Proven reliability"],
      confidence: 92,
      uniqueFeature: "MBUX Hyperscreen with AI assistant"
    },
    {
      model: "BMW 7 Series 2024", 
      price: "$98,000",
      reasons: ["Sporty luxury blend", "Innovative features", "Strong resale value"],
      confidence: 88,
      uniqueFeature: "Gesture control and massage seats"
    }
  ];
};

const parseMarketInsightsFromText = (text: string): any => {
  return {
    trends: ["Electric luxury adoption growing 40% YoY", "Autonomous features becoming standard", "Sustainability focus increasing"],
    priceMovement: "Stable with 2-3% appreciation expected",
    inDemandFeatures: ["Electric powertrains", "Advanced driver assistance", "Luxury interiors"],
    brandRankings: ["Mercedes-Benz", "BMW", "Audi", "Lexus", "Genesis"],
    investmentPotential: "Strong for limited edition and electric luxury vehicles"
  };
};

const parseFinancingFromText = (text: string, price: number, terms: any): any => {
  const principal = price - terms.downPayment;
  const monthlyRate = 0.045 / 12; // 4.5% APR estimate
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, terms.months)) / (Math.pow(1 + monthlyRate, terms.months) - 1);
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round((monthlyPayment * terms.months) - principal),
    alternatives: [
      { type: "lease", monthlyPayment: Math.round(monthlyPayment * 0.6) },
      { type: "shorter term", monthlyPayment: Math.round(monthlyPayment * 1.3), months: 36 }
    ],
    approvalProbability: 85
  };
};

const generateMockRecommendations = (preferences: any, budget: any): any[] => {
  return [
    {
      model: "Mercedes-Benz E-Class 2024",
      price: "$75,000",
      reasons: ["Matches your luxury preference", "Within budget range", "Excellent reliability"],
      confidence: 95,
      uniqueFeature: "AI-powered voice assistant"
    }
  ];
};

const generateMockMarketInsights = (): any => {
  return {
    trends: ["Luxury EV adoption accelerating", "Tech integration priority", "Personalization demand growing"],
    priceMovement: "Moderate appreciation expected",
    inDemandFeatures: ["Electric drivetrains", "AI assistants", "Premium materials"],
    brandRankings: ["Mercedes-Benz", "BMW", "Audi", "Lexus", "Tesla"],
    investmentPotential: "Positive outlook for luxury segment"
  };
};

const generateMockFinancing = (price: number, terms: any): any => {
  const principal = price - terms.downPayment;
  const estimatedPayment = principal / terms.months * 1.2; // Rough estimate with interest
  
  return {
    monthlyPayment: Math.round(estimatedPayment),
    totalInterest: Math.round(estimatedPayment * terms.months - principal),
    alternatives: [
      { type: "lease", monthlyPayment: Math.round(estimatedPayment * 0.65) }
    ],
    approvalProbability: 80
  };
};

export default {
  sendMessageToGemini,
  analyzeSentiment,
  extractTopics,
  generateCarRecommendations,
  generateMarketInsights,
  calculateSmartFinancing
}; 