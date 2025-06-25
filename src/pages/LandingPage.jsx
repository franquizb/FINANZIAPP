import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- Iconos de LucideReact ---
import {
    LineChart, PieChart, Calculator, Pencil, Star, ArrowRight, Rocket,
    ShieldCheck, Lock, EyeOff, CheckCircle
} from 'lucide-react';

// --- Función Helper para formatear moneda ---
const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);

// --- Componente: Cabecera (Header) ---
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="text-cyan-400" size={24} />
                Finan<span className="text-cyan-400">Zen</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Funcionalidades</a>
                <a href="#dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Dashboard</a>
                <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Precios</a>
                <a href="#testimonials" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Testimonios</a>
            </nav>
            <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium">
                    Iniciar Sesión
                </Link>
                <Link to="/register" className="group relative flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-5 rounded-full shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                        Regístrate Gratis <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </Link>
            </div>
        </div>
    </header>
);

// --- Componente: Sección Hero ---
const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center p-4 text-center bg-slate-900 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-[-100px] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-100px] left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 animate-fade-in-up" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
                Construye tu Futuro Financiero con Claridad
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                La herramienta definitiva para gestionar tu <span className="text-cyan-400 font-semibold">presupuesto personal</span>, analizar tu <span className="text-purple-400 font-semibold">patrimonio neto</span> y alcanzar la libertad financiera.
            </p>
            <a href="#dashboard" className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/40 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-bounce-in flex items-center gap-3" style={{ animationDelay: '0.6s' }}>
                Ver el Dashboard en Acción
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
        </div>
    </section>
);


// --- [NUEVO] Componente: Prueba Social ---
const SocialProofSection = () => (
    <section id="social-proof" className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-6">
            <h2 className="text-center text-slate-400 font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
                Como Visto En Medios de Confianza
            </h2>
            <div className="flex justify-around items-center flex-wrap gap-y-6 gap-x-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <span className="text-3xl font-bold text-slate-500 transition-colors hover:text-white">Forbes</span>
                <span className="text-3xl font-bold text-slate-500 transition-colors hover:text-white">TechCrunch</span>
                <span className="text-3xl font-bold text-slate-500 transition-colors hover:text-white">El País</span>
                <span className="text-3xl font-bold text-slate-500 transition-colors hover:text-white">Wired</span>
                <span className="text-3xl font-bold text-slate-500 transition-colors hover:text-white">Expansión</span>
            </div>
        </div>
    </section>
);


// --- Componente: Tarjeta de Funcionalidad ---
const FeatureCard = ({ icon, title, children, delay }) => (
    <div className="bg-slate-800/50 p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-400 border border-slate-700/80 group hover:border-cyan-400/50 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"></div>
        <div className="relative">
            <div className="mb-5 p-3 bg-slate-900/50 border border-slate-700 rounded-xl inline-block text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{children}</p>
        </div>
    </div>
);

// --- Componente: Sección de Funcionalidades Clave ---
const FeaturesSection = () => (
    <section id="features" className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Diseñado para el <span className="text-cyan-400">Control Total</span></h2>
            <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto">Herramientas precisas y visuales que responden a tus necesidades financieras.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard icon={<Calculator className="w-10 h-10" />} title="Presupuestos Flexibles" delay={0.1}>
                    Define presupuestos anuales con categorías. Calcula tu "remanente" y ajusta sobre la marcha de forma intuitiva.
                </FeatureCard>
                <FeatureCard icon={<LineChart className="w-10 h-10" />} title="Análisis de Patrimonio" delay={0.2}>
                    Registra activos y pasivos. Observa la evolución de tu patrimonio neto con gráficos interactivos y claros.
                </FeatureCard>
                <FeatureCard icon={<Pencil className="w-10 h-10" />} title="Edición en Línea" delay={0.3}>
                    Modifica tu presupuesto o los valores de tu patrimonio directamente en las tablas. Rápido, fácil e intuitivo.
                </FeatureCard>
                <FeatureCard icon={<PieChart className="w-10 h-10" />} title="Seguimiento Mensual" delay={0.4}>
                    Registra tus ingresos y gastos reales, compáralos con tu presupuesto y visualiza la distribución con gráficos.
                </FeatureCard>
            </div>
        </div>
    </section>
);

