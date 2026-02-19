// src/LandingPage.js
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- Importaciones de Recharts para maquetas de gráficos realistas ---
import {
    ResponsiveContainer, Legend, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    PieChart, Pie, Cell
} from 'recharts';

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

// --- UTILIDADES ---
const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
const getMonthNameSpanish = (monthIndex) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex];
const getFullMonthNameSpanish = (monthIndex) => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][monthIndex];

// --- FUNCIONES DE CÁLCULO DE AMORTIZACIÓN (replicadas de AmortizationTable para la maqueta) ---
const calculateAmortizationSchedule = (principal, annualInterestRate, termInMonths, startDate) => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths);
    const denominator = Math.pow(1 + monthlyInterestRate, termInMonths) - 1;
    let monthlyPayment = principal * (numerator / denominator);

    // Si el tipo de interés o el plazo son 0, evitar NaN o Infinity
    if (annualInterestRate === 0 || termInMonths === 0) {
        monthlyPayment = principal / termInMonths; // Pago solo de principal
    }

    let schedule = [];
    let remainingBalance = principal;
    let totalPrincipalPaid = 0; // Para el nuevo "Capital Amortizado"
    let currentDate = new Date(startDate); // Clona la fecha para no modificar el original

    for (let i = 0; i < termInMonths; i++) {
        let interestPayment = remainingBalance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;

        // Ajuste para el último pago para evitar micro-saldos negativos
        if (i === termInMonths - 1) {
            principalPayment = remainingBalance;
            monthlyPayment = principalPayment + interestPayment; // Ajusta el pago final
        }

        remainingBalance -= principalPayment;
        totalPrincipalPaid += principalPayment; // Acumular capital pagado

        // Asegurarse de que el saldo no sea negativo al final
        if (remainingBalance < 0.01 && remainingBalance > -0.01) { // Tolerancia para flotantes
            remainingBalance = 0;
        } else if (remainingBalance < 0) {
            // Esto no debería pasar con el ajuste del último pago, pero como salvaguarda
            principalPayment += remainingBalance;
            remainingBalance = 0;
        }

        schedule.push({
            month: i + 1,
            monthName: getFullMonthNameSpanish(currentDate.getMonth()),
            year: currentDate.getFullYear(),
            startingBalance: principal - (principal - remainingBalance + principalPayment), // Recalcular para precisión
            monthlyPayment: monthlyPayment,
            interestPayment: interestPayment,
            principalPayment: principalPayment,
            totalPrincipalPaid: totalPrincipalPaid, // Nuevo campo
            remainingBalance: remainingBalance
        });

        currentDate.setMonth(currentDate.getMonth() + 1); // Avanzar al siguiente mes
    }
    return schedule;
};


// --- COMPONENTES AUXILIARES PARA LA MAQUETA DEL DASHBOARD ---

