import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import WhyUs from '../components/WhyUs';
import ProcessSplit from '../components/ProcessSplit';
import CTAConfigurator from '../components/CTAConfigurator';

export default function HomePage() {
  const { landingsDeCiudad } = useWixCMSData();

  // Find main/CDMX landing or fallback to first landing
  const mainLanding = (landingsDeCiudad || []).find(l => {
    const data = l.data || l;
    const title = (data.tituloPgina || data.title || '').toLowerCase();
    return title.includes('cdmx') || title.includes('ciudad de méxico');
  }) || (landingsDeCiudad && landingsDeCiudad[0] ? (landingsDeCiudad[0].data || landingsDeCiudad[0]) : null);

  const data = mainLanding ? (mainLanding.data || mainLanding) : null;

  useDocumentSEO(
    data?.tituloSeo || 'Grupo CAB Studio | Carpintería y Muebles sobre Diseño en CDMX',
    data?.metadescripcinSeo || data?.excerptPgina || 'Grupo CAB Studio ofrece carpintería en CDMX, tapicería en CDMX y muebles sobre diseño en CDMX para espacios comerciales y residenciales con fabricación propia.'
  );

  return (
    <div className="page-enter">
      <Hero 
        topEyebrow={data?.tituloPgina}
        fraseCorta={data?.fraseCorta}
        excerptPgina={data?.excerptPgina}
      />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator source="Inicio" />
    </div>
  );
}
