import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  ClipboardList,
  Lightbulb,
  Wrench,
  BarChart2,
  Handshake,
  Building2,
  Apple,
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
import { isSupabaseConfigured, supabase } from './supabaseClient';

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Quiénes Somos', chevron: false, action: 'scroll', target: 'about' },
  { label: 'Programas', chevron: true, action: 'scroll', target: 'services' },
  { label: 'Logros', chevron: false, action: 'scroll', target: 'testimonials' },
  { label: 'Servicios', chevron: true, action: 'modal', key: 'services' },
  { label: 'Contacto', chevron: false, action: 'scroll', target: 'contact' },
];

const MODALS = {
  services: {
    title: 'Servicios Digitales',
    body: 'El programa puede derivarte al equipo regional para iniciar tu registro, revisar tu caso y coordinar seguimiento clinico.',
    ctaLabel: 'Solicitar contacto',
    contactMessage: 'Quiero recibir informacion sobre los servicios digitales de ACCESSUS.',
  },
  advantages: {
    title: 'Ventajas del Paciente ACCESS',
    body: 'Acceso prioritario a especialistas, recetas digitales, red de distribucion aliada, costos preferenciales y seguimiento clinico continuo.',
    ctaLabel: 'Quiero acceder',
    contactMessage: 'Quiero acceder al programa ACCESSUS y conocer las ventajas para pacientes.',
  },
  moreInfo: {
    title: 'Sobre el Programa',
    body: 'ACCESSUS articula tecnologia, aliados medicos y acompanamiento regional para mejorar el acceso a tratamientos especializados.',
    ctaLabel: 'Hablar con el equipo',
    contactMessage: 'Quiero recibir mas informacion sobre el programa ACCESSUS.',
  },
  plans: {
    title: 'Planes de Tratamiento',
    body: 'Solicita una evaluacion inicial para orientar tu plan de seguimiento en hipertension arterial, insuficiencia cardiaca o diabetes.',
    ctaLabel: 'Solicitar plan',
    contactMessage: 'Quiero solicitar informacion sobre planes de tratamiento.',
  },
  tech: {
    title: 'Asistencia Tecnica',
    body: 'Canal para soporte en registro, recetas digitales, validacion de datos y seguimiento de solicitudes.',
    ctaLabel: 'Pedir asistencia',
    contactMessage: 'Necesito asistencia tecnica con el registro o seguimiento de ACCESSUS.',
  },
  other: {
    title: 'Otros Servicios',
    body: 'Consulta por laboratorio, entrega de medicamentos, educacion en salud preventiva y acompanamiento familiar.',
    ctaLabel: 'Consultar servicios',
    contactMessage: 'Quiero informacion sobre otros servicios de ACCESSUS.',
  },
  calc: {
    title: 'Calculadora Cardiovascular',
    body: 'Completa los campos para obtener una orientacion inicial. Este resultado no reemplaza una consulta medica.',
  },
  rse: {
    title: 'Apoyo Social',
    body: '<div class="modal-resource"><p>Canal para pacientes que necesitan orientacion sobre acceso, apoyo comunitario o acompanamiento familiar.</p><ul><li>Derivacion segun region.</li><li>Registro de necesidad social en el mensaje.</li><li>Contacto posterior del equipo ACCESSUS.</li></ul></div>',
    ctaLabel: 'Solicitar apoyo',
    contactMessage: 'Quiero solicitar orientacion sobre apoyo social o acompanamiento comunitario.',
  },
  centers: {
    title: 'Centros por Region',
    body: '<div class="modal-resource"><p>Selecciona tu ciudad en el formulario para que el equipo te indique el centro o profesional disponible.</p><ul><li>La Paz: derivacion al equipo regional.</li><li>Tarija: coordinacion con red local.</li><li>Chuquisaca: orientacion por disponibilidad.</li></ul></div>',
    ctaLabel: 'Buscar centro por mi region',
    contactMessage: 'Quiero ubicar el centro o equipo de salud disponible en mi region.',
  },
  nutrition: {
    title: 'Nutricion Saludable',
    body: '<div class="modal-resource"><p>Recomendaciones iniciales para pacientes con riesgo cardiovascular, hipertension o diabetes:</p><ul><li>Reducir sal, embutidos, sopas instantaneas y productos ultraprocesados.</li><li>Priorizar verduras, legumbres, avena, frutas enteras y proteinas magras.</li><li>Evitar bebidas azucaradas y controlar porciones de pan, arroz, papa y fideos.</li><li>Tomar agua y registrar presion/glucosa si el medico lo indico.</li></ul><div class="modal-links"><a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noreferrer">Guia OMS: dieta saludable</a><a href="https://www.paho.org/es/temas/nutricion" target="_blank" rel="noreferrer">OPS: nutricion</a><a href="https://www.heart.org/en/healthy-living/healthy-eating" target="_blank" rel="noreferrer">American Heart Association</a></div></div>',
    ctaLabel: 'Solicitar guia nutricional',
    contactMessage: 'Quiero recibir orientacion nutricional para mi condicion de salud.',
  },
};

