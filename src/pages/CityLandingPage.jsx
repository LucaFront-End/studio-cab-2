import { useParams, Link } from 'react-router-dom';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import WhyUs from '../components/WhyUs';
import ProcessSplit from '../components/ProcessSplit';
import CTAConfigurator from '../components/CTAConfigurator';

export default function CityLandingPage() {
  const { slug } = useParams();
  const { landingsDeCiudad, loading } = useWixCMSData();

  const landing = (landingsDeCiudad || []).find(l => {
    const data = l.data || l;
    return data.slug === slug || l._id === slug;
  });

  const data = landing ? (landing.data || landing) : null;

  useDocumentSEO(
    data?.tituloSeo || (data?.tituloPgina ? `${data.tituloPgina} | Grupo CAB Studio` : 'Carpintería y Muebles sobre Diseño en CDMX | Grupo CAB Studio'),
    data?.metadescripcinSeo || data?.excerptPgina || 'Grupo CAB Studio ofrece carpintería fina, interiorismo y muebles sobre diseño para espacios comerciales y residenciales.'
  );

  if (loading) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--colors--theme-orange)', borderRadius: '50%', animation: 'cz-spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ fontWeight: 600, color: 'var(--colors--theme-black)' }}>Cargando landing de la ciudad desde Wix CMS...</p>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Landing de Ciudad no encontrada</h1>
        <p style={{ marginTop: 12, color: 'var(--colors--theme-gray)' }}>No se localizó la landing especificada en el CMS de LandingsdeCiudad.</p>
        <Link to="/zonas-de-cobertura" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 24, display: 'inline-block' }}>
          ← Volver a Hub de Zonas de Cobertura
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <Hero 
        topEyebrow={data.tituloPgina || data.title}
        fraseCorta={data.fraseCorta}
        excerptPgina={data.excerptPgina}
      />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator source={`Landing Ciudad: ${data.tituloPgina || data.title}`} />
    </div>
  );
}
