import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ContactPage from './pages/ContactPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <main className="main-wrapper">
      <CustomCursor />
      <ScrollToTop />
      <Header />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/servicios/:id" element={<ServiceDetailPage />} />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="/proyectos/:id" element={<ProjectDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/tienda/:id" element={<ProductPage />} />
        </Routes>
      </PageTransition>
      <Footer />
      <ThemeSwitcher />
    </main>
  );
}

export default App;