const SERVICES = [
  { Icon: ClipboardList, label: 'Planes de Tratamiento', dot: 'violet', key: 'plans' },
  { Icon: Lightbulb, label: 'Asistencia Técnica', dot: 'cyan', key: 'tech' },
  { Icon: Wrench, label: 'Servicios Complementarios', dot: 'orange', key: 'other' },
];

const INFO_CARDS = [
  { Icon: BarChart2, label: 'Calculadora de riesgo', key: 'calc' },
  { Icon: Handshake, label: 'Apoyo social', key: 'rse' },
  { Icon: Building2, label: 'Centros por región', key: 'centers' },
  { Icon: Apple, label: 'Guía nutricional', key: 'nutrition' },
];

const TESTIMONIALS = [
  { name: 'Juan Carlos Mendoza', tag: 'PACIENTE ACCESS', image: testimonialImg, quote: 'Gracias al programa pude acceder a mi tratamiento cardiovascular de manera oportuna. La receta digital facilitó todo el proceso en Tarija.', sub: '¡Celebremos juntos una salud más inclusiva!' },
  { name: 'María Elena Quispe', tag: 'ÉXITO REGIONAL', image: slide1, quote: 'El seguimiento clínico digital me dio la tranquilidad de que mis antecedentes están seguros y siempre disponibles para mi médico.', sub: 'Innovación que salva vidas en La Paz.' },
  { name: 'Ricardo Vargas', tag: 'SALUD DIGITAL', image: slide2, quote: 'Nunca fue tan fácil recibir mis medicamentos. El sistema de Access Bolivia es verdaderamente revolucionario.', sub: 'Tecnología al servicio de Chuquisaca.' },
];

const REGIONAL_DOCTORS = {
  'La Paz': {
    name: 'Equipo medico regional La Paz',
    phone: '+591 70000001',
    whatsapp: '59170000001',
    specialty: 'Cardiologia y medicina interna',
  },
  Tarija: {
    name: 'Equipo medico regional Tarija',
    phone: '+591 70000002',
    whatsapp: '59170000002',
    specialty: 'Cardiologia y seguimiento clinico',
  },
  Chuquisaca: {
    name: 'Equipo medico regional Chuquisaca',
    phone: '+591 70000003',
    whatsapp: '59170000003',
    specialty: 'Medicina familiar y enfermedades cronicas',
  },
};

