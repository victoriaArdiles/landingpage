import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  ClipboardList,
  Lightbulb,
  ShieldCheck,
  Wrench,
  BarChart2,
  Handshake,
  Building2,
  Apple,
  Newspaper,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

import logo from './assets/logo.png';
import heroDoctor from './assets/hero_doctor.png';
import testimonialImg from './assets/testimonial.png';
import slide1 from './assets/slide1.png';
import slide2 from './assets/slide2.png';

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Somos Access', chevron: true, action: 'modal', key: 'about' },
  { label: 'Programas', chevron: true, action: 'scroll', target: 'services' },
  { label: 'Logros', chevron: false, action: 'scroll', target: 'testimonials' },
  { label: 'Servicios', chevron: true, action: 'modal', key: 'services' },
  { label: 'Ubicaciones', chevron: false, action: 'modal', key: 'locations' },
];

const MODALS = {
  about: { title: 'Somos ACCESS Bolivia', body: 'Accessus es una alianza estratégica entre <b>Novartis, Salud y Bienestar Bagó, CEAS, Medibook y PROCOSI</b> para revolucionar el acceso a tratamientos cardiovasculares especializados en Bolivia.' },
  services: { title: 'Servicios Digitales', body: 'Próximamente: Consulta en línea, Farmacia Digital, Historial Clínico Compartido y Pago Seguro integrado.' },
  locations: { title: 'Centros Aliados', body: 'Operamos en <b>La Paz, Tarija y Chuquisaca</b>. Próximamente: mapa interactivo con todos nuestros centros de salud aliados.' },
  advantages: { title: 'Ventajas del Paciente ACCESS', body: '✅ Acceso prioritario a especialistas<br/>✅ Recetas digitales inmediatas<br/>✅ Red de distribución Novartis y Bagó<br/>✅ Costos preferenciales y subsidios<br/>✅ Seguimiento clínico digital continuo' },
  moreInfo: { title: 'Sobre el Programa', body: 'Desde el 14 de noviembre de 2024, ACCESS Bolivia integra tecnología médica de vanguardia con el compromiso de mejorar la calidad de vida de los pacientes más vulnerables del país.' },
  plans: { title: 'Planes de Tratamiento', body: 'Personalización de dosis y seguimiento clínico continuo adaptado a cada paciente con hipertensión arterial, insuficiencia cardíaca y diabetes.' },
  tech: { title: 'Asistencia Técnica', body: 'Soporte digital 24/7 para médicos y farmacias en la emisión, validación y trazabilidad de recetas electrónicas.' },
  insurance: { title: 'Seguro Salud', body: 'Cobertura extendida y telemedicina para emergencias cardíacas, con acceso a prestadores aliados en todo el país.' },
  other: { title: 'Más Servicios', body: 'Laboratorio a domicilio, entrega de medicamentos por delivery asegurado, y programas de educación en salud preventiva.' },
  calc: { title: 'Calculadora Cardiovascular', body: 'Próximamente: Ingresa tus datos clínicos para estimar tu riesgo coronario y recibir recomendaciones personalizadas.' },
  rse: { title: 'Responsabilidad Social', body: 'Apoyamos el medioambiente con farmacias ecológicas, reducción de papel y programas de reforestación junto a comunidades rurales.' },
  centers: { title: 'Centros de Salud', body: 'Más de 184 centros distribuidos en La Paz, Tarija y Sucre. Próximamente: mapa interactivo integrado.' },
  nutrition: { title: 'Nutrición Saludable', body: 'Tips y planes de alimentación diseñados por especialistas para pacientes hipertensos, diabéticos y con enfermedades cardíacas.' },
  press: { title: 'Sala de Prensa', body: 'Últimas noticias y comunicados oficiales sobre el programa ACCESS Bolivia. Lanzamiento oficial: 14 de noviembre de 2024.' },
};

const SERVICES = [
  { Icon: ClipboardList, label: 'Planes de Tratamiento', dot: 'violet', key: 'plans' },
  { Icon: Lightbulb, label: 'Asistencia Técnica', dot: 'cyan', key: 'tech' },
  { Icon: ShieldCheck, label: 'Seguro Salud', dot: 'magenta', key: 'insurance' },
  { Icon: Wrench, label: 'Otros Servicios', dot: 'orange', key: 'other' },
];

const INFO_CARDS = [
  { Icon: BarChart2, label: 'Calculadora', key: 'calc' },
  { Icon: Handshake, label: 'RSE', key: 'rse' },
  { Icon: Building2, label: 'Centros', key: 'centers' },
  { Icon: Apple, label: 'Nutrición', key: 'nutrition' },
  { Icon: Newspaper, label: 'Prensa', key: 'press' },
];

const TESTIMONIALS = [
  { name: 'Juan Carlos Mendoza', tag: 'PACIENTE ACCESS', image: testimonialImg, quote: 'Gracias al programa pude acceder a mi tratamiento cardiovascular de manera oportuna. La receta digital facilitó todo el proceso en Tarija.', sub: '¡Celebremos juntos una salud más inclusiva!' },
  { name: 'María Elena Quispe', tag: 'ÉXITO REGIONAL', image: slide1, quote: 'El seguimiento clínico digital me dio la tranquilidad de que mis antecedentes están seguros y siempre disponibles para mi médico.', sub: 'Innovación que salva vidas en La Paz.' },
  { name: 'Ricardo Vargas', tag: 'SALUD DIGITAL', image: slide2, quote: 'Nunca fue tan fácil recibir mis medicamentos. El sistema de Access Bolivia es verdaderamente revolucionario.', sub: 'Tecnología al servicio de Chuquisaca.' },
];

