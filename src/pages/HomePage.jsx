import { useDocumentSEO } from '../hooks/useDocumentSEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import WhyUs from '../components/WhyUs';
import ProcessSplit from '../components/ProcessSplit';
import CTAConfigurator from '../components/CTAConfigurator';

export default function HomePage() {
  useDocumentSEO(
    'Grupo CAB Studio | Carpintería y Muebles sobre Diseño en CDMX',
    'Grupo CAB Studio ofrece carpintería en CDMX, tapicería en CDMX y muebles sobre diseño en CDMX para espacios comerciales y residenciales con fabricación propia.'
  );

  return (
    <div className="page-enter">
      <Hero />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator source="Inicio" />
    </div>
  );
}