/* ──────────────────────────────────────────────
   APP
────────────────────────────────────────────── */
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', city: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [riskForm, setRiskForm] = useState({ age: '', pressure: '', diabetes: false, smoker: false });
  const [riskResult, setRiskResult] = useState(null);

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

  const openModal = (key) => {
    setRiskResult(null);
    setActiveModal(key);
  };
  const closeModal = () => setActiveModal(null);

  const startContactFlow = (message) => {
    setFormState(prevState => ({ ...prevState, message }));
    setActiveModal(null);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleNavClick = (link) => {
    if (link.action === 'scroll') {
      document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      openModal(link.key);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    setAssignedDoctor(null);

    const cleanedPhone = formState.phone.replace(/\D/g, '');
    const doctor = REGIONAL_DOCTORS[formState.city];

    if (!formState.name.trim() || cleanedPhone.length < 7 || !doctor) {
      setSubmitStatus('error');
      setSubmitMessage('Revisa que el nombre, telefono y ciudad esten completos.');
      setIsSubmitting(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setSubmitStatus('error');
      setSubmitMessage('Faltan las credenciales de Supabase en el archivo .env del frontend.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('pacientes_interesados').insert([
      {
        nombre_completo: formState.name.trim(),
        telefono: cleanedPhone,
        email: formState.email.trim() || null,
        departamento: formState.city,
        mensaje: formState.message.trim() || `Solicitud web asignada a ${doctor.name} (${doctor.phone})`,
        estado_contacto: 'nuevo',
        fecha_registro: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error en Supabase:', error);
      setSubmitStatus('error');
      setSubmitMessage('Supabase rechazo el registro. Revisa la tabla, politicas RLS y credenciales.');
    } else {
      setSubmitStatus('success');
      setAssignedDoctor(doctor);
      setFormState({ name: '', phone: '', email: '', city: '', message: '' });
    }

    setIsSubmitting(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { openModal('about'); setSearchQuery(''); }
  };

  const handleRiskChange = (e) => {
    const { id, value, checked, type } = e.target;
    setRiskForm(prevState => ({ ...prevState, [id]: type === 'checkbox' ? checked : value }));
  };

  const calculateRisk = (e) => {
    e.preventDefault();
    const age = Number(riskForm.age);
    const pressure = Number(riskForm.pressure);
    let score = 0;

    if (age >= 60) score += 3;
    else if (age >= 45) score += 2;
    else if (age >= 35) score += 1;

    if (pressure >= 160) score += 3;
    else if (pressure >= 140) score += 2;
    else if (pressure >= 130) score += 1;

    if (riskForm.diabetes) score += 2;
    if (riskForm.smoker) score += 2;

    const level = score >= 6 ? 'alto' : score >= 3 ? 'moderado' : 'bajo';
    const recommendation = level === 'alto'
      ? 'Recomendamos solicitar contacto medico prioritario.'
      : level === 'moderado'
        ? 'Conviene agendar una revision preventiva con el equipo regional.'
        : 'Mantener controles preventivos y habitos saludables.';

    setRiskResult({ level, recommendation });
  };

  return (
    <div>
      {/* ── MODAL ── */}
      {activeModal && MODALS[activeModal] && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Cerrar modal">×</button>
            <h2 className="gradient-text">{MODALS[activeModal].title}</h2>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: MODALS[activeModal].body }} />

            {activeModal === 'calc' && (
              <form className="modal-form" onSubmit={calculateRisk}>
                <div className="modal-form__grid">
                  <label>
                    Edad
                    <input id="age" type="number" min="1" max="110" value={riskForm.age} onChange={handleRiskChange} required />
                  </label>
                  <label>
                    Presion sistolica
                    <input id="pressure" type="number" min="80" max="240" value={riskForm.pressure} onChange={handleRiskChange} required />
                  </label>
                </div>
                <label className="modal-check">
                  <input id="diabetes" type="checkbox" checked={riskForm.diabetes} onChange={handleRiskChange} />
                  Diabetes diagnosticada
                </label>
                <label className="modal-check">
                  <input id="smoker" type="checkbox" checked={riskForm.smoker} onChange={handleRiskChange} />
                  Fuma actualmente
                </label>
                <button className="btn btn-secondary btn-full" type="submit">Calcular orientacion</button>
                {riskResult && (
                  <div className="risk-result">
                    <strong>Riesgo orientativo {riskResult.level}</strong>
                    <span>{riskResult.recommendation}</span>
                  </div>
                )}
              </form>
            )}

            <div className="modal-actions">
              {activeModal === 'calc' && riskResult && (
                <button
                  className="btn btn-primary"
                  onClick={() => startContactFlow(`Resultado calculadora cardiovascular: riesgo orientativo ${riskResult.level}. ${riskResult.recommendation}`)}
                >
                  Enviar resultado al equipo
                </button>
              )}
              {MODALS[activeModal].ctaLabel && (
                <button className="btn btn-primary" onClick={() => startContactFlow(MODALS[activeModal].contactMessage)}>
                  {MODALS[activeModal].ctaLabel}
                </button>
              )}
              <button className="btn btn-dark" onClick={closeModal}>Cerrar</button>
            </div>
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

      {/* ── ABOUT ── */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">◈ Quiénes Somos</p>
            <h2 className="section-head__title">Un modelo de acceso a la salud<br />con propósito social</h2>
            <p className="section-head__sub">
              ACCESSUS es una alianza estratégica entre <b>Novartis, Salud y Bienestar Bagó, CEAS y PROCOSI</b> para revolucionar el acceso a tratamientos especializados en Bolivia.
            </p>
          </div>
          <div className="about__grid">
            <div className="about-card">
              <h3 className="about-card__title">Nuestra Misión</h3>
              <p className="about-card__text">
                Facilitar el acceso sostenible a medicamentos de calidad a precios asequibles para pacientes vulnerables, especialmente con enfermedades crónicas. Articulamos una red de médicos y aliados para convertir la prescripción en acceso real, mediante un modelo de distribución eficiente, trazable y de bajo margen.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card__title">Nuestra Visión</h3>
              <p className="about-card__text">
                Consolidarnos como un modelo nacional de acceso a medicamentos, sostenible y escalable. Buscamos ampliar nuestra cobertura, incorporar nuevas terapias y ser un referente de innovación social en salud, combinando eficiencia, precios accesibles e impacto humano en todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>


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

      {/* ── CONTACT / REGISTER ── */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">◈ Únete al Programa</p>
            <h2 className="section-head__title">Regístrate y ponte en contacto<br />con nuestros especialistas</h2>
            <p className="section-head__sub">
              Completa el formulario para iniciar tu proceso de afiliación. Nuestro equipo te contactará para guiarte en los siguientes pasos.
            </p>
          </div>
          <div className="contact__layout">
            <div className="contact__form-wrap">
              <form className="contact__form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input type="text" id="name" placeholder="Ej: Ana Quispe" value={formState.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Número de Celular</label>
                  <input type="tel" id="phone" placeholder="Ej: 76543210" value={formState.phone} onChange={handleFormChange} minLength="7" required />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Ciudad de Residencia</label>
                  <select id="city" value={formState.city} onChange={handleFormChange} required>
                    <option value="" disabled>Selecciona tu ciudad</option>
                    {Object.keys(REGIONAL_DOCTORS).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea id="message" placeholder="CuÃ©ntanos brevemente quÃ© necesitas" value={formState.message} onChange={handleFormChange} rows="4" />
                </div>
                {formState.city && (
                  <div className="contact__doctor-preview">
                    <span>Especialista asignado</span>
                    <strong>{REGIONAL_DOCTORS[formState.city].name}</strong>
                    <small>{REGIONAL_DOCTORS[formState.city].specialty}</small>
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud de Registro'} <ArrowRight size={16} />
                </button>
                {submitStatus === 'success' && assignedDoctor && (
                  <div className="contact__success" role="status">
                    <h3>Solicitud registrada correctamente</h3>
                    <p>Te derivamos con {assignedDoctor.name}. Puedes escribir por WhatsApp o esperar el contacto del equipo.</p>
                    <a className="btn btn-secondary btn-full" href={`https://wa.me/${assignedDoctor.whatsapp}`} target="_blank" rel="noreferrer">
                      Contactar por WhatsApp <ArrowRight size={16} />
                    </a>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <p className="contact__error" role="alert">
                    {submitMessage || 'No pudimos registrar la solicitud. Revisa los datos o confirma las variables de Supabase.'}
                  </p>
                )}
              </form>
            </div>
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
