import React, { useState, useEffect } from 'react';

const STEPS = [
    {
        target: '.sidebar',
        view: 'dashboard',
        title: 'Menú Lateral de Secciones 🧭',
        content: 'Toda la navegación está estructurada por módulos. Desde aquí puedes acceder al registro de meses, balances anuales, ajustes y calculadoras patrimoniales de intereses compuestos.'
    },
    {
        target: '.topbar select',
        view: 'dashboard',
        title: 'El Tiempo es la Clave ⏳',
        content: 'Este selector viaja en el tiempo. Selecciona el año en el que quieres operar. De serie se proyectan datos 10 años al pasado o futuro si es que has operado allí. Usa el tiempo sabiamente para simular presupuestos.'
    },
    {
        target: '.settings-toggle',
        view: 'dashboard',
        title: 'Estimación y Control 📊',
        content: 'Alterna entre la visión en Gráficos o el Modo Presupuesto. Haz clic en "Modo Presupuesto" o en el botón para continuar y ver cómo cambia.',
        requireAction: 'dashboardMode'
    },
    {
        target: '.monthly-view-container, .page-content',
        fallback: '.page-content',
        view: 'monthly',
        title: 'Día a Día (El flujo Mensual) 📅',
        content: 'Tu "hoja clínica". Introduce aquí cada ticket de compra, nómina o ingreso durante el mes. En la derecha te contrastará inmediatamente tú progreso real contra el presupuesto anual asigado.'
    },
    {
        target: '.networth-view-container, .page-content',
        fallback: '.page-content',
        view: 'networth',
        title: 'Activos, Pasivos y Ahorros 🏦',
        content: 'Esto no es un gasto cotidiano, ¡es el inventario de lo que posees y debes! Guarda aquí el saldo del banco, o el valor de la vivienda y mantén tracking de cómo te vuelves más rico a través del tiempo.'
    },
    {
        target: '#tour-category-manager',
        fallback: '.page-content',
        view: 'settings',
        title: 'Categorías Inteligentes ⚙️',
        content: 'En "Ajustes", al crear o borrar categorías aplican ÚNICAMENTE al año seleccionado en adelante. Protegiendo tu pasado sin alterarlo. Muy superior al sistema clásico.'
    },
    {
        target: null, // Full screen darken
        view: 'dashboard',
        title: '¡Añade Tus Propios Datos! 🚀',
        content: 'Para que la FinanziApp rinda, te sugiero que empieces creando tus límites en el Presupuesto y actualizando tus Ahorros en el Net Worth. ¡Tú diriges tu economía!'
    }
];

