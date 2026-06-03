import { useEffect, useRef, useState } from 'react';
import './Projects.css';

const projectsData = [
  {
    id: 'basilio',
    title: 'Basilio Roma',
    location: 'Restaurante & Bar · Roma Norte, CDMX',
    beforeImage: '/projects/basilio_before.png',
    afterImage: '/projects/basilio_after.png',
    narrative: [
      { title: 'El Reto', text: 'Un local estrecho de época porfiriana con escasa luz natural y restricciones estructurales severas de conservación histórica en la Col. Roma.' },
      { title: 'La Solución', text: 'Estructura de carpintería suspendida en nogal para optimizar el paso. Espejos estratégicos y arcos metálicos con iluminación LED cálida integrada.' },
      { title: 'El Impacto', text: 'Un espacio cálido e íntimo de alta afluencia que triplicó su capacidad operativa y se convirtió en referencia de interiorismo comercial en la zona.' }
    ],
    hotspots: [
      { id: 1, x: 50, y: 15, text: "Arcos metálicos estructurales con acabado latón e iluminación LED indirecta." },
      { id: 2, x: 28, y: 55, text: "Barra principal revestida de piedra sinterizada de alta resistencia." },
      { id: 3, x: 78, y: 70, text: "Mobiliario fijo y gabinetes flotantes en chapa de nogal natural." }
    ]
  },
  {
    id: 'condesa',
    title: 'Casa Condesa',
    location: 'Interiorismo Residencial · Condesa, CDMX',
    beforeImage: '/projects/condesa_before.png',
    afterImage: '/projects/condesa_after.png',
    narrative: [
      { title: 'El Reto', text: 'Remodelar un departamento de los años 70 en mal estado, optimizando la distribución para maximizar la entrada de luz solar.' },
      { title: 'La Solución', text: 'Eliminamos muros divisorios creando un espacio abierto. Revestimientos de roble claro y chimenea de mármol como eje central.' },
      { title: 'El Impacto', text: 'Un hogar cálido de estética minimalista atemporal con ventilación cruzada y espacios integrados para el descanso y trabajo.' }
    ],
    hotspots: [
      { id: 1, x: 62, y: 35, text: "Lambrín de madera maciza ranurada que unifica el espacio." },
      { id: 2, x: 42, y: 72, text: "Mesa de centro baja esculpida en mármol travertine pulido mate." },
      { id: 3, x: 80, y: 55, text: "Gabinetes flotantes minimalistas integrados en el muro." }
    ]
  },
  {
    id: 'polanco',
    title: 'Boutique Polanco',
    location: 'Retail de Alta Gama · Polanco, CDMX',
    beforeImage: '/projects/polanco_before.png',
    afterImage: '/projects/polanco_after.png',
    narrative: [
      { title: 'El Reto', text: 'Crear una experiencia de compra exclusiva en una de las avenidas más competitivas de CDMX, con un local de techos bajos.' },
      { title: 'La Solución', text: 'Piso de terrazo continuo claro, percheros flotantes de acero inoxidable pulido espejo y plafón de espejo para duplicar la altura visual.' },
      { title: 'El Impacto', text: 'Incremento del 40% en ventas en el primer trimestre. Una boutique minimalista donde el producto destaca como una obra de arte.' }
    ],
    hotspots: [
      { id: 1, x: 30, y: 65, text: "Estructuras perimetrales flotantes en acero inoxidable cepillado." },
      { id: 2, x: 68, y: 80, text: "Piso continuo de terrazo premium vaciado y pulido in situ." },
      { id: 3, x: 50, y: 35, text: "Sistema de iluminación focalizada oculta en cajillos de plafón." }
    ]
  }
];

