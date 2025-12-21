// Mock projects data
export const projects = [
  {
    id: 'p001',
    title: 'Smart Campus Navigation System',
    slug: 'smart-campus-navigation',
    description: 'An interactive mobile app for navigating university campus with indoor mapping and real-time directions.',
    fullDescription: `The Smart Campus Navigation System is a comprehensive mobile application designed to help students, faculty, and visitors navigate the university campus efficiently.

Key Features:
• Real-time indoor navigation with step-by-step directions
• Building floor plans with room search functionality
• Integration with class schedules for automatic routing
• Accessibility features for users with disabilities
• AR-powered navigation for enhanced experience
• Offline mode support with cached maps

The application uses a combination of Bluetooth beacons, WiFi fingerprinting, and GPS for accurate positioning both indoors and outdoors. The backend is built with Node.js and MongoDB, handling real-time updates and user data synchronization.`,
    studentId: 's001',
    categoryId: 'cat002',
    year: 2024,
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Bluetooth Beacons', 'MapBox'],
    screenshots: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'
    ],
    demoUrl: 'https://demo.smartcampus.example.com',
    githubUrl: 'https://github.com/shirin-mamedova/smart-campus-nav',
    documentationUrl: 'https://docs.smartcampus.example.com',
    featured: true,
    rating: 4.8,
    views: 1250,
    createdAt: '2024-05-15'
  },
  {
    id: 'p002',
    title: 'E-Commerce Platform with AI Recommendations',
    slug: 'ecommerce-ai-recommendations',
    description: 'A full-featured online shopping platform with machine learning-powered product recommendations.',
    fullDescription: `This e-commerce platform leverages artificial intelligence to provide personalized shopping experiences. The recommendation engine analyzes user behavior, purchase history, and browsing patterns to suggest relevant products.

Technical Highlights:
• React-based responsive frontend with modern UI/UX
• Django REST Framework backend with PostgreSQL
• TensorFlow-based recommendation engine
• Real-time inventory management
• Secure payment integration with Stripe
• Admin dashboard for store management

The AI recommendation system uses collaborative filtering and content-based filtering techniques to achieve 40% improvement in user engagement compared to random recommendations.`,
    studentId: 's001',
    categoryId: 'cat001',
    year: 2024,
    technologies: ['React', 'Django', 'PostgreSQL', 'TensorFlow', 'Stripe', 'Redis'],
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'
    ],
    demoUrl: 'https://demo.aicommerce.example.com',
    githubUrl: 'https://github.com/shirin-mamedova/ai-ecommerce',
    documentationUrl: null,
    featured: true,
    rating: 4.6,
    views: 980,
    createdAt: '2024-04-20'
  },
  {
    id: 'p003',
    title: 'Health Monitoring Wearable App',
    slug: 'health-monitoring-wearable',
    description: 'Cross-platform mobile app for fitness tracking with wearable device integration.',
    fullDescription: `A comprehensive health and fitness tracking application that seamlessly integrates with popular wearable devices like Fitbit, Apple Watch, and Garmin.

Features:
• Real-time heart rate and activity monitoring
• Sleep quality analysis and recommendations
• Workout tracking with guided exercises
• Nutrition logging and calorie tracking
• Health insights powered by data analytics
• Social features for fitness challenges

The app provides actionable health insights using data collected from wearable devices, helping users achieve their fitness goals.`,
    studentId: 's002',
    categoryId: 'cat002',
    year: 2024,
    technologies: ['Flutter', 'Firebase', 'HealthKit', 'Google Fit API', 'Machine Learning'],
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    demoUrl: null,
    githubUrl: 'https://github.com/amir-hasanov/health-monitor',
    documentationUrl: 'https://docs.healthmonitor.example.com',
    featured: true,
    rating: 4.7,
    views: 856,
    createdAt: '2024-05-01'
  },
  {
    id: 'p004',
    title: 'Sentiment Analysis for Social Media',
    slug: 'sentiment-analysis-social-media',
    description: 'NLP-based tool for analyzing public sentiment from Twitter and Reddit posts.',
    fullDescription: `An advanced natural language processing system that analyzes public sentiment across major social media platforms.

Capabilities:
• Real-time sentiment classification (positive, negative, neutral)
• Emotion detection (joy, anger, sadness, fear, etc.)
• Topic extraction and trend analysis
• Multilingual support (English, Turkish, Russian)
• API for integration with other applications
• Interactive dashboard for visualization

The model achieves 89% accuracy on sentiment classification using a fine-tuned BERT transformer model trained on a custom dataset of 100,000+ labeled posts.`,
    studentId: 's003',
    categoryId: 'cat003',
    year: 2024,
    technologies: ['Python', 'BERT', 'PyTorch', 'FastAPI', 'React', 'PostgreSQL'],
    screenshots: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    demoUrl: 'https://sentiment.ai.example.com',
    githubUrl: 'https://github.com/leyla-aliyeva/sentiment-analyzer',
    documentationUrl: 'https://docs.sentiment-ai.example.com',
    featured: true,
    rating: 4.9,
    views: 1450,
    createdAt: '2024-03-15'
  },
  {
    id: 'p005',
    title: 'Smart Home Automation System',
    slug: 'smart-home-automation',
    description: 'IoT-based home automation system with voice control and mobile app integration.',
    fullDescription: `A comprehensive smart home solution that allows users to control and monitor their home appliances remotely.

System Components:
• Custom ESP32-based hardware modules
• MQTT broker for device communication
• Voice control integration (Alexa, Google Home)
• Mobile app for remote management
• Energy consumption monitoring
• Automated routines and schedules

The system supports 20+ types of home devices including lights, thermostats, security cameras, and door locks. All communication is encrypted using TLS for security.`,
    studentId: 's004',
    categoryId: 'cat004',
    year: 2024,
    technologies: ['Arduino', 'ESP32', 'MQTT', 'React Native', 'Node.js', 'MongoDB'],
    screenshots: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
      'https://images.unsplash.com/photo-1585503418537-88331351ad99?w=800'
    ],
    demoUrl: null,
    githubUrl: 'https://github.com/rashid-mammadov/smart-home',
    documentationUrl: 'https://docs.smarthome.example.com',
    featured: false,
    rating: 4.5,
    views: 720,
    createdAt: '2024-04-10'
  },
  {
    id: 'p006',
    title: 'Retro Arcade Adventure',
    slug: 'retro-arcade-adventure',
    description: 'A nostalgic 2D platformer game with modern graphics and gameplay mechanics.',
    fullDescription: `Retro Arcade Adventure is a charming 2D platformer that combines classic gameplay with modern visuals and mechanics.

Game Features:
• 50+ hand-crafted levels across 5 unique worlds
• Boss battles with unique attack patterns
• Collectibles and achievements system
• Local co-op multiplayer mode
• Original soundtrack with retro vibes
• Level editor for user-created content

The game was built in Unity and features custom pixel art animations, physics-based gameplay, and a compelling story mode.`,
    studentId: 's005',
    categoryId: 'cat005',
    year: 2024,
    technologies: ['Unity', 'C#', 'Photoshop', 'FMOD', 'Git LFS'],
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800'
    ],
    demoUrl: 'https://play.retroarcade.example.com',
    githubUrl: 'https://github.com/nigar-huseynova/retro-arcade',
    documentationUrl: null,
    featured: true,
    rating: 4.8,
    views: 2100,
    createdAt: '2024-02-28'
  },
  {
    id: 'p007',
    title: 'Network Vulnerability Scanner',
    slug: 'network-vulnerability-scanner',
    description: 'Automated security tool for identifying vulnerabilities in network infrastructure.',
    fullDescription: `An enterprise-grade security tool designed to identify and report vulnerabilities in network infrastructure.

Scanning Capabilities:
• Port scanning and service detection
• CVE database integration for known vulnerabilities
• Web application security testing (XSS, SQL injection)
• SSL/TLS configuration analysis
• Compliance checking (OWASP, PCI DSS)
• Detailed PDF reports with remediation steps

The tool uses multi-threaded scanning for efficiency and supports both authenticated and unauthenticated scans.`,
    studentId: 's006',
    categoryId: 'cat007',
    year: 2024,
    technologies: ['Python', 'Nmap', 'SQLite', 'React', 'Docker', 'REST API'],
    screenshots: [
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800'
    ],
    demoUrl: null,
    githubUrl: 'https://github.com/elvin-guliyev/vuln-scanner',
    documentationUrl: 'https://docs.vulnscanner.example.com',
    featured: false,
    rating: 4.4,
    views: 580,
    createdAt: '2024-05-10'
  },
  {
    id: 'p008',
    title: 'Business Intelligence Dashboard',
    slug: 'business-intelligence-dashboard',
    description: 'Interactive analytics dashboard for visualizing and exploring business data.',
    fullDescription: `A powerful business intelligence platform that transforms raw data into actionable insights through interactive visualizations.

Dashboard Features:
• Drag-and-drop chart builder
• Real-time data updates via WebSocket
• Custom KPI tracking and alerts
• Data source connectors (SQL, Excel, APIs)
• Collaborative features with sharing
• Export to PDF, Excel, and PowerPoint

The platform supports various chart types including line, bar, pie, scatter, heatmaps, and geographic maps.`,
    studentId: 's007',
    categoryId: 'cat008',
    year: 2024,
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800'
    ],
    demoUrl: 'https://bi-dashboard.example.com',
    githubUrl: 'https://github.com/aysel-rzayeva/bi-dashboard',
    documentationUrl: null,
    featured: false,
    rating: 4.6,
    views: 890,
    createdAt: '2024-04-05'
  },
  {
    id: 'p009',
    title: 'Microservices Event Platform',
    slug: 'microservices-event-platform',
    description: 'Scalable event booking platform built with microservices architecture.',
    fullDescription: `A modern event management platform designed for scalability using microservices architecture.

Architecture Components:
• User service for authentication and profiles
• Event service for event management
• Booking service for reservations
• Payment service with multiple gateways
• Notification service (email, SMS, push)
• API Gateway with rate limiting

Each service is containerized with Docker and orchestrated with Kubernetes, allowing independent scaling and deployment.`,
    studentId: 's008',
    categoryId: 'cat001',
    year: 2024,
    technologies: ['Java', 'Spring Boot', 'Kubernetes', 'RabbitMQ', 'PostgreSQL', 'React'],
    screenshots: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
    ],
    demoUrl: 'https://eventplatform.example.com',
    githubUrl: 'https://github.com/fuad-karimov/event-platform',
    documentationUrl: 'https://docs.eventplatform.example.com',
    featured: false,
    rating: 4.5,
    views: 650,
    createdAt: '2024-03-20'
  },
  {
    id: 'p010',
    title: 'Autonomous Drone Controller',
    slug: 'autonomous-drone-controller',
    description: 'Software system for autonomous drone navigation and obstacle avoidance.',
    fullDescription: `An advanced flight control system enabling autonomous navigation for commercial drones.

System Capabilities:
• GPS waypoint navigation
• Real-time obstacle detection and avoidance
• Computer vision for landing zone detection
• Telemetry streaming to ground station
• Emergency fail-safe mechanisms
• Mission planning with GeoJSON support

The system uses ROS (Robot Operating System) for sensor integration and provides a web-based ground control interface.`,
    studentId: 's004',
    categoryId: 'cat004',
    year: 2024,
    technologies: ['Python', 'ROS', 'OpenCV', 'C++', 'React', 'WebSocket'],
    screenshots: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800'
    ],
    demoUrl: null,
    githubUrl: 'https://github.com/rashid-mammadov/drone-controller',
    documentationUrl: 'https://docs.dronecontrol.example.com',
    featured: false,
    rating: 4.7,
    views: 420,
    createdAt: '2024-05-20'
  },
  {
    id: 'p011',
    title: 'AI-Powered Resume Builder',
    slug: 'ai-resume-builder',
    description: 'Web application that generates professional resumes using AI with multiple templates.',
    fullDescription: `A smart resume creation tool that helps job seekers build professional resumes with AI assistance.

Features:
• AI-powered content suggestions
• 15+ professional templates
• ATS (Applicant Tracking System) optimization
• Real-time preview and editing
• Export to PDF, Word, and plain text
• Cover letter generation

The AI engine provides suggestions for skills, achievements, and job descriptions based on the user's target role and industry.`,
    studentId: 's001',
    categoryId: 'cat001',
    year: 2024,
    technologies: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    screenshots: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
    ],
    demoUrl: 'https://resume.ai.example.com',
    githubUrl: 'https://github.com/shirin-mamedova/ai-resume',
    documentationUrl: null,
    featured: true,
    rating: 4.9,
    views: 1850,
    createdAt: '2024-01-15'
  },
  {
    id: 'p012',
    title: 'Virtual Reality Museum Tour',
    slug: 'vr-museum-tour',
    description: 'Immersive VR experience for exploring museum exhibits from anywhere in the world.',
    fullDescription: `An educational VR application that allows users to explore world-famous museums from the comfort of their homes.

Experience Features:
• Photorealistic 3D museum environments
• Interactive exhibits with audio guides
• Multiplayer mode for guided tours
• Hand tracking for natural interaction
• Cross-platform (Quest, PC VR, WebXR)
• Accessibility features for diverse users

The application includes virtual recreations of famous artworks with historical context and educational content.`,
    studentId: 's005',
    categoryId: 'cat005',
    year: 2024,
    technologies: ['Unity', 'Oculus SDK', 'Blender', 'Photogrammetry', 'WebXR'],
    screenshots: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'
    ],
    demoUrl: 'https://vrmuseum.example.com',
    githubUrl: 'https://github.com/nigar-huseynova/vr-museum',
    documentationUrl: null,
    featured: false,
    rating: 4.6,
    views: 780,
    createdAt: '2024-04-25'
  }
];

export const getProjectById = (id) => projects.find(project => project.id === id);
export const getProjectBySlug = (slug) => projects.find(project => project.slug === slug);
export const getFeaturedProjects = () => projects.filter(project => project.featured);
export const getProjectsByCategory = (categoryId) => 
  projects.filter(project => project.categoryId === categoryId);
export const getProjectsByStudent = (studentId) => 
  projects.filter(project => project.studentId === studentId);
export const getProjectsByYear = (year) => 
  projects.filter(project => project.year === year);
