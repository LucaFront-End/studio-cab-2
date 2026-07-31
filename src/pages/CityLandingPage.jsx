import { useParams } from 'react-router-dom';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import WhyUs from '../components/WhyUs';
import ProcessSplit from '../components/ProcessSplit';
import CTAConfigurator from '../components/CTAConfigurator';

function formatSlugToTitle(slug) {
  if (!slug) return 'Muebles sobre Diseño en CDMX';
  const words = slug.split('-');
  const capitalized = words.map((w, i) => {
    const lower = w.toLowerCase();
    if (i > 0 && ['de', 'en', 'la', 'del', 'los', 'las', 'y', 'a', 'para', 'el'].includes(lower)) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return capitalized.join(' ');
}

export default function CityLandingPage() {
  const { slug } = useParams();
  const { landingsDeCiudad } = useWixCMSData();

  const landing = (landingsDeCiudad || []).find(l => {
    const data = l.data || l;
    return data.slug === slug || l._id === slug;
  });

  const data = landing ? (landing.data || landing) : null;

  const title = data?.tituloPgina || data?.title || formatSlugToTitle(slug);
  const excerpt = data?.excerptPgina || data?.fraseCorta || 'Carpintería fina, interiorismo y muebles sobre diseño para espacios comerciales y residenciales.';
  const seoTitle = data?.tituloSeo || `${title} | Grupo CAB Studio`;
  const seoDesc = data?.metadescripcinSeo || excerpt;

  useDocumentSEO(seoTitle, seoDesc);

  return (
    <div className="page-enter">
      <Hero 
        topEyebrow={title}
        fraseCorta={data?.fraseCorta}
        excerptPgina={excerpt}
        seoTitle={seoTitle}
      />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator source={`Landing Ciudad: ${title}`} />
    </div>
  );
}
