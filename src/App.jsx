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
                  <Route path="*" element={<NotFound />} />
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
