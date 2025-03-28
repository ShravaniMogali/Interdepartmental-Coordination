import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { 
  Menu, X, User, LogOut, Building2, BarChart3, 
  Network, MessageSquare, Users2, Brain, Calendar,
  ChevronRight, Bell, Search, Settings, Sun, Moon,
  AlertTriangle, Wrench, Wallet, FileText
} from 'lucide-react';
import Home from './components/Home';
import Projects from './components/Projects';
import Resources from './components/Resources';
import Forum from './components/Forum';
import Chat from './components/Chat';
import ProjectDetails from './components/ProjectDetails';
import AIFeatures from './components/AIFeatures';
import DocumentsDashboard from './components/documents/DocumentsDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const menuItems = [
  { 
    path: '/', 
    icon: Building2, 
    text: 'Dashboard',
    description: 'Overview and key metrics'
  },
  { 
    path: '/projects', 
    icon: BarChart3, 
    text: 'Projects',
    description: 'Manage and track projects'
  },
  { 
    path: '/documents', 
    icon: FileText, 
    text: 'Documents',
    description: 'Document management system'
  },
  { 
    path: '/resources', 
    icon: Network, 
    text: 'Resources',
    description: 'Resource allocation and tracking'
  },
  { 
    path: '/forum', 
    icon: Users2, 
    text: 'Forum',
    description: 'Department discussions'
  },
  { 
    path: '/chat', 
    icon: MessageSquare, 
    text: 'Chat',
    description: 'Real-time communication'
  }
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white text-lg font-medium">Loading CityConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-slate-100'}`}>
      {user ? (
        <div className="flex h-screen">
          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{ width: isMenuOpen ? '320px' : '80px' }}
            className="bg-white dark:bg-slate-800 shadow-lg z-20 relative border-r border-slate-200 dark:border-slate-700"
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <motion.div
            
                animate={{ opacity: isMenuOpen ? 1 : 0}}
                className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                CityConnect
              </motion.div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {isMenuOpen ? <X size={15} /> : <Menu size={24} />}
              </button>
            </div>

            <nav className="mt-6 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <item.icon size={24} className={`transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                  <motion.div
                    animate={{ opacity: isMenuOpen ? 1 : 0 }}
                    className="ml-4 overflow-hidden"     
                  >
                    
                    <div className="font-medium">{item.text}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {item.description}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ opacity: isMenuOpen ? 0 : 1 }}
                  
                    >
                     <div className=""></div>

                      <item.icon size={24} className={`transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-indigo-900 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />

                    </motion.div>

                  {!isMenuOpen && location.pathname === item.path && (
                    <div className="w-1 h-8 bg-indigo-600 dark:bg-indigo-400 absolute right-0 rounded-l-full" />
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
          
            

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-800 h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10">
              <div className="flex items-center flex-1 max-w-2xl">
                {/* <div className="relative flex-1 max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400 dark:text-slate-500" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects, resources, or departments..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div> */}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="text-yellow-500" size={24} /> : <Moon className="text-slate-700" size={24} />}
                </button>
                <button 
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
                  title="Notifications"
                >
                  <Bell size={24} className="text-slate-700 dark:text-slate-300" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button 
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Settings"
                >
                  <Settings size={24} className="text-slate-700 dark:text-slate-300" />
                </button>
                <div className="h-8 mx-2 w-px bg-slate-200 dark:bg-slate-700"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full max-w-[1600px] mx-auto px-6 py-8"
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                   
                    <Route path="/projects" element={<Projects />} />
                    
                    <Route path="/documents" element={<DocumentsDashboard />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/chat" element={<Chat />} />
                    
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      setError(error.message);
    }
  };

  if (auth.currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <Building2 className="text-indigo-400 h-8 w-8" />
            <h1 className="text-3xl font-bold text-white ml-3">CityConnect</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-indigo-200 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-indigo-300 border border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-indigo-200 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-indigo-300 border border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-500"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1c2e] text-indigo-300">Or continue with</span>
            </div>
          </div>

          <motion.button
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google
          </motion.button>

          <p className="mt-8 text-center text-indigo-200">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      setError(error.message);
    }
  };

  if (auth.currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <Building2 className="text-indigo-400 h-8 w-8" />
            <h1 className="text-3xl font-bold text-white ml-3">CityConnect</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-indigo-200 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-indigo-300 border border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-indigo-200 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-indigo-300 border border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                placeholder="Choose a password"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-500"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1c2e] text-indigo-300">Or continue with</span>
            </div>
          </div>

          <motion.button
            onClick={handleGoogleRegister}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google
          </motion.button>

          <p className="mt-8 text-center text-indigo-200">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;