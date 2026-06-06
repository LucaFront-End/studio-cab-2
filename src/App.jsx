import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import WhyUs from './components/WhyUs';
import ProcessSplit from './components/ProcessSplit';
import CTAConfigurator from './components/CTAConfigurator';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <main className="main-wrapper">
      <Header />
      <Hero />
      <Services />
      <Projects />
      <WhyUs />
      <ProcessSplit />
      <CTAConfigurator />
      <Footer />
      <ThemeSwitcher />
    </main>
  );
}

export default App;
