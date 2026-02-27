const Database = require('better-sqlite3');
const path = require('path');

// Create database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Students table
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT 'student123',
    department TEXT,
    graduation_year INTEGER,
    avatar TEXT,
    bio TEXT,
    skills TEXT DEFAULT '[]',
    linkedin TEXT,
    github TEXT,
    portfolio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Diploma Works table
  CREATE TABLE IF NOT EXISTS diploma_works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    student_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    technologies TEXT DEFAULT '[]',
    screenshots TEXT DEFAULT '[]',
    demo_url TEXT,
    github_url TEXT,
    documentation_url TEXT,
    featured INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    similarity_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  -- Create indexes for search
  CREATE INDEX IF NOT EXISTS idx_diploma_title ON diploma_works(title);
  CREATE INDEX IF NOT EXISTS idx_diploma_category ON diploma_works(category);
  CREATE INDEX IF NOT EXISTS idx_diploma_year ON diploma_works(year);
  CREATE INDEX IF NOT EXISTS idx_diploma_status ON diploma_works(status);
  CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
`);

// Migration: add password column if missing (for existing databases)
try {
  db.prepare("SELECT password FROM students LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE students ADD COLUMN password TEXT DEFAULT 'student123'");
  console.log('✅ Added password column to students table');
}

// Check if tables are empty and seed with sample data
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get();

if (studentCount.count === 0) {
  console.log('📝 Seeding initial data...');
  
  // Insert sample students
  const insertStudent = db.prepare(`
    INSERT INTO students (name, email, department, graduation_year, avatar, bio, skills, linkedin, github)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const students = [
    ['Shirin Mamedova', 'shirin@university.edu', 'Computer Science', 2024, 
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Shirin',
     'Full-stack developer specializing in React and Node.js',
     '["JavaScript", "React", "Node.js", "Python"]',
     'https://linkedin.com/in/shirin', 'https://github.com/shirin'],
    ['Amir Hasanov', 'amir@university.edu', 'Software Engineering', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Amir',
     'Mobile developer with Flutter expertise',
     '["Flutter", "Dart", "Firebase", "Kotlin"]',
     'https://linkedin.com/in/amir', 'https://github.com/amir'],
    ['Leyla Aliyeva', 'leyla@university.edu', 'Data Science', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla',
     'AI/ML enthusiast focused on NLP',
     '["Python", "TensorFlow", "PyTorch", "NLP"]',
     'https://linkedin.com/in/leyla', 'https://github.com/leyla'],
    ['Rashid Mammadov', 'rashid@university.edu', 'Electrical Engineering', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashid',
     'IoT and embedded systems developer',
     '["C/C++", "Arduino", "Raspberry Pi", "MQTT"]',
     'https://linkedin.com/in/rashid', 'https://github.com/rashid'],
    ['Nigar Huseynova', 'nigar@university.edu', 'Game Development', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Nigar',
     'Game developer and 3D artist',
     '["Unity", "C#", "Blender", "Unreal Engine"]',
     'https://linkedin.com/in/nigar', 'https://github.com/nigar'],
    ['Elvin Guliyev', 'elvin@university.edu', 'Information Security', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Elvin',
     'Cybersecurity specialist',
     '["Penetration Testing", "Python", "Network Security"]',
     'https://linkedin.com/in/elvin', 'https://github.com/elvin'],
    ['Aysel Rzayeva', 'aysel@university.edu', 'Data Science', 2023,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Aysel',
     'Data analyst and visualization expert',
     '["Python", "R", "SQL", "Tableau", "Power BI"]',
     'https://linkedin.com/in/aysel', 'https://github.com/aysel'],
    ['Fuad Karimov', 'fuad@university.edu', 'Software Engineering', 2023,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Fuad',
     'Backend developer specialized in microservices',
     '["Java", "Spring Boot", "Kubernetes", "Docker"]',
     'https://linkedin.com/in/fuad', 'https://github.com/fuad']
  ];

  students.forEach(s => insertStudent.run(...s));

  // Insert sample diploma works
  const insertWork = db.prepare(`
    INSERT INTO diploma_works (title, slug, description, full_description, student_id, category, year, technologies, screenshots, status, featured, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const works = [
    ['Smart Campus Navigation', 'smart-campus-navigation',
     'Mobile app for university campus navigation with indoor mapping',
     'Full indoor/outdoor navigation system using Bluetooth beacons and WiFi fingerprinting. Features real-time directions, class schedule integration, and accessibility support.',
     1, 'Mobile Development', 2024,
     '["React Native", "Node.js", "MongoDB", "Bluetooth"]',
     '["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800"]',
     'approved', 1, 156],
    ['AI Resume Builder', 'ai-resume-builder',
     'Web app that generates professional resumes using AI',
     'Uses OpenAI API to suggest content based on job requirements. Includes 15+ professional templates and ATS optimization.',
     1, 'Web Development', 2024,
     '["React", "OpenAI API", "Node.js", "PostgreSQL"]',
     '["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"]',
     'approved', 1, 89],
    ['Health Monitoring App', 'health-monitoring-app',
     'Fitness tracking with wearable integration',
     'Cross-platform app integrating Fitbit and Apple Watch data. Features heart rate monitoring, sleep tracking, and workout analysis.',
     2, 'Mobile Development', 2024,
     '["Flutter", "Firebase", "HealthKit", "Google Fit"]',
     '["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"]',
     'approved', 0, 67],
    ['Sentiment Analysis Tool', 'sentiment-analysis-tool',
     'NLP tool for analyzing social media sentiment',
     'BERT-based model achieving 89% accuracy on sentiment classification. Supports English, Turkish, and Russian languages.',
     3, 'Machine Learning', 2024,
     '["Python", "BERT", "PyTorch", "FastAPI"]',
     '["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800"]',
     'approved', 1, 234],
    ['Smart Home Automation', 'smart-home-automation',
     'IoT-based home automation with voice control',
     'Custom ESP32-based modules with MQTT communication. Integrates with Alexa and Google Home for voice control.',
     4, 'IoT', 2024,
     '["Arduino", "ESP32", "MQTT", "React Native"]',
     '["https://images.unsplash.com/photo-1558002038-1055907df827?w=800"]',
     'approved', 1, 112],
    ['Retro Arcade Adventure', 'retro-arcade-adventure',
     '2D platformer game with modern graphics',
     '50+ hand-crafted levels across 5 unique worlds. Features boss battles, collectibles, and local co-op multiplayer.',
     5, 'Game Development', 2024,
     '["Unity", "C#", "Photoshop", "FMOD"]',
     '["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"]',
     'approved', 1, 345],
    ['Network Vulnerability Scanner', 'network-vulnerability-scanner',
     'Security tool for identifying network vulnerabilities',
     'Enterprise-grade scanner with CVE database integration. Supports authenticated and unauthenticated scans.',
     6, 'Cybersecurity', 2024,
     '["Python", "Nmap", "SQLite", "React"]',
     '["https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800"]',
     'approved', 0, 78],
    ['Business Intelligence Dashboard', 'bi-dashboard',
     'Interactive analytics dashboard for business data',
     'Drag-and-drop chart builder with real-time WebSocket updates. Supports multiple data sources.',
     7, 'Data Analytics', 2023,
     '["React", "D3.js", "Python", "FastAPI"]',
     '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"]',
     'approved', 0, 145],
    ['Microservices Event Platform', 'microservices-event-platform',
     'Scalable event booking platform',
     'Built with microservices architecture. Includes user, event, booking, payment, and notification services.',
     8, 'Web Development', 2023,
     '["Java", "Spring Boot", "Kubernetes", "RabbitMQ"]',
     '["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"]',
     'approved', 0, 98],
    ['E-Commerce Recommendation Engine', 'ecommerce-recommendations',
     'AI-powered product recommendations',
     'Machine learning system using collaborative filtering. Achieved 40% improvement in user engagement.',
     3, 'Machine Learning', 2024,
     '["Python", "TensorFlow", "Redis", "Django"]',
     '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"]',
     'pending', 0, 0],
    ['Autonomous Drone Controller', 'drone-controller',
     'Software for autonomous drone navigation',
     'GPS waypoint navigation with real-time obstacle detection using ROS and computer vision.',
     4, 'IoT', 2024,
     '["Python", "ROS", "OpenCV", "C++"]',
     '["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800"]',
     'pending', 0, 0],
    ['VR Museum Tour', 'vr-museum-tour',
     'Immersive VR experience for museum exploration',
     'Photorealistic 3D museum environments with interactive exhibits and multiplayer guided tours.',
     5, 'Game Development', 2024,
     '["Unity", "Oculus SDK", "Blender", "WebXR"]',
     '["https://images.unsplash.com/photo-1574169208507-84376144848b?w=800"]',
     'pending', 0, 0]
  ];

  works.forEach(w => insertWork.run(...w));
  console.log('✅ Sample data seeded (8 students, 12 diploma works)');
}

console.log('✅ Database initialized');

module.exports = db;