export default function TutorialWizard({ onClose, onComplete, activeView, setActiveView, dashboardMode }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [rect, setRect] = useState(null);
    const [initialMode, setInitialMode] = useState(dashboardMode);
    const [actionCompleted, setActionCompleted] = useState(false);

    const step = STEPS[currentStep];

    useEffect(() => {
        setActionCompleted(false);
        setInitialMode(dashboardMode);
        // Prevent unnescessary jumps initially
        if (activeView !== step.view) {
            setActiveView(step.view);
        }

        const timer = setTimeout(() => {
            let el = null;
            if (step.target) {
                // Find elements matching target, take the first visible one
                const matches = document.querySelectorAll(step.target);
                for (let m of matches) {
                    if (m.offsetParent !== null) { el = m; break; }
                }
                if (!el && step.fallback) {
                    el = document.querySelector(step.fallback);
                }
            }

            if (el) {
                const bounds = el.getBoundingClientRect();
                if (bounds.width > 0 && bounds.height > 0) {
                    // Adjust bounds slightly for padding visually inside UI
                    setRect({
                        top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height,
                        right: bounds.right, bottom: bounds.bottom
                    });
                } else {
                    setRect(null);
                }
            } else {
                setRect(null);
            }
        }, 400); // Wait for animations and React renders

        return () => clearTimeout(timer);
    }, [currentStep, step, activeView, setActiveView]);

    useEffect(() => {
        if (step.requireAction === 'dashboardMode' && dashboardMode !== initialMode) {
            setActionCompleted(true);
        }
    }, [dashboardMode, initialMode, step.requireAction]);

    const canProceed = !step.requireAction || actionCompleted;

    const handleNext = () => {
        if (currentStep === STEPS.length - 1) {
            onComplete();
            onClose();
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handleSkip = () => {
        onComplete();
        onClose();
    };

    let dialogStyle = {
        position: 'fixed',
        zIndex: 99999,
        background: 'var(--bg-primary)',
        borderRadius: 24,
        width: '90%', maxWidth: 420,
        padding: 30,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (rect) {
        if (rect.bottom + 350 < window.innerHeight) {
            dialogStyle.top = rect.bottom + 24;
            dialogStyle.left = '50%';
            dialogStyle.transform = 'translateX(-50%)';
        }
        else if (rect.top - 350 > 0) {
            dialogStyle.bottom = (window.innerHeight - rect.top) + 24;
            dialogStyle.left = '50%';
            dialogStyle.transform = 'translateX(-50%)';
        }
        else {
            // Floating fallback explicitly center-right or center if too small
            dialogStyle.top = '50%';
            dialogStyle.left = '50%';
            dialogStyle.transform = 'translate(-50%, -50%)';
        }
    } else {
        dialogStyle.top = '50%';
        dialogStyle.left = '50%';
        dialogStyle.transform = 'translate(-50%, -50%)';
    }

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99990, pointerEvents: 'none' }}>
                {rect && (
                    <>
                        {/* 4 blocker divs instead of box-shadow to be 100% sure interaction works in the hole */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: rect.top - 8, background: 'rgba(0, 11, 24, 0.75)', pointerEvents: 'auto' }} />
                        <div style={{ position: 'absolute', top: rect.bottom + 8, left: 0, right: 0, bottom: 0, background: 'rgba(0, 11, 24, 0.75)', pointerEvents: 'auto' }} />
                        <div style={{ position: 'absolute', top: rect.top - 8, left: 0, width: rect.left - 8, height: rect.height + 16, background: 'rgba(0, 11, 24, 0.75)', pointerEvents: 'auto' }} />
                        <div style={{ position: 'absolute', top: rect.top - 8, left: rect.right + 8, right: 0, height: rect.height + 16, background: 'rgba(0, 11, 24, 0.75)', pointerEvents: 'auto' }} />

                        {/* Glow/Border for the hole */}
                        <div style={{
                            position: 'absolute',
                            top: rect.top - 8,
                            left: rect.left - 8,
                            width: rect.width + 16,
                            height: rect.height + 16,
                            borderRadius: 16,
                            border: '2px solid var(--accent)',
                            boxShadow: '0 0 20px var(--accent-light)',
                            pointerEvents: 'none'
                        }} />
                    </>
                )}
                {!rect && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 11, 24, 0.75)', pointerEvents: 'auto' }} />
                )}
            </div>

            <div style={{ ...dialogStyle, pointerEvents: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        PASO {currentStep + 1} DE {STEPS.length}
                    </div>
                    <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Saltar
                    </button>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {step.title}
                </h2>

                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                    {step.content}
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 32 }}>
                    {currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(s => s - 1)}
                            className="btn btn-ghost"
                            style={{ padding: '10px 16px', fontSize: 14 }}
                        >
                            Atrás
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className={`btn ${canProceed ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '10px 20px', fontSize: 15, opacity: canProceed ? 1 : 0.5, cursor: canProceed ? 'pointer' : 'not-allowed' }}
                        disabled={!canProceed}
                    >
                        {currentStep === STEPS.length - 1 ? '¡Vamos Allá!' : (canProceed ? 'Siguiente' : 'Interactúa para seguir')}
                    </button>
                </div>
            </div>
        </>
    );
}
