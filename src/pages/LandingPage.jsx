// src/pages/LandingPage.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'; // Para navegación SPA

// --- Iconos SVG como Componentes ---
const LineChartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
);
const PieChartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
);
const CalculatorIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
);
const EditIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const TargetIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const StarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

// --- Componente: Cabecera (Header) ---
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
                Finanzi<span className="text-cyan-400">App</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Funcionalidades</a>
                <a href="#dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors">Dashboard</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">Cómo Funciona</a>
            </nav>
            <div>
                <Link to="/login" className="text-gray-300 hover:text-white mr-4">Iniciar Sesión</Link>
                <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                    Regístrate Gratis
                </Link>
            </div>
        </div>
    </header>
);

// --- Componente: Sección Hero ---
const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center p-4 text-center bg-slate-900 overflow-hidden">
        {/* Fondo animado sutil */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white animate-fade-in-up">
                Visualiza y Construye tu Futuro Financiero
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                La herramienta definitiva para gestionar tu <span className="text-cyan-400 font-semibold">presupuesto editable</span>, analizar tu <span className="text-purple-400 font-semibold">patrimonio neto</span> y alcanzar la libertad financiera con datos claros y potentes visualizaciones.
            </p>
            <Link to="/dashboard" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
                Accede a tu Dashboard
            </Link>
        </div>
    </section>
);

// --- Componente: Tarjeta de Funcionalidad ---
const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 p-8 rounded-xl shadow-2xl hover:shadow-cyan-500/10 transform hover:-translate-y-2 transition-all duration-400 border border-slate-700 hover:border-cyan-400/50">
        <div className="mb-5 text-cyan-400">{icon}</div>
        <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);

// --- Componente: Sección de Funcionalidades Clave ---
const FeaturesSection = () => (
    <section id="features" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Diseñado para el Control Total</h2>
            <p className="text-xl text-gray-400 mb-16">Herramientas precisas que responden a tus necesidades financieras.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard icon={<CalculatorIcon className="w-12 h-12" />} title="Presupuestos Flexibles">
                    Define presupuestos anuales con categorías y subcategorías. Calcula tu "remanente" y ajusta sobre la marcha.
                </FeatureCard>
                <FeatureCard icon={<LineChartIcon className="w-12 h-12" />} title="Análisis de Patrimonio">
                    Registra tus activos y pasivos. Observa la evolución de tu patrimonio neto con gráficos de línea interactivos.
                </FeatureCard>
                <FeatureCard icon={<EditIcon className="w-12 h-12" />} title="Edición en Línea">
                    Modifica tu presupuesto o los valores de tu patrimonio directamente en las tablas. Rápido, fácil e intuitivo.
                </FeatureCard>
                <FeatureCard icon={<PieChartIcon className="w-12 h-12" />} title="Seguimiento Mensual">
                    Registra tus ingresos y gastos reales, compáralos con tu presupuesto y visualiza la distribución con gráficos.
                </FeatureCard>
            </div>
        </div>
    </section>
);

