// Categories for projects
export const categories = [
  {
    id: 'cat001',
    name: 'Web Development',
    slug: 'web-development',
    icon: 'Globe',
    description: 'Full-stack web applications, websites, and web services',
    color: '#4F46E5'
  },
  {
    id: 'cat002',
    name: 'Mobile Development',
    slug: 'mobile-development',
    icon: 'Smartphone',
    description: 'iOS and Android mobile applications',
    color: '#7C3AED'
  },
  {
    id: 'cat003',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    icon: 'Brain',
    description: 'Artificial intelligence, machine learning, and data science projects',
    color: '#06B6D4'
  },
  {
    id: 'cat004',
    name: 'IoT & Embedded Systems',
    slug: 'iot-embedded',
    icon: 'Cpu',
    description: 'Internet of Things devices and embedded system projects',
    color: '#10B981'
  },
  {
    id: 'cat005',
    name: 'Game Development',
    slug: 'game-development',
    icon: 'Gamepad2',
    description: 'Video games, game engines, and interactive entertainment',
    color: '#F59E0B'
  },
  {
    id: 'cat006',
    name: 'Desktop Applications',
    slug: 'desktop-apps',
    icon: 'Monitor',
    description: 'Windows, macOS, and Linux desktop applications',
    color: '#EF4444'
  },
  {
    id: 'cat007',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    icon: 'Shield',
    description: 'Security tools, encryption, and vulnerability research',
    color: '#8B5CF6'
  },
  {
    id: 'cat008',
    name: 'Data Analytics',
    slug: 'data-analytics',
    icon: 'BarChart3',
    description: 'Data visualization, business intelligence, and analytics platforms',
    color: '#EC4899'
  }
];

export const getCategoryById = (id) => categories.find(cat => cat.id === id);
export const getCategoryBySlug = (slug) => categories.find(cat => cat.slug === slug);
