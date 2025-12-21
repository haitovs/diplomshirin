// Statistics data for dashboard
export const statistics = {
  overview: {
    totalProjects: 12,
    totalStudents: 8,
    totalCategories: 8,
    totalViews: 12534,
    averageRating: 4.67
  },
  
  projectsByCategory: [
    { name: 'Web Development', count: 4, color: '#4F46E5' },
    { name: 'Mobile Development', count: 2, color: '#7C3AED' },
    { name: 'AI & Machine Learning', count: 1, color: '#06B6D4' },
    { name: 'IoT & Embedded', count: 2, color: '#10B981' },
    { name: 'Game Development', count: 2, color: '#F59E0B' },
    { name: 'Cybersecurity', count: 1, color: '#8B5CF6' },
    { name: 'Data Analytics', count: 1, color: '#EC4899' }
  ],
  
  projectsByYear: [
    { year: 2021, count: 8 },
    { year: 2022, count: 12 },
    { year: 2023, count: 15 },
    { year: 2024, count: 12 }
  ],
  
  monthlyViews: [
    { month: 'Jan', views: 850 },
    { month: 'Feb', views: 920 },
    { month: 'Mar', views: 1100 },
    { month: 'Apr', views: 1350 },
    { month: 'May', views: 1580 },
    { month: 'Jun', views: 1420 },
    { month: 'Jul', views: 1680 },
    { month: 'Aug', views: 1450 },
    { month: 'Sep', views: 1200 },
    { month: 'Oct', views: 1050 },
    { month: 'Nov', views: 980 },
    { month: 'Dec', views: 954 }
  ],
  
  topTechnologies: [
    { name: 'React', usage: 45 },
    { name: 'Python', usage: 38 },
    { name: 'Node.js', usage: 32 },
    { name: 'PostgreSQL', usage: 28 },
    { name: 'MongoDB', usage: 22 },
    { name: 'Docker', usage: 18 },
    { name: 'TensorFlow', usage: 15 },
    { name: 'Unity', usage: 12 }
  ],
  
  recentActivity: [
    {
      id: 'a001',
      type: 'project_added',
      message: 'New project "AI-Powered Resume Builder" was added',
      timestamp: '2024-01-15T10:30:00Z',
      userId: 's001'
    },
    {
      id: 'a002',
      type: 'student_registered',
      message: 'Fuad Karimov joined the platform',
      timestamp: '2024-01-14T15:45:00Z',
      userId: 's008'
    },
    {
      id: 'a003',
      type: 'project_featured',
      message: 'Project "Retro Arcade Adventure" was marked as featured',
      timestamp: '2024-01-13T09:20:00Z',
      userId: 's005'
    },
    {
      id: 'a004',
      type: 'project_updated',
      message: 'Project "Sentiment Analysis" was updated',
      timestamp: '2024-01-12T14:10:00Z',
      userId: 's003'
    },
    {
      id: 'a005',
      type: 'milestone',
      message: 'Platform reached 10,000 total views!',
      timestamp: '2024-01-10T11:00:00Z',
      userId: null
    }
  ],
  
  departmentDistribution: [
    { department: 'Computer Science', students: 3 },
    { department: 'Software Engineering', students: 2 },
    { department: 'Game Development', students: 1 },
    { department: 'Electrical Engineering', students: 1 },
    { department: 'Information Security', students: 1 },
    { department: 'Data Science', students: 1 }
  ]
};

export const getOverviewStats = () => statistics.overview;
export const getProjectsByCategory = () => statistics.projectsByCategory;
export const getProjectsByYear = () => statistics.projectsByYear;
export const getMonthlyViews = () => statistics.monthlyViews;
export const getTopTechnologies = () => statistics.topTechnologies;
export const getRecentActivity = () => statistics.recentActivity;
export const getDepartmentDistribution = () => statistics.departmentDistribution;