// --- Componente: Vista Previa del Dashboard (Más Realista) ---
const DashboardPreviewSection = () => (
    <section id="dashboard" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Tu Centro de Mando Financiero</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">Una interfaz intuitiva, potente y con toda la información que importa de un solo vistazo.</p>

            {/* Maqueta del dashboard */}
            <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-900/70 rounded-2xl border border-slate-700 shadow-2xl">
                {/* Header de la maqueta */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button className='px-3 py-1 text-sm rounded-md bg-blue-600'>Gráficos</button>
                        <button className='px-3 py-1 text-sm rounded-md hover:bg-slate-700'>Presupuesto</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="bg-slate-700 text-white p-2 rounded-md text-sm border border-slate-600">
                            <option>{new Date().getFullYear()}</option>
                        </select>
                    </div>
                </div>

                {/* Contenido de la maqueta */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Gráfico de Patrimonio Neto */}
                    <div className="lg:col-span-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-white mb-4 text-left text-sm">Evolución Anual del Patrimonio Neto</h4>
                        <div className="w-full h-48 flex items-end space-x-2 p-2">
                            {/* Simulación de gráfico de línea con SVGs */}
                            <svg width="100%" height="100%" viewBox="0 0 100 50">
                                {/* Activos (verde, generalmente sube) */}
                                <path d="M 5 40 C 15 10, 25 15, 35 25 S 55 30, 65 20 S 85 25, 95 10" stroke="#82ca9d" fill="none" strokeWidth="1.5"/>
                                {/* Pasivos (rojo, DEBERÍA BAJAR, así que los valores Y aumentan en SVG) */}
                                <path d="M 5 35 C 15 32, 25 28, 35 25 S 55 22, 65 18 S 85 15, 95 12" stroke="#ef4444" fill="none" strokeWidth="1.5"/>
                                {/* Patrimonio Neto (azul, activos - pasivos, generalmente sube) */}
                                <path d="M 5 20 C 15 -5, 25 -2, 35 10 S 55 12, 65 5 S 85 8, 95 -5" stroke="#8884d8" fill="none" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>

                    {/* Gráfico de Tarta */}
                    <div className="lg:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col">
                        <h4 className="font-bold text-white mb-4 text-left text-sm">Distribución de Gastos</h4>
                        <div className="w-full h-48 flex justify-center items-center">
                            {/* Simulación de gráfico de tarta con SVGs */}
                            <svg width="100" height="100" viewBox="0 0 36 36" className="transform -rotate-90">
                                <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f97316" strokeWidth="3.8"/>
                                <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#ca8a04" strokeWidth="3.8" strokeDasharray="40 100"/>
                                <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#b91c1c" strokeWidth="3.8" strokeDasharray="20 100" strokeDashoffset="-40"/>
                                <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#059669" strokeWidth="3.8" strokeDasharray="15 100" strokeDashoffset="-60"/>
                            </svg>
                        </div>
                    </div>

                    {/* Tabla de Presupuesto */}
                    <div className="lg:col-span-5 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-white mb-4 text-left text-sm">Resumen de Movimientos</h4>
                        <div className="w-full h-24 bg-cover bg-center rounded-md opacity-70" style={{backgroundImage: "url('https://placehold.co/1200x200/1e293b/475569?text=Tabla+de+Movimientos+Reales+vs+Presupuesto')"}}></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- NUEVA SECCIÓN: Cómo Funciona ---
const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Empieza en 3 Simples Pasos</h2>
            <p className="text-xl text-gray-400 mb-16">Toma el control de tu dinero de forma rápida e intuitiva.</p>
            <div className="relative">
                {/* Línea de conexión */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2"></div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-4 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-cyan-400">
                            <CalculatorIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-white">1. Define tu Plan</h3>
                        <p className="text-gray-400">Crea tu presupuesto anual. Asigna montos a tus categorías de ingresos, gastos y ahorros.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-4 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-cyan-400">
                            <EditIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-white">2. Registra Movimientos</h3>
                        <p className="text-gray-400">Usa el formulario de registro rápido para añadir tus gastos e ingresos diarios en segundos.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-4 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-cyan-400">
                            <LineChartIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-white">3. Analiza y Crece</h3>
                        <p className="text-gray-400">Visualiza tu progreso, compara lo real con lo presupuestado y ve crecer tu patrimonio neto.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);


// --- Componente: Tarjeta de Testimonio ---
const TestimonialCard = ({ quote, name, role, image }) => (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700 h-full flex flex-col justify-between">
        <p className="text-gray-300 italic mb-6">"{quote}"</p>
        <div className="flex items-center mt-auto">
            <img src={image} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/64748b/e2e8f0?text=U'; }} alt={name} className="w-12 h-12 rounded-full mr-4 border-2 border-cyan-400" />
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
                <div className="flex mt-1 text-yellow-400">
                    <StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" />
                </div>
            </div>
        </div>
    </div>
);

// --- Componente: Sección de Testimonios ---
const TestimonialsSection = () => (
    <section id="testimonials" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">Historias de Éxito Reales</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TestimonialCard
                    name="Carlos Rodríguez"
                    role="Ingeniero de Software"
                    quote="El gráfico de patrimonio neto es un cambio de juego. Verlo crecer cada mes me motiva a seguir mi plan y reducir deudas. ¡Increíblemente poderoso!"
                    image="https://placehold.co/100x100/64748b/e2e8f0?text=CR"
                />
                <TestimonialCard
                    name="Ana Gómez"
                    role="Diseñadora Freelance"
                    quote="Gestionar mis ingresos variables era un caos. Con el presupuesto editable y el seguimiento mensual, ahora sé exactamente de cuánto 'remanente' dispongo."
                    image="https://placehold.co/100x100/64748b/e2e8f0?text=AG"
                />
                <TestimonialCard
                    name="Javier Torres"
                    role="Pequeño Empresario"
                    quote="Los informes visuales son perfectos para entender al instante la salud financiera de mi familia. Tomamos mejores decisiones gracias a la claridad que nos da."
                    image="https://placehold.co/100x100/64748b/e2e8f0?text=JT"
                />
            </div>
        </div>
    </section>
);

// --- Componente: Pie de página (Footer) ---
const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 text-gray-400">
        <div className="container mx-auto px-6 text-center">
            <p className="text-2xl font-bold text-white mb-6">
                Finan<span className="text-cyan-400">Zen</span>
            </p>
            <p>&copy; {new Date().getFullYear()} FinanziApp. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">Hecho con ❤️ para tu tranquilidad financiera.</p>
        </div>
    </footer>
);

// --- Componente Principal de la Página ---
function LandingPage() { // <-- RENOMBRADO AQUÍ
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <DashboardPreviewSection />
                <HowItWorksSection />
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;