/* ──────────────────────────────────────────────
   APP
────────────────────────────────────────────── */
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Fetch real stats from Django API ──
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stats/')
      .then(res => res.json())
      .then(data => { setStats(data); setStatsLoading(false); })
      .catch(() => {
        // Fallback to defaults if backend unreachable
        setStats({ pacientes_atendidos: 12500, medicos_aliados: 500, centros_de_salud: 184, municipios: 37 });
        setStatsLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const handleNavClick = (link) => {
    if (link.action === 'scroll') {
      document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      openModal(link.key);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { openModal('about'); setSearchQuery(''); }
  };

  return (
    <div>
      {/* ── MODAL ── */}
      {activeModal && MODALS[activeModal] && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <h2 className="gradient-text">{MODALS[activeModal].title}</h2>
            <p dangerouslySetInnerHTML={{ __html: MODALS[activeModal].body }} />
            <button className="btn btn-primary" onClick={closeModal}>Entendido</button>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="Accessus" className="navbar__logo" />
            <div className="navbar__brand-text">
              <span className="navbar__name">ACCESSUS</span>
              <span className="navbar__sub">Programa de Salud</span>
            </div>
          </div>

          <ul className="navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="navbar__link" onClick={() => handleNavClick(link)}>
                {link.label}
                {link.chevron && <ChevronDown size={12} className="chevron-icon" />}
              </li>
            ))}
          </ul>

          <div className="navbar__right">
            <form className="navbar__search" onSubmit={handleSearch}>
              <Search size={15} className="navbar__search-icon" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="hero__inner container">
          <div className="hero__content">
            <p className="hero__eyebrow">Programa Nacional de Salud Digital</p>
            <h1 className="hero__title">
              Tu salud es<br />
              <span className="gradient-text">nuestra prioridad</span>
            </h1>
            <p className="hero__desc">
              Accede a tratamientos cardiovasculares especializados, recetas digitales
              y seguimiento clínico continuo de forma rápida y segura.
            </p>
            <div className="hero__actions">
              <button className="btn btn-primary" onClick={() => openModal('advantages')}>
                Conoce las ventajas
              </button>
              <button className="btn btn-secondary" onClick={() => openModal('moreInfo')}>
                Saber más
              </button>
            </div>
            <div className="hero__pills">
              <div className="hero__pill">Pacientes: <span>12.500+</span></div>
              <div className="hero__pill">Médicos aliados: <span>500+</span></div>
              <div className="hero__pill">Municipios: <span>37</span></div>
            </div>
          </div>
          <div className="hero__image">
            <img src={heroDoctor} alt="Profesional de salud Accessus" className="hero__img" />
          </div>
        </div>
      </header>

      {/* ── SERVICES ── */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">◈ Productos y Servicios</p>
            <h2 className="section-head__title">Todo lo que necesitas<br />para tu salud</h2>
            <p className="section-head__sub">Diseñados para pacientes de bajos recursos en La Paz, Tarija y Chuquisaca.</p>
          </div>
          <div className="services__grid">
            {SERVICES.map(({ Icon, label, dot, key }) => (
              <div key={key} className="service-card" onClick={() => openModal(key)}>
                <div className={`service-card__dot service-card__dot--${dot}`} />
                <div className="service-card__body">
                  <div className="service-card__icon-wrap">
                    <Icon size={36} strokeWidth={1.5} />
                  </div>
                  <div className="service-card__label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">◈ Logros que Inspiran</p>
            <h2 className="section-head__title">Vidas transformadas<br />por ACCESS Bolivia</h2>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6500 }}
            className="testimonials-swiper"
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="testimonial-slide">
                  <div className="testimonial-slide__img-wrap">
                    <img src={t.image} alt={t.name} className="testimonial-slide__img" />
                  </div>
                  <div className="testimonial-slide__content">
                    <span className="tag tag-cyan testimonial-slide__tag">{t.tag}</span>
                    <h3 className="testimonial-slide__name">{t.name}</h3>
                    <p className="testimonial-slide__quote">"{t.quote}"</p>
                    <p className="testimonial-slide__sub">{t.sub}</p>
                    <button className="btn btn-dark" onClick={() => alert('Iniciando proceso de registro...')}>
                      Tú también puedes acceder <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="impact">
        <div className="impact__inner container">
          <div className="impact__text">
            <h3 className="impact__title">Comprometidos con el desarrollo saludable de toda Bolivia</h3>
          </div>
          <div className="impact__stats">
            {statsLoading ? (
              <div className="stat-skeleton">Cargando datos...</div>
            ) : (
              <>
                <div className="stat"><span className="stat__num">{stats?.pacientes_atendidos?.toLocaleString('es-BO')}</span><span className="stat__label">Pacientes atendidos</span></div>
                <div className="stat"><span className="stat__num">{stats?.medicos_aliados}+</span><span className="stat__label">Médicos aliados</span></div>
                <div className="stat"><span className="stat__num">{stats?.centros_de_salud}</span><span className="stat__label">Centros de salud</span></div>
                <div className="stat"><span className="stat__num">{stats?.municipios}</span><span className="stat__label">Municipios alcanzados</span></div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="info">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">◈ Recursos</p>
            <h2 className="section-head__title">Infórmate más</h2>
          </div>
          <div className="info__grid">
            {INFO_CARDS.map(({ Icon, label, key }) => (
              <div key={key} className="info-card" onClick={() => openModal(key)}>
                <Icon size={32} strokeWidth={1.5} className="info-card__icon" />
                <div className="info-card__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <img src={logo} alt="Accessus" className="footer__logo" />
          <p className="footer__copy">© 2026 ACCESS BOLIVIA. Impulsando la salud tecnológica e inclusiva en Bolivia.</p>
        </div>
      </footer>
    </div>
  );
}
