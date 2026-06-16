import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import WhyUs from '../components/WhyUs';
import ProcessSplit from '../components/ProcessSplit';
import CTAConfigurator from '../components/CTAConfigurator';

export default function HomePage() {
  return (
    <div className="page-enter">
      <Hero />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator />
    </div>
  );
}