const Projects = () => {
  const sectionRef = useRef(null);
  const beforeRefs = useRef([]);
  const lineRefs = useRef([]);

  // States to control active project index and narrative cards
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0); // 0 = none, 1 = Reto, 2 = Proceso, 3 = Resultado
  const [currentBeforeWidth, setCurrentBeforeWidth] = useState(100);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      // Disable scroll animation on tablet/mobile for usability
      if (window.innerWidth <= 1024) {
        setCurrentBeforeWidth(50);
        return;
      }

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Scrolled height inside sticky track
      const scrolled = Math.max(0, -sectionTop);
      const totalScrollable = sectionHeight - windowHeight;
      const progress = Math.min(1, scrolled / totalScrollable);

      // Divide total range [0, 1] into 3 zones, one for each project
      const numProjects = projectsData.length;
      const zoneSize = 1 / numProjects;

      const currentProjIdx = Math.min(
        numProjects - 1,
        Math.floor(progress / zoneSize)
      );

      // Local progress for the active project
      const localProgress = (progress - currentProjIdx * zoneSize) / zoneSize;
      const clampedLocalProgress = Math.max(0, Math.min(1, localProgress));

      // Wipe width: 100% down to 0%
      const beforeWidth = (1 - clampedLocalProgress) * 100;

      setActiveIndex(currentProjIdx);
      setCurrentBeforeWidth(beforeWidth);

      // DOM manipulations directly for high performance
      projectsData.forEach((_, idx) => {
        const beforeEl = beforeRefs.current[idx];
        const lineEl = lineRefs.current[idx];

        if (idx === currentProjIdx) {
          if (beforeEl) {
            beforeEl.style.clipPath = `inset(0 ${100 - beforeWidth}% 0 0)`;
          }
          if (lineEl) {
            lineEl.style.left = `${beforeWidth}%`;
          }
        }
      });

      // Synchronize narrative card highlight based on local progress
      if (clampedLocalProgress >= 0.05 && clampedLocalProgress < 0.35) {
        setActiveCard(1);
      } else if (clampedLocalProgress >= 0.38 && clampedLocalProgress < 0.68) {
        setActiveCard(2);
      } else if (clampedLocalProgress >= 0.71 && clampedLocalProgress <= 1.0) {
        setActiveCard(3);
      } else {
        setActiveCard(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="projects-section" ref={sectionRef} id="proyectos">
      <div className="projects-sticky-container">
        
        {/* Left Column: Stories (rendered absolute per project to crossfade) */}
        <div className="projects-overlay-narrative">
          {projectsData.map((project, projIdx) => (
            <div 
              key={project.id}
              className={`project-narrative-group ${projIdx === activeIndex ? 'active' : ''}`}
            >
              {/* Main Info */}
              <div className="project-info-header">
                <span className="project-eyebrow">Proyecto Destacado</span>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-location">{project.location}</p>
              </div>

              {/* Card 1: El Reto */}
              <div className={`narrative-card card-reto ${projIdx === activeIndex && activeCard === 1 ? 'active' : ''}`}>
                <span className="narrative-num">01</span>
                <div className="narrative-content">
                  <h4>{project.narrative[0].title}</h4>
                  <p>{project.narrative[0].text}</p>
                </div>
              </div>

              {/* Card 2: La Solución */}
              <div className={`narrative-card card-proceso ${projIdx === activeIndex && activeCard === 2 ? 'active' : ''}`}>
                <span className="narrative-num">02</span>
                <div className="narrative-content">
                  <h4>{project.narrative[1].title}</h4>
                  <p>{project.narrative[1].text}</p>
                </div>
              </div>

              {/* Card 3: El Resultado */}
              <div className={`narrative-card card-resultado ${projIdx === activeIndex && activeCard === 3 ? 'active' : ''}`}>
                <span className="narrative-num">03</span>
                <div className="narrative-content">
                  <h4>{project.narrative[2].title}</h4>
                  <p>{project.narrative[2].text}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom CTA block (Unified for all projects) */}
          <div className="projects-cta-box">
            <a href="#contacto" className="project-site-cta">
              <span>Hablemos de tu proyecto</span>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 1L13.5 6L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Visual Wipe Slider Frame */}
        <div className="projects-slider-frame">
          <div className="projects-slider-inner">
            {projectsData.map((project, projIdx) => {
              const isActive = projIdx === activeIndex;
              return (
                <div 
                  key={project.id}
                  className={`project-slider-wrapper ${isActive ? 'active' : ''}`}
                >
                  {/* Layer 1: AFTER (Finished Space) */}
                  <div className="project-image-layer layer-after">
                    <img 
                      src={project.afterImage} 
                      alt={`${project.title} Terminado`} 
                      className="slider-photo"
                    />
                    <div className="image-label after-label">Resultado Terminado</div>

                    {/* Hotspots (Only rendered and active on the finished layer) */}
                    {project.hotspots.map((hotspot) => {
                      // Hotspot is revealed when the slider line passes its position
                      // Since line moves from 100% to 0% left, the finished image is shown on the right (x > currentBeforeWidth)
                      const isRevealed = hotspot.x > currentBeforeWidth;
                      return (
                        <div
                          key={hotspot.id}
                          className={`hotspot ${isRevealed ? 'revealed' : ''}`}
                          style={{
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                          }}
                        >
                          <div className="hotspot-dot"></div>
                          <div className="hotspot-tooltip">
                            <p>{hotspot.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Layer 2: BEFORE (Blueprint/CAD Perspective) */}
                  <div 
                    className="project-image-layer layer-before"
                    ref={(el) => (beforeRefs.current[projIdx] = el)}
                  >
                    <img 
                      src={project.beforeImage} 
                      alt={`${project.title} Plano CAD`} 
                      className="slider-photo"
                    />
                    <div className="image-label before-label">Perspectiva CAD</div>
                  </div>

                  {/* Slider Dividing Line */}
                  <div 
                    className="slider-divider-line" 
                    ref={(el) => (lineRefs.current[projIdx] = el)}
                  >
                    <div className="slider-handle">
                      <div className="handle-icon">
                        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13 1L17 5L13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
