import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signIn, signUp, user, loading, error } = useAuth();
  const location = useLocation();
  
  // Determine initial tab based on URL path
  const getInitialTab = () => {
    const path = location.pathname.toLowerCase();
    if (path === '/signup') return 'signup';
    return 'signin'; // Default to signin for /signin, /login, /auth, etc.
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Check for redirect hash fragment on mount
  useEffect(() => {
    // Check if this is a redirect back from Supabase auth
    if (location.hash.includes('access_token')) {
      setSuccessMessage('Email verified successfully! You can now sign in.');
      setActiveTab('signin');
    }
    
    // Update tab when URL changes
    const path = location.pathname.toLowerCase();
    if (path === '/signup') {
      setActiveTab('signup');
    } else if (path === '/signin' || path === '/login') {
      setActiveTab('signin');
    }
  }, [location]);
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    try {
      await signIn(email, password);
    } catch (error) {
      // Error is handled in AuthContext
      console.error("Login error:", error);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    try {
      await signUp(email, password);
      setSuccessMessage('Account created! Please check your email to verify your account.');
    } catch (error) {
      // Error is handled in AuthContext
      console.error("Signup error:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pollux-dark-gray to-black text-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-pollux-blue/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-pollux-gold/5 blur-3xl"></div>
      
      <main className="pt-28 pb-16 px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Welcome to Pollux Motors</h1>
            <p className="text-gray-300">Access your account to save favorites and receive updates on luxury vehicles</p>
          </motion.div>
          
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert className="border-pollux-green/30 bg-pollux-green/5 text-pollux-green">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 glass-card">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card className="glass-card border border-pollux-glass-border">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Sign in to access your account and saved vehicles.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-pollux-dark-gray/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        <a href="#" className="text-xs text-pollux-blue hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="bg-pollux-dark-gray/60 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-pollux-blue hover:bg-blue-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-pulse mr-2">•••</span>
                          Signing In
                        </>
                      ) : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="glass-card border border-pollux-glass-border">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Create your account to save favorite vehicles and get updates.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-pollux-dark-gray/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="bg-pollux-dark-gray/60 pr-10"
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with a mix of letters, numbers, and symbols.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-pollux-blue hover:bg-blue-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-pulse mr-2">•••</span>
                          Creating Account
                        </>
                      ) : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Auth;
