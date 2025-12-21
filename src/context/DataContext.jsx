import { createContext, useCallback, useContext, useState } from 'react';
import { categories } from '../data/categories';
import { projects as initialProjects } from '../data/projects';
import { statistics } from '../data/statistics';
import { students as initialStudents } from '../data/students';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: null,
    year: null,
    technology: null
  });

  // Project CRUD operations
  const addProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: `p${String(projects.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      rating: 0
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, [projects.length]);

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProjectById = useCallback((id) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const getProjectBySlug = useCallback((slug) => {
    return projects.find(p => p.slug === slug);
  }, [projects]);

  // Student CRUD operations
  const addStudent = useCallback((student) => {
    const newStudent = {
      ...student,
      id: `s${String(students.length + 1).padStart(3, '0')}`
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  }, [students.length]);

  const updateStudent = useCallback((id, updates) => {
    setStudents(prev => 
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  const getStudentById = useCallback((id) => {
    return students.find(s => s.id === id);
  }, [students]);

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(t => t.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && project.categoryId !== filters.category) {
      return false;
    }

    // Year filter
    if (filters.year && project.year !== filters.year) {
      return false;
    }

    // Technology filter
    if (filters.technology) {
      const hasTech = project.technologies.some(
        t => t.toLowerCase() === filters.technology.toLowerCase()
      );
      if (!hasTech) return false;
    }

    return true;
  });

  // Get featured items
  const featuredProjects = projects.filter(p => p.featured);
  const featuredStudents = students.filter(s => s.featured);

  // Get unique values for filters
  const allYears = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a);
  const allTechnologies = [...new Set(projects.flatMap(p => p.technologies))].sort();

  // Get projects by student
  const getProjectsByStudent = useCallback((studentId) => {
    return projects.filter(p => p.studentId === studentId);
  }, [projects]);

  // Get projects by category
  const getProjectsByCategory = useCallback((categoryId) => {
    return projects.filter(p => p.categoryId === categoryId);
  }, [projects]);

  // Get category by id
  const getCategoryById = useCallback((id) => {
    return categories.find(c => c.id === id);
  }, []);

  const value = {
    // Projects
    projects,
    filteredProjects,
    featuredProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectBySlug,
    getProjectsByStudent,
    getProjectsByCategory,
    
    // Students
    students,
    featuredStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    
    // Categories
    categories,
    getCategoryById,
    
    // Statistics
    statistics,
    
    // Search & Filters
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters: () => setFilters({ category: null, year: null, technology: null }),
    
    // Filter options
    allYears,
    allTechnologies
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
