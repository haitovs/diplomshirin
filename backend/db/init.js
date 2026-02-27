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
    supervisor TEXT,
    abstract TEXT,
    methodology TEXT,
    key_findings TEXT,
    defense_date TEXT,
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

// Migration: add academic fields to diploma_works if missing
const academicColumns = ['supervisor', 'abstract', 'methodology', 'key_findings', 'defense_date'];
for (const col of academicColumns) {
  try {
    db.prepare(`SELECT ${col} FROM diploma_works LIMIT 1`).get();
  } catch {
    db.exec(`ALTER TABLE diploma_works ADD COLUMN ${col} TEXT`);
    console.log(`✅ Added ${col} column to diploma_works table`);
  }
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
     'https://linkedin.com/in/fuad', 'https://github.com/fuad'],
    // New students
    ['Kamran Ibrahimov', 'kamran@university.edu', 'Artificial Intelligence', 2025,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamran',
     'Deep learning researcher focusing on computer vision',
     '["Python", "PyTorch", "OpenCV", "CUDA"]',
     'https://linkedin.com/in/kamran', 'https://github.com/kamran'],
    ['Gunel Ahmadova', 'gunel@university.edu', 'Computer Science', 2025,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunel',
     'Cloud-native developer and DevOps enthusiast',
     '["AWS", "Terraform", "Docker", "Go"]',
     'https://linkedin.com/in/gunel', 'https://github.com/gunel'],
    ['Orkhan Nasirov', 'orkhan@university.edu', 'Software Engineering', 2025,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Orkhan',
     'Full-stack developer passionate about scalable systems',
     '["TypeScript", "Next.js", "PostgreSQL", "GraphQL"]',
     'https://linkedin.com/in/orkhan', 'https://github.com/orkhan'],
    ['Sabina Huseynli', 'sabina@university.edu', 'Data Science', 2025,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Sabina',
     'NLP researcher with focus on multilingual models',
     '["Python", "Hugging Face", "spaCy", "FastAPI"]',
     'https://linkedin.com/in/sabina', 'https://github.com/sabina'],
    ['Tural Mammadli', 'tural@university.edu', 'Cybersecurity', 2025,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Tural',
     'Security analyst and ethical hacker',
     '["Python", "Wireshark", "Burp Suite", "Linux"]',
     'https://linkedin.com/in/tural', 'https://github.com/tural'],
    ['Narmin Gasimova', 'narmin@university.edu', 'Computer Engineering', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Narmin',
     'Embedded systems engineer and robotics developer',
     '["C/C++", "ROS", "FPGA", "Python"]',
     'https://linkedin.com/in/narmin', 'https://github.com/narmin'],
    ['Samir Aliyev', 'samir@university.edu', 'Information Technology', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Samir',
     'System administrator and cloud architect',
     '["Linux", "Ansible", "Kubernetes", "AWS"]',
     'https://linkedin.com/in/samir', 'https://github.com/samir'],
    ['Ulkar Huseynova', 'ulkar@university.edu', 'Artificial Intelligence', 2024,
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Ulkar',
     'Reinforcement learning researcher',
     '["Python", "TensorFlow", "OpenAI Gym", "NumPy"]',
     'https://linkedin.com/in/ulkar', 'https://github.com/ulkar']
  ];

  students.forEach(s => insertStudent.run(...s));

  // Insert sample diploma works
  const insertWork = db.prepare(`
    INSERT INTO diploma_works (title, slug, description, full_description, student_id, category, year, technologies, screenshots, supervisor, abstract, methodology, key_findings, defense_date, status, featured, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const works = [
    ['Smart Campus Navigation', 'smart-campus-navigation',
     'Mobile app for university campus navigation with indoor mapping',
     'Full indoor/outdoor navigation system using Bluetooth beacons and WiFi fingerprinting. Features real-time directions, class schedule integration, and accessibility support.',
     1, 'Mobile Development', 2024,
     '["React Native", "Node.js", "MongoDB", "Bluetooth"]',
     '["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800"]',
     'Prof. Dr. Ali Mammadov',
     'This thesis presents a mobile navigation system for university campuses combining Bluetooth Low Energy beacons with WiFi fingerprinting for seamless indoor-outdoor wayfinding.',
     'Agile development with iterative prototyping. Beacon placement optimized using signal propagation modeling.',
     'Achieved 2.1m average indoor positioning accuracy. 94% user satisfaction in campus trials with 120 participants.',
     '2024-06-15', 'approved', 1, 156],
    ['AI Resume Builder', 'ai-resume-builder',
     'Web app that generates professional resumes using AI',
     'Uses OpenAI API to suggest content based on job requirements. Includes 15+ professional templates and ATS optimization.',
     1, 'Web Development', 2024,
     '["React", "OpenAI API", "Node.js", "PostgreSQL"]',
     '["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"]',
     'Prof. Dr. Ali Mammadov',
     'An AI-powered resume generation platform that analyzes job descriptions and produces tailored, ATS-optimized resumes using large language models.',
     'Prompt engineering with GPT-4, A/B testing of template designs, user study with 50 job seekers.',
     '78% of test users received interview callbacks. ATS parse rate improved from 60% to 95% compared to manual resumes.',
     '2024-06-15', 'approved', 1, 89],
    ['Health Monitoring App', 'health-monitoring-app',
     'Fitness tracking with wearable integration',
     'Cross-platform app integrating Fitbit and Apple Watch data. Features heart rate monitoring, sleep tracking, and workout analysis.',
     2, 'Mobile Development', 2024,
     '["Flutter", "Firebase", "HealthKit", "Google Fit"]',
     '["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"]',
     'Dr. Sevinj Hasanova',
     'A cross-platform health monitoring application that aggregates data from multiple wearable devices to provide unified health insights and anomaly detection.',
     'Flutter for cross-platform UI, Firebase for real-time sync, statistical analysis for anomaly detection in vital signs.',
     'Successfully integrated 3 wearable platforms. Anomaly detection algorithm achieved 91% sensitivity for heart rate irregularities.',
     '2024-06-18', 'approved', 0, 67],
    ['Sentiment Analysis Tool', 'sentiment-analysis-tool',
     'NLP tool for analyzing social media sentiment',
     'BERT-based model achieving 89% accuracy on sentiment classification. Supports English, Turkish, and Russian languages.',
     3, 'Machine Learning', 2024,
     '["Python", "BERT", "PyTorch", "FastAPI"]',
     '["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'A multilingual sentiment analysis system using fine-tuned BERT models for classifying social media posts in English, Turkish, and Russian.',
     'Transfer learning with multilingual BERT, fine-tuned on 50K labeled social media posts. Evaluated using precision, recall, and F1 metrics.',
     '89% overall accuracy. Russian language model outperformed existing baselines by 7%. Processing speed of 200 posts/second on GPU.',
     '2024-06-20', 'approved', 1, 234],
    ['Smart Home Automation', 'smart-home-automation',
     'IoT-based home automation with voice control',
     'Custom ESP32-based modules with MQTT communication. Integrates with Alexa and Google Home for voice control.',
     4, 'IoT', 2024,
     '["Arduino", "ESP32", "MQTT", "React Native"]',
     '["https://images.unsplash.com/photo-1558002038-1055907df827?w=800"]',
     'Dr. Farid Nasirov',
     'A modular IoT home automation system built on ESP32 microcontrollers with MQTT messaging protocol and voice assistant integration.',
     'Hardware prototyping with ESP32, MQTT broker setup, REST API gateway, integration testing with voice assistants.',
     'System latency under 200ms for local commands. Successfully controlled 15 device types. Energy monitoring reduced household consumption by 18%.',
     '2024-06-22', 'approved', 1, 112],
    ['Retro Arcade Adventure', 'retro-arcade-adventure',
     '2D platformer game with modern graphics',
     '50+ hand-crafted levels across 5 unique worlds. Features boss battles, collectibles, and local co-op multiplayer.',
     5, 'Game Development', 2024,
     '["Unity", "C#", "Photoshop", "FMOD"]',
     '["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"]',
     'Dr. Kamran Guliyev',
     'A 2D platformer game combining retro pixel-art aesthetics with modern game design principles, featuring procedural level elements and adaptive difficulty.',
     'Unity 2D engine, custom physics system, procedural generation algorithms for bonus levels, playtesting with 30 users.',
     '50+ hand-crafted levels completed. Average play session of 45 minutes. 4.6/5 rating from beta testers.',
     '2024-06-25', 'approved', 1, 345],
    ['Network Vulnerability Scanner', 'network-vulnerability-scanner',
     'Security tool for identifying network vulnerabilities',
     'Enterprise-grade scanner with CVE database integration. Supports authenticated and unauthenticated scans.',
     6, 'Cybersecurity', 2024,
     '["Python", "Nmap", "SQLite", "React"]',
     '["https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800"]',
     'Prof. Dr. Ilgar Mammadov',
     'An automated network vulnerability assessment tool that combines active scanning with CVE database correlation to identify and prioritize security risks.',
     'Python-based scanning engine wrapping Nmap, CVE database integration via NVD API, risk scoring algorithm.',
     'Detected 95% of known vulnerabilities in test environments. Reduced manual assessment time by 70%. Supports scanning networks up to 500 hosts.',
     '2024-06-28', 'approved', 0, 78],
    ['Business Intelligence Dashboard', 'bi-dashboard',
     'Interactive analytics dashboard for business data',
     'Drag-and-drop chart builder with real-time WebSocket updates. Supports multiple data sources.',
     7, 'Data Analytics', 2023,
     '["React", "D3.js", "Python", "FastAPI"]',
     '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"]',
     'Dr. Nigar Abbasova',
     'A web-based business intelligence platform with drag-and-drop visualization builder and real-time data streaming capabilities.',
     'React frontend with D3.js visualizations, FastAPI backend, WebSocket for live updates, connector architecture for multiple data sources.',
     'Supports 8 chart types and 5 data source connectors. Dashboard load time under 2 seconds for datasets up to 1M rows.',
     '2023-06-15', 'approved', 0, 145],
    ['Microservices Event Platform', 'microservices-event-platform',
     'Scalable event booking platform',
     'Built with microservices architecture. Includes user, event, booking, payment, and notification services.',
     8, 'Web Development', 2023,
     '["Java", "Spring Boot", "Kubernetes", "RabbitMQ"]',
     '["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"]',
     'Prof. Dr. Vugar Aliyev',
     'A cloud-native event management platform built with microservices architecture demonstrating scalability, fault tolerance, and distributed system patterns.',
     'Domain-driven design, Spring Boot microservices, Kubernetes orchestration, RabbitMQ for async messaging, circuit breaker pattern.',
     'Handled 10,000 concurrent bookings in load tests. 99.9% uptime across 5 services. Average API response time of 45ms.',
     '2023-06-20', 'approved', 0, 98],
    ['E-Commerce Recommendation Engine', 'ecommerce-recommendations',
     'AI-powered product recommendations',
     'Machine learning system using collaborative filtering. Achieved 40% improvement in user engagement.',
     3, 'Machine Learning', 2024,
     '["Python", "TensorFlow", "Redis", "Django"]',
     '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'A hybrid recommendation engine combining collaborative filtering and content-based approaches for e-commerce product suggestions.',
     null, null, null, 'pending', 0, 0],
    ['Autonomous Drone Controller', 'drone-controller',
     'Software for autonomous drone navigation',
     'GPS waypoint navigation with real-time obstacle detection using ROS and computer vision.',
     4, 'IoT', 2024,
     '["Python", "ROS", "OpenCV", "C++"]',
     '["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800"]',
     'Dr. Farid Nasirov',
     'An autonomous drone navigation system using GPS waypoints and real-time computer vision for obstacle avoidance.',
     null, null, null, 'pending', 0, 0],
    ['VR Museum Tour', 'vr-museum-tour',
     'Immersive VR experience for museum exploration',
     'Photorealistic 3D museum environments with interactive exhibits and multiplayer guided tours.',
     5, 'Game Development', 2024,
     '["Unity", "Oculus SDK", "Blender", "WebXR"]',
     '["https://images.unsplash.com/photo-1574169208507-84376144848b?w=800"]',
     'Dr. Kamran Guliyev',
     'A virtual reality museum exploration experience with photorealistic environments and multiplayer guided tour support.',
     null, null, null, 'pending', 0, 0],
    // New diploma works
    ['Real-Time Object Detection for Traffic Management', 'traffic-object-detection',
     'Computer vision system for real-time traffic monitoring and vehicle counting',
     'YOLOv8-based detection pipeline processing live CCTV feeds for traffic density estimation, vehicle classification, and incident detection at intersections.',
     9, 'Artificial Intelligence', 2025,
     '["Python", "YOLOv8", "OpenCV", "TensorRT", "FastAPI"]',
     '["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'This thesis presents a real-time traffic monitoring system using YOLOv8 object detection optimized with TensorRT for edge deployment on intersection cameras.',
     'Transfer learning on custom traffic dataset of 15K annotated frames, TensorRT optimization for Jetson Nano deployment.',
     'Achieved 92% mAP on vehicle detection. Processes 30 FPS on Jetson Nano. Reduced manual traffic counting labor by 85%.',
     '2025-01-20', 'approved', 1, 187],
    ['Cloud-Native CI/CD Pipeline Orchestrator', 'cloud-cicd-orchestrator',
     'Automated deployment platform with GitOps workflows for Kubernetes clusters',
     'A self-service deployment platform enabling development teams to define, test, and deploy microservices through declarative GitOps pipelines with automatic rollback.',
     10, 'Cloud Computing', 2025,
     '["Go", "Kubernetes", "ArgoCD", "Terraform", "Prometheus"]',
     '["https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800"]',
     'Dr. Vugar Aliyev',
     'A GitOps-based CI/CD orchestration platform for Kubernetes that automates the full software delivery lifecycle with declarative pipeline definitions.',
     'Go microservices, Kubernetes operator pattern, ArgoCD for GitOps sync, Terraform for infrastructure-as-code, Prometheus for observability.',
     'Reduced deployment time from 45 minutes to 8 minutes. Zero-downtime deployments achieved. Automatic rollback success rate of 98%.',
     '2025-01-25', 'approved', 1, 95],
    ['E-Learning Platform with Adaptive Testing', 'adaptive-elearning',
     'Online learning platform that adapts quiz difficulty based on student performance',
     'An intelligent e-learning system using Item Response Theory to dynamically adjust assessment difficulty and personalize learning paths for each student.',
     11, 'Web Development', 2025,
     '["Next.js", "TypeScript", "PostgreSQL", "GraphQL", "Redis"]',
     '["https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"]',
     'Dr. Sevinj Hasanova',
     'An adaptive e-learning platform implementing Item Response Theory (IRT) for personalized assessments and learning path optimization.',
     'Next.js with TypeScript for full-stack development, IRT 3-parameter model for adaptive testing, A/B testing with 200 students.',
     'Students using adaptive tests showed 23% better retention. Average assessment time reduced by 30%. Difficulty calibration accuracy of 87%.',
     '2025-02-01', 'approved', 0, 62],
    ['Multilingual Document Summarizer', 'multilingual-summarizer',
     'NLP system for automatic summarization of academic papers in multiple languages',
     'A transformer-based abstractive summarization system supporting English, Turkish, and Azerbaijani academic documents with cross-lingual capabilities.',
     12, 'Machine Learning', 2025,
     '["Python", "Hugging Face", "mBART", "FastAPI", "Docker"]',
     '["https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'This work presents a multilingual abstractive summarization system based on fine-tuned mBART for condensing academic papers across three languages.',
     'Fine-tuning mBART-50 on curated dataset of 8K academic paper-summary pairs, ROUGE evaluation, human evaluation study.',
     'ROUGE-L score of 0.42 for English, 0.38 for Turkish, 0.35 for Azerbaijani. Preferred over extractive baselines by 72% of evaluators.',
     '2025-02-05', 'approved', 1, 143],
    ['Blockchain-Based Academic Credential Verification', 'blockchain-credentials',
     'Decentralized system for issuing and verifying university diplomas on blockchain',
     'A Hyperledger Fabric-based credential verification platform allowing universities to issue tamper-proof digital diplomas that employers can instantly verify.',
     13, 'Cybersecurity', 2025,
     '["Hyperledger Fabric", "Node.js", "React", "Docker", "Go"]',
     '["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"]',
     'Prof. Dr. Ilgar Mammadov',
     'A permissioned blockchain platform for academic credential issuance and verification, eliminating diploma fraud through cryptographic guarantees.',
     'Hyperledger Fabric network design, smart contract development in Go, React verification portal, performance benchmarking.',
     'Verification time under 3 seconds. Successfully tested with 10,000 credential issuances. Zero false verifications in adversarial testing.',
     '2025-02-10', 'approved', 0, 88],
    ['Autonomous Robot Navigation in Indoor Environments', 'indoor-robot-nav',
     'SLAM-based autonomous navigation system for service robots in building interiors',
     'A ROS2-based navigation stack combining LiDAR SLAM with depth camera obstacle avoidance for autonomous service robot operation in dynamic indoor environments.',
     14, 'IoT', 2024,
     '["ROS2", "C++", "Python", "LiDAR", "Gazebo"]',
     '["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"]',
     'Dr. Farid Nasirov',
     'An autonomous indoor navigation system for mobile service robots using simultaneous localization and mapping with dynamic obstacle handling.',
     'ROS2 navigation stack, GMapping for SLAM, depth camera integration, Gazebo simulation followed by real-world testing.',
     'Mapping accuracy of 97% in 500m² test environment. Successful autonomous navigation in 94% of trials. Obstacle avoidance response time of 150ms.',
     '2024-12-15', 'approved', 0, 71],
    ['Serverless IoT Data Pipeline', 'serverless-iot-pipeline',
     'Cloud-native data processing pipeline for large-scale IoT sensor networks',
     'An AWS Lambda-based serverless architecture for ingesting, processing, and analyzing data from thousands of IoT sensors with automatic scaling.',
     15, 'Cloud Computing', 2024,
     '["AWS Lambda", "DynamoDB", "Kinesis", "Python", "Terraform"]',
     '["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"]',
     'Dr. Vugar Aliyev',
     'A serverless data pipeline architecture on AWS for processing high-throughput IoT sensor data with sub-second latency and automatic horizontal scaling.',
     'AWS serverless services, Kinesis for stream ingestion, Lambda for processing, DynamoDB for storage, Terraform for IaC.',
     'Processes 50,000 events/second at peak. Cost 73% lower than equivalent EC2 deployment. P99 latency of 800ms end-to-end.',
     '2024-12-20', 'approved', 0, 54],
    ['Reinforcement Learning for Game AI', 'rl-game-ai',
     'Training intelligent game agents using deep reinforcement learning techniques',
     'A deep Q-network implementation for training game-playing agents in custom environments, with curriculum learning for progressive difficulty scaling.',
     16, 'Artificial Intelligence', 2024,
     '["Python", "PyTorch", "OpenAI Gym", "Ray RLlib"]',
     '["https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'This thesis explores deep reinforcement learning techniques for training autonomous game agents, comparing DQN, PPO, and A3C algorithms across multiple game environments.',
     'Custom OpenAI Gym environments, DQN with experience replay, PPO and A3C implementations, curriculum learning schedule.',
     'PPO agent achieved superhuman performance in 2 of 3 test games. Training time reduced 40% with curriculum learning. Published comparison of 3 RL algorithms.',
     '2024-12-10', 'approved', 1, 198],
    // More pending works
    ['Federated Learning for Medical Imaging', 'federated-medical-imaging',
     'Privacy-preserving machine learning system for hospital X-ray analysis',
     'A federated learning framework enabling multiple hospitals to collaboratively train diagnostic models without sharing patient data.',
     9, 'Artificial Intelligence', 2025,
     '["Python", "PySyft", "PyTorch", "Flask"]',
     '["https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800"]',
     'Prof. Dr. Rashad Aliyev',
     'A federated learning framework for collaborative medical image analysis across hospitals while preserving patient data privacy through differential privacy.',
     null, null, null, 'pending', 0, 0],
    ['Smart Agriculture Monitoring System', 'smart-agriculture',
     'IoT sensor network for real-time crop health monitoring and irrigation control',
     'A wireless sensor network using LoRaWAN for monitoring soil moisture, temperature, and crop health with automated irrigation scheduling.',
     14, 'IoT', 2025,
     '["LoRaWAN", "Arduino", "Python", "React", "InfluxDB"]',
     '["https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"]',
     'Dr. Farid Nasirov',
     'A LoRaWAN-based smart agriculture system for continuous crop monitoring and data-driven irrigation management.',
     null, null, null, 'pending', 0, 0]
  ];

  works.forEach(w => insertWork.run(...w));
  console.log('✅ Sample data seeded (16 students, 22 diploma works)');
}

console.log('✅ Database initialized');

module.exports = db;
