import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ContactPage from './pages/ContactPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import SubserviceDetailPage from './pages/SubserviceDetailPage';
import CoverageZonesPage from './pages/CoverageZonesPage';
import CityLandingPage from './pages/CityLandingPage';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div style={{ padding: '40px', background: 'red', color: 'white', minHeight: '100vh' }}>
      <h1>Ha ocurrido un error en la aplicación:</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{error.stack}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <main className="main-wrapper">
        <CustomCursor />
        <ScrollToTop />
        <WhatsAppButton />
        <CartDrawer />
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
            <Route path="/negocios/:id" element={<BusinessDetailPage />} />
            <Route path="/subservicios/:slug" element={<SubserviceDetailPage />} />
            <Route path="/zonas-de-cobertura" element={<CoverageZonesPage />} />
            <Route path="/ciudad/:slug" element={<CityLandingPage />} />
            <Route path="/tapiceria/:slug" element={<ServiceDetailPage />} />
            <Route path="/servicios/tapiceria/:slug" element={<ServiceDetailPage />} />
          </Routes>
        </PageTransition>
        <Footer />
      </main>
    </ErrorBoundary>
  );
}

export default App;
