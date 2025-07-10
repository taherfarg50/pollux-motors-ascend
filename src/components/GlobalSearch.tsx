import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  Clock, 
  Car, 
  User, 
  FileText, 
  TrendingUp,
  Command,
  ArrowRight,
  Loader2,
  Brain,
  Sparkles,
  Mic,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useCars } from '@/lib/supabase';
import { log } from '@/utils/logger';
import { perf } from '@/utils/performance';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'car' | 'page' | 'feature' | 'blog';
  url: string;
  metadata?: {
    price?: string;
    year?: string;
    brand?: string;
    author?: string;
    date?: string;
  };
  relevanceScore: number;
}

interface SearchFilters {
  category: string[];
  priceRange: [number, number] | null;
  yearRange: [number, number] | null;
  brands: string[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

interface AISearchSuggestion {
  text: string;
  type: 'semantic' | 'voice' | 'visual' | 'smart';
  confidence: number;
  metadata?: Record<string, unknown>;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  isOpen, 
  onClose, 
  placeholder = "Search vehicles, features, and more..." 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: null,
    yearRange: null,
    brands: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISearchSuggestion[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [smartMode, setSmartMode] = useState(true);
  
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { data: carsData } = useCars();
  const cars = useMemo(() => carsData?.cars || [], [carsData]);

  // Static data for other searchable content
  const staticContent = useMemo(() => [
    {
      id: 'home',
      title: 'Home',
      description: 'Discover luxury vehicles and automotive excellence',
      category: 'page' as const,
      url: '/',
      relevanceScore: 0.8
    },
    {
      id: 'about',
      title: 'About Pollux Motors',
      description: 'Learn about our story and commitment to luxury automotive excellence',
      category: 'page' as const,
      url: '/about',
      relevanceScore: 0.7
    },
    {
      id: 'interactive',
      title: 'Interactive Experience',
      description: '3D models, virtual tours, and immersive car experiences',
      category: 'feature' as const,
      url: '/interactive',
      relevanceScore: 0.9
    },
    {
      id: 'compare',
      title: 'Vehicle Comparison',
      description: 'Compare vehicles side-by-side with detailed specifications',
      category: 'feature' as const,
      url: '/compare',
      relevanceScore: 0.8
    },
    {
      id: 'chat',
      title: 'AI Assistant',
      description: 'Get personalized recommendations and answers from our AI assistant',
      category: 'feature' as const,
      url: '/chat',
      relevanceScore: 0.9
    }
  ], []);

  // Save recent search
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('pollux-recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    perf.trackInteraction('search-result-click', result.category, { 
      resultId: result.id,
      query 
    });
    
    saveRecentSearch(query);
    navigate(result.url);
    onClose();
  }, [query, navigate, onClose, saveRecentSearch]);