// --- Componente: Vista Previa del Dashboard ---
const DashboardPreviewSection = () => {
    // La lógica de datos y estado permanece igual
    const currentSystemYear = new Date().getFullYear();
    const futureYears = Array.from({ length: 4 }, (_, i) => currentSystemYear + i);
    const [selectedYear, setSelectedYear] = useState(currentSystemYear);
    
    const mockData = useMemo(() => {
        const yearIndex = selectedYear - currentSystemYear;
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const baseBudget = { nomina: 2200, otrosIngresos: 150, alquiler: 850, comida: 400, suministros: 120, prestamo: 280 };
        let multiplier = 1.05 * Math.pow(1.03, Math.max(0, yearIndex - 1));
        if (yearIndex === 0) multiplier = 1;
        const budget = Object.entries(baseBudget).reduce((acc, [key, value]) => ({ ...acc, [key]: value * multiplier }), {});
        const totalIngresos = budget.nomina + budget.otrosIngresos;
        const totalGastos = budget.alquiler + budget.comida + budget.suministros + budget.prestamo;
        budget.remanente = totalIngresos - totalGastos;

        const netWorthData = months.map((month, i) => {
            const progress = i / 11;
            const baseAssets = 40000 + (yearIndex * 15000) + (progress * 20000);
            const volatilityAssets = (Math.sin(i / 1.5 + yearIndex) * 7000) + (Math.cos(i / 3) * 3000);
            const baseLiabilities = 25000 + (yearIndex * 4000) - (progress * 8000);
            const volatilityLiabilities = (Math.cos(i / 2 + yearIndex) * 2000);
            const activos = baseAssets + volatilityAssets;
            const pasivos = baseLiabilities + volatilityLiabilities;
            return { name: month, Activos: activos, Pasivos: pasivos, 'Patrimonio Neto': activos - pasivos };
        });

        const expenseData = [
            { name: 'Vivienda y Suministros', value: 45 + yearIndex * 2, color: '#0e7490' },
            { name: 'Ocio y Compras', value: 20 - yearIndex * 1, color: '#be185d' },
            { name: 'Deudas', value: 20, color: '#991b1b' },
            { name: 'Ahorro e Inversión', value: 15 + yearIndex * 4, color: '#065f46' },
        ];
        return { netWorthData, expenseData, budget };
    }, [selectedYear, currentSystemYear]);

    // Componentes de gráficos simulados (sin cambios)
    const SimulatedLineChart = ({ data }) => {
        const maxValue = Math.max(...data.map(p => p.Activos));
        const toPath = (points, smooth = false) => {
            if (!points.length) return "";
            const [startX, startY] = points[0];
            let d = `M ${startX} ${startY}`;
            if (!smooth) {
                points.slice(1).forEach(([x, y]) => d += ` L ${x} ${y}`);
                return d;
            }
            for (let i = 0; i < points.length - 1; i++) {
                const [x1, y1] = points[i];
                const [x2, y2] = points[i + 1];
                const midX = (x1 + x2) / 2;
                d += ` C ${midX},${y1} ${midX},${y2} ${x2},${y2}`;
            }
            return d;
        };
        const points = (key) => data.map((p, i) => [(i / (data.length - 1)) * 100, 100 - (p[key] / maxValue) * 95]);
        
        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex-grow relative">
                    <svg width="100%" height="100%" className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8884d8" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        {[...Array(4)].map((_, i) => <line key={i} x1="0" x2="100" y1={(i + 1) * 20} y2={(i + 1) * 20} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>)}
                        
                        <path d={toPath(points('Patrimonio Neto'), true)} fill="url(#netWorthGradient)" stroke="none" />
                        <path d={toPath(points('Activos'), true)} fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="4 2"/>
                        <path d={toPath(points('Pasivos'), true)} fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 2"/>
                        <path d={toPath(points('Patrimonio Neto'), true)} fill="none" stroke="#6366f1" strokeWidth="2.5" />
                    </svg>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    {data.map(p => <span key={p.name}>{p.name}</span>)}
                </div>
            </div>
        );
    };
    
    const SimulatedDonutChart = ({ data }) => {
        let cumulativePercent = 0;
        return (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                <svg width="160" height="160" viewBox="0 0 36 36" className="transform -rotate-90">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                    {data.map(segment => {
                        const percent = segment.value;
                        const dashoffset = cumulativePercent;
                        cumulativePercent += percent;
                        return <circle key={segment.name} cx="18" cy="18" r="15.9155" fill="transparent" stroke={segment.color} strokeWidth="4" strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={-dashoffset} className="transition-all duration-500"/>
                    })}
                </svg>
                <div className="grid grid-cols-2 justify-center gap-x-6 gap-y-2 text-sm">
                    {data.map(segment => (
                        <div key={segment.name} className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: segment.color}}></span>
                            <span className="text-slate-300">{segment.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    };
    
    // El componente principal de la sección (sin cambios)
    return (
        <section id="dashboard" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800/80">
            <div className="container mx-auto px-6">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Tu Centro de Mando Financiero</h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto">Interactúa con una vista previa de nuestro dashboard y descubre su poder.</p>
                </div>
                <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-900/70 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-sm">
                    <div className="flex justify-end items-center mb-6 px-2">
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-slate-800 text-white py-2 px-4 rounded-lg text-sm border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                        >
                            {futureYears.map(year => <option key={year} value={year}>Año {year}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 h-[320px]">
                                <h4 className="font-bold text-white text-left text-lg mb-4">Evolución del Patrimonio Neto</h4>
                                <SimulatedLineChart data={mockData.netWorthData} />
                            </div>
                            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 h-[320px]">
                                <h4 className="font-bold text-white text-left text-lg mb-4">Distribución de Gastos</h4>
                                <SimulatedDonutChart data={mockData.expenseData} />
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-slate-800/60 p-6 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-white text-lg">Presupuesto Mensual</h4>
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 px-4 rounded-xl text-center shadow-lg border border-purple-400/50">
                                    <span className="block text-xs text-purple-200 font-bold tracking-wider">REMANENTE</span>
                                    <span className="text-2xl font-bold text-white tracking-tighter">{formatCurrency(mockData.budget.remanente)}</span>
                                </div>
                            </div>
                            <div className="space-y-6 text-sm">
                                <BudgetCategory title="INGRESOS" color="#22c55e" items={[
                                    { label: 'Nómina', value: mockData.budget.nomina },
                                    { label: 'Otros', value: mockData.budget.otrosIngresos }
                                ]}/>
                                <BudgetCategory title="GASTOS ESENCIALES" color="#f97316" items={[
                                    { label: 'Alquiler/Hipoteca', value: mockData.budget.alquiler },
                                    { label: 'Comida', value: mockData.budget.comida },
                                    { label: 'Suministros', value: mockData.budget.suministros }
                                ]}/>
                                <BudgetCategory title="PAGO DE DEUDAS" color="#ef4444" items={[
                                    { label: 'Préstamo Coche', value: mockData.budget.prestamo }
                                ]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Componente auxiliar para la tabla de presupuesto ---
const BudgetCategory = ({ title, color, items }) => (
    <div>
        <h5 className="font-bold text-white mb-2 pb-1 border-b-2" style={{ borderColor: color }}>{title}</h5>
        <div className="space-y-2 text-slate-300">
            {items.map(item => (
                <div key={item.label} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors">
                    <span>{item.label}</span>
                    <span className="font-semibold text-white">{formatCurrency(item.value)}</span>
                </div>
            ))}
        </div>
    </div>
);


// --- [NUEVO] Componente: Sección de Seguridad ---
const SecuritySection = () => (
    <section id="security" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Tu Seguridad, Nuestra <span className="text-cyan-400">Obsesión</span></h2>
            <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto">Tu tranquilidad es la base sobre la que construimos FinanZen. Aplicamos la seguridad más rigurosa.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureCard icon={<ShieldCheck className="w-10 h-10" />} title="Cifrado Nivel Banco" delay={0.1}>
                    Utilizamos cifrado AES-256 bits, el mismo estándar de seguridad que utilizan las principales entidades financieras del mundo.
                </FeatureCard>
                <FeatureCard icon={<Lock className="w-10 h-10" />} title="Conexión Segura" delay={0.2}>
                     Nuestra conexión con tus bancos es de 'solo lectura'. Nadie, ni siquiera tú, puede mover dinero desde nuestra app.
                </FeatureCard>
                <FeatureCard icon={<EyeOff className="w-10 h-10" />} title="Privacidad por Diseño" delay={0.3}>
                    No vemos tus credenciales bancarias y, lo más importante: <span className="font-bold text-white">nunca venderemos tus datos</span> a terceros.
                </FeatureCard>
            </div>
        </div>
    </section>
);


// --- Componente: Tarjeta de Testimonio ---
const TestimonialCard = ({ quote, name, role, image, delay }) => (
    <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-slate-700/80 h-full flex flex-col justify-between group transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <p className="text-slate-300 italic mb-6 text-lg leading-relaxed">"{quote}"</p>
        <div className="flex items-center mt-auto">
            <img src={image} onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=64748b&color=e2e8f0`; }} alt={name} className="w-14 h-14 rounded-full mr-4 border-2 border-slate-600 group-hover:border-cyan-400 transition-colors duration-300" />
            <div>
                <p className="font-bold text-white text-lg">{name}</p>
                <p className="text-sm text-slate-400">{role}</p>
                <div className="flex mt-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" fill="currentColor" />)}
                </div>
            </div>
        </div>
    </div>
);

// --- Componente: Sección de Testimonios ---
const TestimonialsSection = () => (
    <section id="testimonials" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-white">Historias de <span className="text-cyan-400">Éxito Reales</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TestimonialCard 
                    name="Carlos Rodríguez" 
                    role="Ingeniero de Software" 
                    quote="El gráfico de patrimonio neto es un cambio de juego. Verlo crecer cada mes me motiva a seguir mi plan y reducir deudas. ¡Increíblemente poderoso!"
                    image="https://randomuser.me/api/portraits/men/32.jpg"
                    delay={0.1}
                />
                <TestimonialCard 
                    name="Ana Gómez" 
                    role="Diseñadora Freelance" 
                    quote="Gestionar mis ingresos variables era un caos. Con el presupuesto editable y el seguimiento mensual, ahora sé exactamente de cuánto 'remanente' dispongo."
                    image="https://randomuser.me/api/portraits/women/44.jpg"
                    delay={0.2}
                />
                <TestimonialCard 
                    name="Javier Torres" 
                    role="Pequeño Empresario" 
                    quote="Los informes visuales son perfectos para entender al instante la salud financiera de mi familia. Tomamos mejores decisiones gracias a la claridad que nos da."
                    image="https://randomuser.me/api/portraits/men/46.jpg"
                    delay={0.3}
                />
            </div>
        </div>
    </section>
);


// --- [NUEVO] Componente: Sección de Precios ---
const PricingSection = () => (
    <section id="pricing" className="py-24 bg-gradient-to-t from-slate-900 to-slate-800/80">
        <div className="container mx-auto px-6">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Un Plan Simple. Valor Ilimitado.</h2>
                <p className="text-xl text-slate-400 mb-10">Todo lo que necesitas para tomar el control, sin comisiones ocultas ni sorpresas.</p>
            </div>
            <div className="mt-10 max-w-lg mx-auto bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 transform hover:scale-105 transition-transform duration-500">
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white text-center">Plan FinanZen Pro</h3>
                    <p className="mt-4 text-center text-5xl font-black text-white">
                        7,99€
                        <span className="text-xl font-medium text-slate-400">/mes</span>
                    </p>
                    <p className="text-center text-slate-400 mt-1">(facturado anualmente)</p>
                    
                    <ul className="mt-8 space-y-4 text-lg">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-300">Presupuestos y categorías ilimitadas</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-300">Seguimiento de patrimonio neto</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-300">Informes mensuales y anuales</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-300">Sin publicidad y 100% privado</span>
                        </li>
                    </ul>
                    
                    <Link to="/register" className="mt-10 block w-full text-center group bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/40 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                        <span className="flex items-center justify-center gap-3">
                            Empieza tu prueba gratuita de 14 días
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </section>
);


// --- Componente: Pie de página (Footer) ---
const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400">
        <div className="container mx-auto px-6 text-center">
             <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2 justify-center mb-6">
                 <Rocket className="text-cyan-400" size={28} />
                 Finan<span className="text-cyan-400">Zen</span>
             </Link>
             <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-6">
                 <a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Funcionalidades</a>
                 <a href="#dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Dashboard</a>
                 <a href="#security" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Seguridad</a>
                 <a href="#pricing" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Precios</a>
                 <a href="#testimonials" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Testimonios</a>
             </div>
             <p>&copy; {new Date().getFullYear()} FinanZen. Todos los derechos reservados.</p>
             <p className="mt-2 text-sm">Hecho con ❤️ para tu tranquilidad financiera.</p>
        </div>
    </footer>
);


// --- Componente Principal de la Página ---
function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-['Inter',_sans-serif] selection:bg-cyan-500/30" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '2rem 2rem'
        }}>
            <Header />
            <main>
                <HeroSection />
                <SocialProofSection />
                <FeaturesSection />
                <DashboardPreviewSection />
                <SecuritySection />
                <TestimonialsSection />
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;