// src/components/amortization/LoanForm.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useFinanceData from '../../hooks/useFinanceData';
import AmortizationTable from './AmortizationTable'; // Importar AmortizationTable

function LoanForm({ onClose, loanToEdit, usedSubcategories = [] }) {
    const { currentUser } = useAuth();
    const { addLoan, updateLoan, isSubmitting } = useFinanceData();

    const isEditMode = !!loanToEdit;

    const [loanName, setLoanName] = useState('');
    const [principal, setPrincipal] = useState('');
    const [annualInterestRate, setAnnualInterestRate] = useState('');
    const [term, setTerm] = useState('');
    const [termUnit, setTermUnit] = useState('years');
    const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [error, setError] = useState('');
    const [simulatedLoan, setSimulatedLoan] = useState(null); // Nuevo estado para la simulación

    useEffect(() => {
        if (isEditMode && loanToEdit) {
            setLoanName(loanToEdit.loanName || '');
            setPrincipal(loanToEdit.initialPrincipal || '');
            setAnnualInterestRate(loanToEdit.annualInterestRate || '');
            
            if (loanToEdit.termInMonths) {
                if (loanToEdit.termInMonths % 12 === 0) {
                    setTerm(loanToEdit.termInMonths / 12);
                    setTermUnit('years');
                } else {
                    setTerm(loanToEdit.termInMonths);
                    setTermUnit('months');
                }
            }

            if (loanToEdit.startDate) {
                const [year, month] = loanToEdit.startDate.split('-').map(Number);
                setStartYear(parseInt(year, 10));
                setStartMonth(parseInt(month, 10));
            }
        }
    }, [loanToEdit, isEditMode]);

    const calculateAmortizationSchedule = (principal, annualInterestRate, termInMonths, startDate) => {
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        const totalPayments = termInMonths;
    
        let monthlyPayment;
        if (monthlyInterestRate === 0) {
            monthlyPayment = principal / totalPayments;
        } else {
            monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
        }
    
        let balance = principal;
        let accumulatedPrincipalPaid = 0; // Inicializar acumulador de capital pagado
        const schedule = [];
        let currentDate = new Date(startDate);
    
        for (let i = 0; i < totalPayments; i++) {
            const interestPayment = balance * monthlyInterestRate;
            let principalPayment = monthlyPayment - interestPayment;
            
            // Asegurar que el último pago no sea negativo y ajuste de balance
            if (balance - principalPayment < 0) {
                principalPayment = balance;
                balance = 0;
            } else {
                balance -= principalPayment;
            }

            accumulatedPrincipalPaid += principalPayment; // Acumular el capital pagado
    
            schedule.push({
                monthName: currentDate.toLocaleString('es-ES', { month: 'long' }),
                year: currentDate.getFullYear(),
                startingBalance: parseFloat((balance + principalPayment).toFixed(2)),
                monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
                interestPaid: parseFloat(interestPayment.toFixed(2)),
                principalPaid: parseFloat(principalPayment.toFixed(2)),
                accumulatedPrincipalPaid: parseFloat(accumulatedPrincipalPaid.toFixed(2)), // Añadir aquí
                remainingBalance: parseFloat(balance.toFixed(2)),
            });
    
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return schedule;
    };
    

    const handleSimulate = (e) => {
        e.preventDefault();
        setError('');

        if (!principal || !annualInterestRate || !term) {
            setError('Capital Inicial, Interés Anual y Plazo son obligatorios para simular.');
            setSimulatedLoan(null);
            return;
        }

        const termInMonths = termUnit === 'years' ? parseInt(term, 10) * 12 : parseInt(term, 10);
        const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-01`;

        const schedule = calculateAmortizationSchedule(
            parseFloat(principal),
            parseFloat(annualInterestRate),
            termInMonths,
            startDate
        );

        setSimulatedLoan({
            loanName: loanName || 'Simulación de Préstamo',
            initialPrincipal: parseFloat(principal),
            annualInterestRate: parseFloat(annualInterestRate),
            termInMonths,
            startDate,
            schedule,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!principal || !annualInterestRate || !term || !loanName) {
            setError('Todos los campos son obligatorios para guardar.');
            return;
        }
        setError('');

        const termInMonths = termUnit === 'years' ? parseInt(term, 10) * 12 : parseInt(term, 10);
        const loanData = {
            loanName,
            principal: parseFloat(principal),
            initialPrincipal: parseFloat(principal),
            annualInterestRate: parseFloat(annualInterestRate),
            termInMonths,
            startDate: `${startYear}-${String(startMonth).padStart(2, '0')}`,
            linkedSubcategory: loanName,
        };

        const success = isEditMode 
            ? await updateLoan(loanToEdit.id, loanData)
            : await addLoan(loanData);

        if (success) {
            if (onClose) onClose();
        } else {
            setError('Hubo un error al guardar los cambios.');
        }
    };

    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('es-ES', { month: 'long' }) }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
            <div>
                <label htmlFor="loanName" className="block text-sm font-medium mb-1">Nombre del Préstamo</label>
                <input type="text" id="loanName" value={loanName} onChange={(e) => setLoanName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="Ej: Hipoteca, Préstamo Coche" required={!simulatedLoan} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="principal" className="block text-sm font-medium mb-1">Capital Inicial (€)</label>
                    <input type="number" id="principal" value={principal} onChange={(e) => { setPrincipal(e.target.value); setSimulatedLoan(null); }} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="150000" required />
                </div>
                <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium mb-1">Interés Anual (%)</label>
                    <input type="number" step="0.01" id="interestRate" value={annualInterestRate} onChange={(e) => { setAnnualInterestRate(e.target.value); setSimulatedLoan(null); }} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="3.5" required />
                </div>
            </div>
            <div>
                <label htmlFor="term" className="block text-sm font-medium mb-1">Plazo</label>
                <div className="flex">
                    <input type="number" id="term" value={term} onChange={(e) => { setTerm(e.target.value); setSimulatedLoan(null); }} className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="30" required />
                    <select value={termUnit} onChange={(e) => { setTermUnit(e.target.value); setSimulatedLoan(null); }} className="bg-gray-600 border border-gray-600 rounded-r-md p-2">
                        <option value="years">Años</option>
                        <option value="months">Meses</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Fecha del Primer Cobro</label>
                <div className="flex">
                    <select value={startMonth} onChange={(e) => { setStartMonth(e.target.value); setSimulatedLoan(null); }} className="bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:ring-2 focus:ring-blue-500 w-full">
                        {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                    </select>
                    <input type="number" value={startYear} onChange={(e) => { setStartYear(e.target.value); setSimulatedLoan(null); }} placeholder="Año" className="bg-gray-700 border border-gray-600 rounded-r-md p-2 focus:ring-2 focus:ring-blue-500 w-full" required />
                </div>
            </div>
            
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                {!isEditMode && (
                    <button 
                        type="button" 
                        onClick={handleSimulate} 
                        disabled={isSubmitting} 
                        className={`w-full sm:w-1/2 px-4 py-2 font-bold text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        Simular Préstamo
                    </button>
                )}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full ${!isEditMode ? 'sm:w-1/2' : ''} px-4 py-2 font-bold text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Préstamo' : 'Guardar Préstamo')}
                </button>
            </div>

            {simulatedLoan && (
                <div className="mt-6 p-4 bg-gray-700 rounded-md max-w-full sm:max-w-6xl mx-auto -ml-4 sm:ml-0 overflow-x-auto">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">Tabla de Amortización Simulada</h3>
                    <AmortizationTable loanData={simulatedLoan} />
                    <div className="flex justify-center mt-4">
                        <button onClick={() => setSimulatedLoan(null)} className="text-sm text-gray-400 hover:text-gray-200">
                            Cerrar Simulación
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}

export default LoanForm;