const DashboardMockLineChart = ({ selectedYearOffset }) => {
    // Datos base para el año actual (Patrimonio Neto NEGATIVO, Pasivos ALTO, Activos más bajos)
    const baseData = [
        // Empieza con patrimonio negativo, y los pasivos bajan considerablemente cada mes
        { name: 'Ene', 'Patrimonio Neto': -10000, Activos: 15000, Pasivos: 25000 },
        { name: 'Feb', 'Patrimonio Neto': -9000, Activos: 15500, Pasivos: 24500 }, // Pasivos -500
        { name: 'Mar', 'Patrimonio Neto': -7500, Activos: 16000, Pasivos: 23500 }, // Pasivos -1000
        { name: 'Abr', 'Patrimonio Neto': -5500, Activos: 16800, Pasivos: 22300 }, // Pasivos -1200
        { name: 'May', 'Patrimonio Neto': -3000, Activos: 17500, Pasivos: 20500 }, // Pasivos -1800
        { name: 'Jun', 'Patrimonio Neto': -500, Activos: 18200, Pasivos: 18700 },  // Pasivos -1800
        { name: 'Jul', 'Patrimonio Neto': 1500, Activos: 19000, Pasivos: 17500 },  // Pasivos -1200
        { name: 'Ago', 'Patrimonio Neto': 3500, Activos: 19800, Pasivos: 16300 },  // Pasivos -1200
        { name: 'Sep', 'Patrimonio Neto': 6000, Activos: 20700, Pasivos: 14700 },  // Pasivos -1600
        { name: 'Oct', 'Patrimonio Neto': 8500, Activos: 21600, Pasivos: 13100 },  // Pasivos -1600
        { name: 'Nov', 'Patrimonio Neto': 11000, Activos: 22500, Pasivos: 11500 }, // Pasivos -1600
        { name: 'Dic', 'Patrimonio Neto': 14000, Activos: 23500, Pasivos: 9500 },   // Pasivos -2000
    ];

    // Ajustar datos según el offset del año (los pasivos siguen bajando, los activos suben)
    const adjustedData = baseData.map(d => ({
        ...d,
        // El patrimonio neto sube más rápidamente en años futuros
        'Patrimonio Neto': d['Patrimonio Neto'] + (selectedYearOffset * 5000),
        Activos: d.Activos + (selectedYearOffset * 3000),
        // Pasivos bajan más en años futuros
        Pasivos: Math.max(0, d.Pasivos - (selectedYearOffset * 2000)),
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={adjustedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#cbd5e0" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} stroke="#cbd5e0" tick={{ fontSize: 10 }} />
                <Tooltip
                    formatter={(value) => `${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}`}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', fontSize: '12px' }}
                    itemStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Patrimonio Neto" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Activos" stroke="#82ca9d" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="Pasivos" stroke="#ef4444" strokeWidth={1} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

const DashboardMockPieChart = () => (
    <ResponsiveContainer width="100%" height={200}>
        <PieChart>
            <Pie
                data={[
                    { name: 'Gastos Esenciales', value: 400, color: '#ca8a04' },
                    { name: 'Gastos Discrecionales', value: 250, color: '#f97316' },
                    { name: 'Pago de Deudas', value: 150, color: '#b91c1c' },
                    { name: 'Ahorro', value: 200, color: '#059669' },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
            >
                {/* Usar Cell para aplicar colores específicos */}
                {[{ name: 'Gastos Esenciales', value: 400, color: '#ca8a04' },
                { name: 'Gastos Discrecionales', value: 250, color: '#f97316' },
                { name: 'Pago de Deudas', value: 150, color: '#b91c1c' },
                { name: 'Ahorro', value: 200, color: '#059669' }].map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip
                formatter={(value) => `${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}`}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', fontSize: '12px' }}
                itemStyle={{ color: '#ffffff' }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
        </PieChart>
    </ResponsiveContainer>
);

const DashboardMockTable = () => (
    <div className="overflow-x-auto text-xs">
        <table className="w-full text-left text-gray-300">
            <thead>
                <tr className="bg-slate-700">
                    <th className="py-2 px-3">Categoría</th>
                    <th className="py-2 px-3 text-right">Presupuestado</th>
                    <th className="py-2 px-3 text-right">Real</th>
                    <th className="py-2 px-3 text-right">Diferencia</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">Alquiler</td>
                    <td className="py-2 px-3 text-right">€800,00</td>
                    <td className="py-2 px-3 text-right">€800,00</td>
                    <td className="py-2 px-3 text-right text-green-400">€0,00</td>
                </tr>
                <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">Comida</td>
                    <td className="py-2 px-3 text-right">€400,00</td>
                    <td className="py-2 px-3 text-right">€450,00</td>
                    <td className="py-2 px-3 text-right text-red-400">€-50,00</td>
                </tr>
                <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">Transporte</td>
                    <td className="py-2 px-3 text-right">€100,00</td>
                    <td className="py-2 px-3 text-right">€80,00</td>
                    <td className="py-2 px-3 text-right text-green-400">€20,00</td>
                </tr>
                <tr>
                    <td className="py-2 px-3 font-bold">Total Gastos</td>
                    <td className="py-2 px-3 text-right font-bold">€1.300,00</td>
                    <td className="py-2 px-3 text-right font-bold text-orange-400">€1.330,00</td>
                    <td className="py-2 px-3 text-right font-bold text-red-400">€-30,00</td>
                </tr>
            </tbody>
        </table>
    </div>
);

// --- Componente para la maqueta de la tabla de amortización ---
const LoanAmortizationMockTable = () => {
    const principal = 150000; // €
    const annualInterestRate = 3.5; // %
    const termInYears = 30;
    const termInMonths = termInYears * 12;

    // La fecha de inicio del préstamo de ejemplo (hace 5 años desde hoy)
    const today = new Date();
    const loanStartDate = useMemo(() => new Date(today.getFullYear() - 5, 0, 1), []);

    const schedule = useMemo(() => {
        return calculateAmortizationSchedule(principal, annualInterestRate, termInMonths, loanStartDate);
    }, [principal, annualInterestRate, termInMonths, loanStartDate]);

    // Calcular los meses a mostrar: mes actual, 2 anteriores, 2 siguientes
    const currentMonthIndex = today.getMonth(); // 0-11
    const currentYear = today.getFullYear(); // current year

    const monthsToShow = useMemo(() => {
        let months = [];
        // Calculate the starting month index in the full schedule to center around current month
        const currentMonthAbsoluteIndex = (currentYear - loanStartDate.getFullYear()) * 12 + currentMonthIndex;

        // Iterate to get 5 months: 2 before current, current, 2 after current
        for (let i = -2; i <= 2; i++) {
            const absoluteIndex = currentMonthAbsoluteIndex + i;

            // Ensure we don't go out of bounds of the schedule
            if (absoluteIndex >= 0 && absoluteIndex < schedule.length) {
                const entry = schedule[absoluteIndex];

                months.push({
                    monthName: entry.monthName,
                    year: entry.year,
                    // Compara con el mes y año actual exacto para el resaltado
                    isCurrentMonth: (entry.monthName === getFullMonthNameSpanish(currentMonthIndex) && entry.year === currentYear),
                    data: entry
                });
            } else {
                // If out of bounds, add a placeholder or skip
                // For a fixed 5-month window around current date, a null/empty placeholder is good
                months.push({
                    monthName: getFullMonthNameSpanish(new Date(currentYear, currentMonthIndex + i).getMonth()),
                    year: new Date(currentYear, currentMonthIndex + i).getFullYear(),
                    isCurrentMonth: false,
                    data: null // No data if month is outside loan schedule or before loan start
                });
            }
        }
        return months;
    }, [currentMonthIndex, currentYear, schedule, loanStartDate]);


    // Calcular el pago mensual solo una vez
    const monthlyPaymentExample = useMemo(() => {
        const tempSchedule = calculateAmortizationSchedule(principal, annualInterestRate, termInMonths, loanStartDate);
        return tempSchedule.length > 0 ? tempSchedule[0].monthlyPayment : 0;
    }, [principal, annualInterestRate, termInMonths, loanStartDate]);


    return (
        <div className="overflow-x-auto text-xs">
            <h5 className="font-bold text-white mb-2 text-left">
                Pago Mensual Fijo: {formatCurrency(monthlyPaymentExample)}
            </h5>
            <table className="w-full text-left text-gray-300">
                <thead>
                    <tr className="bg-slate-700">
                        <th className="py-2 px-3" style={{ minWidth: '80px' }}>Mes</th>
                        <th className="py-2 px-3 text-right" style={{ minWidth: '70px' }}>Intereses</th>
                        <th className="py-2 px-3 text-right" style={{ minWidth: '70px' }}>Principal</th>
                        <th className="py-2 px-3 text-right" style={{ minWidth: '70px' }}>Capital Amort.</th> {/* Nueva columna */}
                        <th className="py-2 px-3 text-right" style={{ minWidth: '70px' }}>Capital Pdte.</th> {/* Renombrado */}
                    </tr>
                </thead>
                <tbody>
                    {monthsToShow.map((month, idx) => (
                        <tr
                            key={`${month.monthName}-${month.year}-${idx}`}
                            className={`border-b border-slate-700 ${month.isCurrentMonth ? 'bg-teal-700/50 font-bold text-white' : 'bg-slate-800/50'}`}
                        >
                            <td className="py-2 px-3">{month.monthName} {month.year}</td>
                            <td className="py-2 px-3 text-right">{month.data ? formatCurrency(month.data.interestPayment) : '-'}</td>
                            <td className="py-2 px-3 text-right">{month.data ? formatCurrency(month.data.principalPayment) : '-'}</td>
                            <td className="py-2 px-3 text-right">{month.data ? formatCurrency(month.data.totalPrincipalPaid) : '-'}</td> {/* Valor de Capital Amortizado */}
                            <td className="py-2 px-3 text-right">{month.data ? formatCurrency(month.data.remainingBalance) : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Componente: Cabecera (Header) ---
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-3xl font-extrabold text-white">
                Finanzi<span className="text-teal-400">App</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Funcionalidades</a>
                <a href="#dashboard" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Dashboard</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Cómo Funciona</a>
            </nav>
            <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">Iniciar Sesión</Link>
            </div>
        </div>
    </header>
);

// --- Componente: Sección Hero ---
const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center p-4 text-center bg-slate-900 overflow-hidden">
        {/* Fondo animado sutil con gradientes y blurs */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center pt-24">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white animate-fade-in-up drop-shadow-2xl">
                Construye tu <span className="text-teal-400">Futuro Financiero</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                La herramienta definitiva para gestionar tu presupuesto personal, analizar tu patrimonio neto y alcanzar la libertad financiera con datos claros y potentes visualizaciones.
            </p>
            <Link
                to="/login"
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in"
            >
                Regístrate Gratis
            </Link>
        </div>
    </section>
);

// --- Componente: Tarjeta de Funcionalidad ---
const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 p-8 rounded-2xl shadow-2xl hover:shadow-teal-500/20 transform hover:-translate-y-2 transition-all duration-400 border border-slate-700 hover:border-teal-400/50">
        <div className="mb-5 text-teal-400">{icon}</div>
        <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
);

// --- Componente: Sección de Funcionalidades Clave ---
const FeaturesSection = () => (
    <section id="features" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Herramientas <span className="text-teal-400">Potentes y Claras</span></h2>
            <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">Funcionalidades diseñadas para que cada decisión financiera sea más inteligente y sencilla.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <FeatureCard icon={<CalculatorIcon className="w-12 h-12" />} title="Presupuestos Flexibles">
                    Define presupuestos anuales con categorías y subcategorías personalizables. Calcula tu "remanente" mensual y ajusta tus gastos sobre la marcha para un control total.
                </FeatureCard>
                <FeatureCard icon={<LineChartIcon className="w-12 h-12" />} title="Análisis de Patrimonio Neto">
                    Registra tus activos y pasivos mes a mes. Observa la evolución de tu patrimonio neto con gráficos de línea interactivos, identificando tendencias y tu verdadera riqueza.
                </FeatureCard>
                <FeatureCard icon={<PieChartIcon className="w-12 h-12" />} title="Seguimiento Mensual Detallado">
                    Registra tus ingresos y gastos reales y compáralos instantáneamente con tu presupuesto. Visualiza la distribución de tus egresos con gráficos de tarta y barras.
                </FeatureCard>
                <FeatureCard icon={<TargetIcon className="w-12 h-12" />} title="Gestión de Préstamos y Amortización">
                    Visualiza el calendario de amortización de tus préstamos. Realiza amortizaciones parciales y observa cómo impactan en tu balance y la duración de tus deudas.
                </FeatureCard>
            </div>
        </div>
    </section>
);

// --- Componente: Vista Previa del Dashboard (Más Realista) ---
const DashboardPreviewSection = () => {
    const [selectedYearOffset, setSelectedYearOffset] = useState(0); // 0 = current year, 1 = current year + 1, etc.
    const currentYear = new Date().getFullYear(); // dynamic current year

    // Generate years dynamically: current year, current year + 1, current year + 2
    const yearsToDisplay = Array.from({ length: 3 }, (_, i) => currentYear + i);

    const [activeTab, setActiveTab] = useState('charts'); // 'charts' o 'loan'

    return (
        <section id="dashboard" className="py-20 bg-slate-800/50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Tu <span className="text-teal-400">Centro de Mando Financiero</span></h2>
                <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">Una interfaz intuitiva, potente y con toda la información que importa de un solo vistazo. Así se ve el control.</p>

                {/* Maqueta del dashboard con elementos reales de la app */}
                <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-900/70 rounded-3xl border border-slate-700 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button
                                onClick={() => setActiveTab('charts')}
                                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${activeTab === 'charts' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                Gráficos
                            </button>
                            <button
                                onClick={() => setActiveTab('loan')}
                                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${activeTab === 'loan' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                Préstamo Ejemplo
                            </button>
                        </div>
                        {activeTab === 'charts' && (
                            <select
                                value={selectedYearOffset}
                                onChange={(e) => setSelectedYearOffset(parseInt(e.target.value))}
                                className="bg-slate-700 text-white p-2 rounded-md text-sm border border-slate-600 focus:ring-teal-500 focus:border-teal-500"
                            >
                                {yearsToDisplay.map((year, index) => (
                                    <option key={year} value={index}>{year}</option>
                                ))}
                            </select>
                        )}
                        {activeTab === 'loan' && (
                            <div className="text-sm font-semibold text-gray-300">
                                Préstamo: 150k€ | 30 años | 3.5% Int.
                            </div>
                        )}
                    </div>

                    {activeTab === 'charts' && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {/* Gráfico de Patrimonio Neto - Ahora ocupa 2/5 de ancho */}
                            <div className="lg:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-bold text-white mb-4 text-left text-sm">Evolución Anual del Patrimonio Neto</h4>
                                <DashboardMockLineChart selectedYearOffset={selectedYearOffset} />
                            </div>

                            {/* Columna con Tarta y una tabla de ejemplo más pequeña - ocupa 3/5 de ancho */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white mb-4 text-left text-sm">Distribución de Egresos ({getMonthNameSpanish(new Date().getMonth())})</h4>
                                    <DashboardMockPieChart />
                                </div>
                                {/* Nueva tabla de "Resumen de Mes" para llenar más espacio y dar más detalle */}
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col">
                                    <h4 className="font-bold text-white mb-4 text-left text-sm">Resumen del Mes (Actual)</h4>
                                    <div className="text-xs text-gray-300">
                                        <div className="flex justify-between py-1 border-b border-slate-700">
                                            <span>Ingresos Reales:</span> <span className="font-bold text-green-400">€2.500,00</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-700">
                                            <span>Gastos Reales:</span> <span className="font-bold text-red-400">€1.330,00</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span>Remanente:</span> <span className="font-bold text-teal-400">€1.170,00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* La tabla principal ahora ocupa 5/5 para un despliegue completo debajo */}
                            <div className="lg:col-span-5 bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-bold text-white mb-4 text-left text-sm">Comparativa Presupuesto vs. Real ({getMonthNameSpanish(new Date().getMonth())})</h4>
                                <DashboardMockTable />
                            </div>
                        </div>
                    )}

                    {activeTab === 'loan' && (
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 lg:col-span-full"> {/* full width for loan tab */}
                            <h4 className="font-bold text-white mb-4 text-left text-sm">Calendario de Amortización</h4>
                            <LoanAmortizationMockTable />
                            <p className="text-gray-400 text-xs mt-4 text-center">
                                *Esta es una simulación de ejemplo. La aplicación permite añadir tus propios préstamos, visualizar su calendario de amortización detallado y registrar pagos anticipados.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- NUEVA SECCIÓN: Cómo Funciona ---
const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Empieza a Gestionar tus Finanzas en <span className="text-teal-400">3 Simples Pasos</span></h2>
            <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">Toma el control de tu dinero de forma rápida, intuitiva y eficaz, tal como lo haces en tu vida diaria.</p>
            <div className="relative">
                {/* Línea de conexión con efecto de gradiente */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-y-1/2"></div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 border-2 border-teal-500 flex items-center justify-center text-teal-400 shadow-lg transform transition-transform duration-300 hover:scale-110">
                            <CalculatorIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-white">1. Define tu Presupuesto</h3>
                        <p className="text-gray-400 leading-relaxed max-w-sm">Personaliza tus categorías y subcategorías. Asigna montos a tus ingresos y gastos esperados para el año.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 border-2 border-teal-500 flex items-center justify-center text-teal-400 shadow-lg transform transition-transform duration-300 hover:scale-110">
                            <EditIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-white">2. Registra con Facilidad</h3>
                        <p className="text-gray-400 leading-relaxed max-w-sm">Usa el formulario de registro rápido mensual para añadir tus gastos e ingresos diarios en cuestión de segundos.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 border-2 border-teal-500 flex items-center justify-center text-teal-400 shadow-lg transform transition-transform duration-300 hover:scale-110">
                            <LineChartIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-white">3. Analiza y Crece</h3>
                        <p className="text-gray-400 leading-relaxed max-w-sm">Visualiza tu remanente, compara lo real con lo presupuestado y mira tu patrimonio neto crecer a lo largo del tiempo.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Componente: Pie de página (Footer) ---
const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 text-gray-400">
        <div className="container mx-auto px-6 text-center">
            <p className="text-3xl font-extrabold text-white mb-3">
                Finanzi<span className="text-teal-400">App</span>
            </p>
            <p className="text-sm">&copy; {new Date().getFullYear()} FinanziApp. Controla tu futuro financiero.</p>
        </div>
    </footer>
);

// --- Componente Principal de la Página ---
function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans antialiased selection:bg-teal-500/30">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <DashboardPreviewSection />
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
