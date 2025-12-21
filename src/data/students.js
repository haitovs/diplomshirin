// Mock students data
export const students = [
  {
    id: 's001',
    name: 'Shirin Mamedova',
    email: 'shirin.mamedova@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shirin',
    bio: 'Passionate full-stack developer with a focus on creating user-friendly web applications. Experienced in React, Node.js, and cloud technologies.',
    department: 'Computer Science',
    graduationYear: 2024,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    linkedin: 'https://linkedin.com/in/shirin-mamedova',
    github: 'https://github.com/shirin-mamedova',
    portfolio: 'https://shirin.dev',
    gpa: 3.85,
    featured: true
  },
  {
    id: 's002',
    name: 'Amir Hasanov',
    email: 'amir.hasanov@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amir',
    bio: 'Mobile app developer specializing in cross-platform solutions. Love building apps that make everyday life easier.',
    department: 'Software Engineering',
    graduationYear: 2024,
    skills: ['React Native', 'Flutter', 'Kotlin', 'Swift', 'Firebase'],
    linkedin: 'https://linkedin.com/in/amir-hasanov',
    github: 'https://github.com/amir-hasanov',
    portfolio: null,
    gpa: 3.72,
    featured: true
  },
  {
    id: 's003',
    name: 'Leyla Aliyeva',
    email: 'leyla.aliyeva@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla',
    bio: 'AI/ML enthusiast focused on natural language processing and computer vision. Research assistant at the university AI lab.',
    department: 'Computer Science',
    graduationYear: 2024,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP', 'Deep Learning'],
    linkedin: 'https://linkedin.com/in/leyla-aliyeva',
    github: 'https://github.com/leyla-aliyeva',
    portfolio: 'https://leyla-ai.com',
    gpa: 3.95,
    featured: true
  },
  {
    id: 's004',
    name: 'Rashid Mammadov',
    email: 'rashid.mammadov@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashid',
    bio: 'IoT and embedded systems developer. Building smart solutions for connected world.',
    department: 'Electrical Engineering',
    graduationYear: 2024,
    skills: ['C/C++', 'Arduino', 'Raspberry Pi', 'MQTT', 'Embedded Linux'],
    linkedin: 'https://linkedin.com/in/rashid-mammadov',
    github: 'https://github.com/rashid-mammadov',
    portfolio: null,
    gpa: 3.68,
    featured: false
  },
  {
    id: 's005',
    name: 'Nigar Huseynova',
    email: 'nigar.huseynova@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nigar',
    bio: 'Game developer and 3D artist. Creating immersive gaming experiences with Unity and Unreal Engine.',
    department: 'Game Development',
    graduationYear: 2024,
    skills: ['Unity', 'C#', 'Unreal Engine', 'Blender', '3D Modeling', 'Game Design'],
    linkedin: 'https://linkedin.com/in/nigar-huseynova',
    github: 'https://github.com/nigar-huseynova',
    portfolio: 'https://nigar-games.com',
    gpa: 3.79,
    featured: true
  },
  {
    id: 's006',
    name: 'Elvin Guliyev',
    email: 'elvin.guliyev@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elvin',
    bio: 'Cybersecurity specialist with expertise in penetration testing and security auditing.',
    department: 'Information Security',
    graduationYear: 2024,
    skills: ['Penetration Testing', 'Network Security', 'Python', 'Linux', 'OSINT'],
    linkedin: 'https://linkedin.com/in/elvin-guliyev',
    github: 'https://github.com/elvin-guliyev',
    portfolio: null,
    gpa: 3.81,
    featured: false
  },
  {
    id: 's007',
    name: 'Aysel Rzayeva',
    email: 'aysel.rzayeva@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aysel',
    bio: 'Data analyst and visualization expert. Turning complex data into actionable insights.',
    department: 'Data Science',
    graduationYear: 2024,
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Statistics'],
    linkedin: 'https://linkedin.com/in/aysel-rzayeva',
    github: 'https://github.com/aysel-rzayeva',
    portfolio: null,
    gpa: 3.88,
    featured: false
  },
  {
    id: 's008',
    name: 'Fuad Karimov',
    email: 'fuad.karimov@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fuad',
    bio: 'Backend developer specialized in microservices architecture and cloud infrastructure.',
    department: 'Software Engineering',
    graduationYear: 2024,
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis'],
    linkedin: 'https://linkedin.com/in/fuad-karimov',
    github: 'https://github.com/fuad-karimov',
    portfolio: null,
    gpa: 3.75,
    featured: false
  }
];

export const getStudentById = (id) => students.find(student => student.id === id);
export const getFeaturedStudents = () => students.filter(student => student.featured);
export const getStudentsByDepartment = (department) => 
  students.filter(student => student.department === department);
