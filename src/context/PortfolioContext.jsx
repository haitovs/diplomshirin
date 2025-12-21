import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PortfolioContext = createContext();

const STORAGE_KEY = 'portfolio_builder_data';

// Default empty portfolio structure
const defaultPortfolio = {
  basics: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    avatar: ''
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  languages: [],
  socialLinks: [],
  settings: {
    template: 'modern',
    primaryColor: '#4F46E5',
    showPhoto: true
  }
};

// Sample portfolio for demo/inspiration
const samplePortfolio = {
  basics: {
    name: 'Shirin Mamedova',
    title: 'Full-Stack Developer',
    email: 'shirin.mamedova@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate full-stack developer with 3+ years of experience building modern web applications. Specialized in React, Node.js, and cloud technologies. Graduate of Computer Science with a focus on creating user-friendly, scalable solutions.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shirin'
  },
  skills: [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 88 },
    { name: 'Python', level: 75 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'AWS', level: 70 },
    { name: 'Docker', level: 72 }
  ],
  projects: [
    {
      id: 'proj1',
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with real-time inventory, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      url: 'https://github.com/example/ecommerce',
      image: 'https://picsum.photos/seed/ecom/800/600'
    },
    {
      id: 'proj2',
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, team workspaces, and integrations.',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      url: 'https://github.com/example/taskapp',
      image: 'https://picsum.photos/seed/task/800/600'
    },
    {
      id: 'proj3',
      title: 'AI Image Generator',
      description: 'Web application that uses machine learning to generate artistic images from text descriptions.',
      technologies: ['Python', 'FastAPI', 'React', 'TensorFlow'],
      url: 'https://github.com/example/ai-image',
      image: 'https://picsum.photos/seed/ai/800/600'
    }
  ],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Innovators Inc.',
      role: 'Senior Full-Stack Developer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: 'Lead development of customer-facing web applications. Mentored junior developers and implemented CI/CD pipelines.'
    },
    {
      id: 'exp2',
      company: 'StartupXYZ',
      role: 'Full-Stack Developer',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      description: 'Built and maintained React applications. Developed RESTful APIs and integrated third-party services.'
    },
    {
      id: 'exp3',
      company: 'University IT Department',
      role: 'Junior Developer (Part-time)',
      startDate: '2019-01',
      endDate: '2020-05',
      current: false,
      description: 'Developed internal tools and maintained university web portals while completing degree.'
    }
  ],
  education: [
    {
      id: 'edu1',
      school: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2020',
      gpa: '3.8'
    }
  ],
  certifications: [
    { id: 'cert1', name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2023' },
    { id: 'cert2', name: 'React Developer Certification', issuer: 'Meta', year: '2022' }
  ],
  languages: [
    { id: 'lang1', name: 'English', level: 'Native' },
    { id: 'lang2', name: 'Spanish', level: 'Intermediate' },
    { id: 'lang3', name: 'Russian', level: 'Native' }
  ],
  socialLinks: [
    { id: 'social1', platform: 'GitHub', url: 'https://github.com/shirindev' },
    { id: 'social2', platform: 'LinkedIn', url: 'https://linkedin.com/in/shirindev' },
    { id: 'social3', platform: 'Twitter', url: 'https://twitter.com/shirindev' },
    { id: 'social4', platform: 'Portfolio', url: 'https://shirin.dev' }
  ],
  settings: {
    template: 'modern',
    primaryColor: '#4F46E5',
    showPhoto: true
  }
};

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved portfolio:', e);
        }
      }
    }
    // Return sample portfolio for demo
    return samplePortfolio;
  });

  const [activeSection, setActiveSection] = useState('basics');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save to localStorage whenever portfolio changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  // Update a specific section
  const updateSection = useCallback((section, data) => {
    setPortfolio(prev => ({
      ...prev,
      [section]: data
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update basics
  const updateBasics = useCallback((updates) => {
    setPortfolio(prev => ({
      ...prev,
      basics: { ...prev.basics, ...updates }
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update settings
  const updateSettings = useCallback((updates) => {
    setPortfolio(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  }, []);

  // Add item to array section
  const addItem = useCallback((section, item) => {
    const newItem = { ...item, id: `${section}_${Date.now()}` };
    setPortfolio(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
    setHasUnsavedChanges(true);
    return newItem;
  }, []);

  // Update item in array section
  const updateItem = useCallback((section, id, updates) => {
    setPortfolio(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Remove item from array section
  const removeItem = useCallback((section, id) => {
    setPortfolio(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Reorder items in array section
  const reorderItems = useCallback((section, fromIndex, toIndex) => {
    setPortfolio(prev => {
      const items = [...prev[section]];
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return { ...prev, [section]: items };
    });
    setHasUnsavedChanges(true);
  }, []);

  // Reset to default empty portfolio
  const resetPortfolio = useCallback(() => {
    setPortfolio(defaultPortfolio);
    setHasUnsavedChanges(false);
  }, []);

  // Load sample portfolio
  const loadSamplePortfolio = useCallback(() => {
    setPortfolio(samplePortfolio);
    setHasUnsavedChanges(false);
  }, []);

  // Export portfolio data as JSON
  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${portfolio.basics.name || 'portfolio'}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [portfolio]);

  // Import portfolio from JSON
  const importJSON = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      setPortfolio(data);
      setHasUnsavedChanges(true);
      return true;
    } catch (e) {
      console.error('Failed to import portfolio:', e);
      return false;
    }
  }, []);

  const value = {
    portfolio,
    setPortfolio,
    activeSection,
    setActiveSection,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    
    // Section operations
    updateSection,
    updateBasics,
    updateSettings,
    
    // Item operations
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    
    // Portfolio operations
    resetPortfolio,
    loadSamplePortfolio,
    exportJSON,
    importJSON,
    
    // Constants
    defaultPortfolio,
    samplePortfolio
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

export default PortfolioContext;