  // Handle search submission
  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    saveRecentSearch(searchQuery);
    // Navigate to cars page with search filter
    navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
    onClose();
  }, [navigate, onClose, saveRecentSearch]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pollux-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        log.warn('Failed to parse recent searches from localStorage', error, 'GlobalSearch');
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose, handleResultClick, handleSearch]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    perf.startMeasure('global-search');

    try {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      
      // Search cars
      const carResults: SearchResult[] = cars
        .filter(car => {
          const matchesQuery = 
            car.name.toLowerCase().includes(normalizedQuery) ||
            car.category.toLowerCase().includes(normalizedQuery) ||
            car.model?.toLowerCase().includes(normalizedQuery) ||
            car.year.toString().includes(normalizedQuery);

          // Apply filters
          if (filters.category.length > 0 && !filters.category.includes('car')) {
            return false;
          }
          
          // Price range filter
          if (filters.priceRange) {
            const carPrice = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
            if (carPrice < filters.priceRange[0] || carPrice > filters.priceRange[1]) {
              return false;
            }
          }
          
          // Year range filter
          if (filters.yearRange) {
            const carYear = parseInt(car.year);
            if (carYear < filters.yearRange[0] || carYear > filters.yearRange[1]) {
              return false;
            }
          }
          
          if (filters.brands.length > 0 && car.model) {
            if (!filters.brands.includes(car.model)) {
              return false;
            }
          }

          return matchesQuery;
        })
         .map(car => ({
           id: car.id.toString(),
           title: car.name,
           description: `${car.year} ${car.category} - ${car.price}`,
           category: 'car' as const,
           url: `/cars/${car.id}`,
           metadata: {
             price: car.price,
             year: car.year,
             brand: car.model
           },
           relevanceScore: calculateRelevanceScore(car.name, normalizedQuery)
         }));

      // Search static content
      const staticResults: SearchResult[] = staticContent
        .filter(item => {
          if (filters.category.length > 0 && !filters.category.includes(item.category)) {
            return false;
          }
          
          return (
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery)
          );
        })
        .map(item => ({
          ...item,
          relevanceScore: calculateRelevanceScore(
            `${item.title} ${item.description}`, 
            normalizedQuery
          )
        }));

      // Combine and sort results
      const allResults = [...carResults, ...staticResults]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10); // Limit to top 10 results

      setResults(allResults);
      setSelectedIndex(-1);

      log.info('Search completed', {
        query: searchQuery,
        resultCount: allResults.length,
        carResults: carResults.length,
        staticResults: staticResults.length
      }, 'GlobalSearch');

    } catch (error) {
      log.error('Search failed', error, 'GlobalSearch');
      setResults([]);
    } finally {
      setIsLoading(false);
      perf.endMeasure('global-search');
    }
  }, [cars, staticContent, filters]);

  // Debounced search effect
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Calculate relevance score
  const calculateRelevanceScore = (text: string, query: string): number => {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedText === normalizedQuery) return 1.0;
    if (normalizedText.startsWith(normalizedQuery)) return 0.9;
    if (normalizedText.includes(normalizedQuery)) return 0.7;
    
    // Calculate partial matches
    const words = normalizedQuery.split(' ');
    const matchedWords = words.filter(word => normalizedText.includes(word));
    return matchedWords.length / words.length * 0.5;
  };



  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pollux-recent-searches');
  };

  // Generate AI suggestions
  const generateAISuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !smartMode) {
      setAiSuggestions([]);
      return;
    }

    // Simulate AI-powered semantic suggestions
    const suggestions: AISearchSuggestion[] = [];
    
    // Semantic understanding
    const semanticMatches = [
      { keywords: ['luxury', 'premium', 'expensive'], suggestion: 'luxury vehicles under 500k AED', type: 'semantic' as const },
      { keywords: ['fast', 'speed', 'quick'], suggestion: 'sports cars with high performance', type: 'semantic' as const },
      { keywords: ['family', 'kids', 'children'], suggestion: 'family-friendly SUVs with safety features', type: 'semantic' as const },
      { keywords: ['electric', 'eco', 'green'], suggestion: 'electric and hybrid vehicles', type: 'semantic' as const },
      { keywords: ['compare', 'vs', 'versus'], suggestion: 'vehicle comparison tool', type: 'smart' as const },
    ];

    const lowerQuery = searchQuery.toLowerCase();
    semanticMatches.forEach(match => {
      if (match.keywords.some(keyword => lowerQuery.includes(keyword))) {
        suggestions.push({
          text: match.suggestion,
          type: match.type,
          confidence: 0.85,
          metadata: { original: searchQuery }
        });
      }
    });

    // Smart completions based on partial matches
    if (suggestions.length < 3) {
      const smartSuggestions = [
        'Mercedes-Benz luxury sedans',
        'BMW sports coupes',
        'Audi electric vehicles',
        'Porsche performance cars',
        'Tesla Model S variants'
      ].filter(s => s.toLowerCase().includes(lowerQuery.slice(0, 3)));

      smartSuggestions.forEach(suggestion => {
        suggestions.push({
          text: suggestion,
          type: 'smart',
          confidence: 0.75,
          metadata: { category: 'auto-complete' }
        });
      });
    }

    setAiSuggestions(suggestions.slice(0, 4));
  }, [smartMode]);

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    setIsVoiceActive(true);
    
    // Define SpeechRecognition interface
    interface ISpeechRecognition {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    }
    
    const SpeechRecognitionConstructor = (window as unknown as { 
      webkitSpeechRecognition?: new() => ISpeechRecognition;
      SpeechRecognition?: new() => ISpeechRecognition;
    }).webkitSpeechRecognition || (window as unknown as { 
      webkitSpeechRecognition?: new() => ISpeechRecognition;
      SpeechRecognition?: new() => ISpeechRecognition;
    }).SpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      alert('Speech recognition not available');
      setIsVoiceActive(false);
      return;
    }
    
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsVoiceActive(false);
    };

    recognition.onerror = () => {
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition.start();
  };

  // Generate AI suggestions effect
  useEffect(() => {
    generateAISuggestions(debouncedQuery);
  }, [debouncedQuery, generateAISuggestions]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'feature':
        return <TrendingUp className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'car':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'feature':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'page':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'blog':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-black/95 border-gray-800 backdrop-blur-xl">
        <DialogHeader className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0"
              autoComplete="off"
            />
            
            {/* AI Smart Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSmartMode(!smartMode)}
              className={`${smartMode ? 'text-purple-400' : 'text-gray-400'} hover:text-white`}
              title="Toggle AI Smart Search"
            >
              <Brain className="w-4 h-4" />
            </Button>

            {/* Voice Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              disabled={isVoiceActive}
              className={`${isVoiceActive ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
              title="Voice Search"
            >
              <Mic className={`w-4 h-4 ${isVoiceActive ? 'animate-pulse' : ''}`} />
            </Button>
            
            {/* Filters Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
            >
              <Filter className="w-4 h-4" />
            </Button>

            {/* Keyboard hint */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">
                <Command className="w-3 h-3" />
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">K</kbd>
            </div>
          </div>
        </DialogHeader>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-800 p-4 space-y-3"
            >
              <h4 className="text-sm font-medium text-white">Filters</h4>
              {/* Filter options would go here */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Category</label>
                  <select 
                    className="w-full text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1"
                    onChange={(e) => setFilters({...filters, category: e.target.value ? [e.target.value] : []})}
                  >
                    <option value="">All</option>
                    <option value="car">Vehicles</option>
                    <option value="feature">Features</option>
                    <option value="page">Pages</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Price Range</label>
                  <select 
                    className="w-full text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1"
                    onChange={(e) => {
                      const ranges = {
                        '': null,
                        'low': [0, 50000] as [number, number],
                        'mid': [50000, 150000] as [number, number],
                        'high': [150000, 999999] as [number, number]
                      };
                      setFilters({...filters, priceRange: ranges[e.target.value as keyof typeof ranges]});
                    }}
                  >
                    <option value="">Any Price</option>
                    <option value="low">Under $50K</option>
                    <option value="mid">$50K - $150K</option>
                    <option value="high">$150K+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Year</label>
                  <select 
                    className="w-full text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1"
                    onChange={(e) => {
                      const ranges = {
                        '': null,
                        'new': [2022, 2024] as [number, number],
                        'recent': [2018, 2024] as [number, number],
                        'older': [2010, 2017] as [number, number]
                      };
                      setFilters({...filters, yearRange: ranges[e.target.value as keyof typeof ranges]});
                    }}
                  >
                    <option value="">Any Year</option>
                    <option value="new">2022+</option>
                    <option value="recent">2018-2024</option>
                    <option value="older">2010-2017</option>
                  </select>
                </div>
                <div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setFilters({category: [], priceRange: null, yearRange: null, brands: []})}
                    className="text-xs mt-4"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Searching...</span>
            </div>
          ) : query && results.length > 0 ? (
            <div ref={resultsRef} className="py-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    selectedIndex === index 
                      ? 'bg-blue-500/10 border-l-2 border-blue-500' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${getCategoryColor(result.category)}`}>
                      {getCategoryIcon(result.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate">
                          {result.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(result.category)}`}
                        >
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {result.description}
                      </p>
                      {result.metadata && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          {result.metadata.price && (
                            <span>{result.metadata.price}</span>
                          )}
                          {result.metadata.year && (
                            <span>{result.metadata.year}</span>
                          )}
                          {result.metadata.brand && (
                            <span>{result.metadata.brand}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No results found for "{query}"</p>
              <p className="text-sm text-gray-500">Try different keywords or check your spelling</p>
            </div>
          ) : !query && recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  Clear
                </Button>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => setQuery(search)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{search}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">Start typing to search</p>
              <p className="text-sm text-gray-500">Find vehicles, features, and more</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Use ↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>ESC to close</span>
            </div>
            <span>Powered by Pollux Search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch; 