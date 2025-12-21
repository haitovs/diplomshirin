import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
