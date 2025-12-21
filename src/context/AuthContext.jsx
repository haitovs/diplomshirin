import { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock user for admin
const MOCK_ADMIN = {
  id: 'admin001',
  username: 'admin',
  email: 'admin@university.edu',
  name: 'System Administrator',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
};

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved session
    const saved = localStorage.getItem('portfolio-auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      setUser(MOCK_ADMIN);
      localStorage.setItem('portfolio-auth', JSON.stringify(MOCK_ADMIN));
      setIsLoading(false);
      return { success: true };
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('portfolio-auth');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
