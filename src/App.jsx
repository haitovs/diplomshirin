import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import Builder from './pages/Builder';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Preview from './pages/Preview';
// Diploma Archive pages
import Archive from './pages/Archive';
import DiplomaDetail from './pages/DiplomaDetail';
import Submit from './pages/Submit';
// Portfolio showcase pages
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Students from './pages/Students';
import StudentPortfolio from './pages/StudentPortfolio';
import SubmitProject from './pages/SubmitProject';
// Admin pages
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ManageProjects from './pages/Admin/ManageProjects';
import ManageStudents from './pages/Admin/ManageStudents';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <PortfolioProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="builder" element={<Builder />} />
                  <Route path="preview" element={<Preview />} />
                  <Route path="login" element={<Login />} />
                  {/* Diploma Archive Routes */}
                  <Route path="archive" element={<Archive />} />
                  <Route path="archive/:id" element={<DiplomaDetail />} />
                  <Route path="submit" element={<Submit />} />
                  {/* Portfolio showcase routes */}
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:slug" element={<ProjectDetail />} />
                  <Route path="students" element={<Students />} />
                  <Route path="students/:id" element={<StudentPortfolio />} />
                  <Route path="submit-project" element={<SubmitProject />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<ManageProjects />} />
                  <Route path="students" element={<ManageStudents />} />
                </Route>
              </Routes>
            </PortfolioProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

