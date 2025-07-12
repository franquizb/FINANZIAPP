import React, { useState, useEffect } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import LoanForm from '../components/amortization/LoanForm';
import AmortizationTable from '../components/amortization/AmortizationTable';
import PrepaymentModal from '../components/amortization/PrepaymentModal';
import { Transition } from '@headlessui/react';

// --- COMPONENTES INTERNOS DEFINIDOS ---

// Componente de carga con spinner de círculo girando (unificado)
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full"> {/* Added h-full for centering vertically */}
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando préstamos...</p>
        </div>
    );
};

const LoanSummaryCard = ({ loan, onToggle, isExpanded, onDelete, onEdit, isJustUpdated }) => {
    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
    const hasRequiredData = loan.initialPrincipal && loan.termInMonths && loan.startDate;

    if (!hasRequiredData) {
        return (
            <div className="bg-yellow-900/50 backdrop-blur-sm rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{loan.loanName || 'Préstamo sin nombre'}</h3>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded-full hover:bg-red-800/50 transition-colors" title="Eliminar Préstamo">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
                <p className="text-sm text-yellow-200 mt-2">Datos incompletos. Se recomienda eliminarlo.</p>
            </div>
        );
    }
    
    const initialPrincipal = Number(loan.initialPrincipal);
    const now = new Date();
    const todayMarker = new Date(now.getFullYear(), now.getMonth());

    const lastPaidEntry = loan.schedule?.slice().reverse().find(entry => {
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const monthIndex = monthNames.indexOf(entry.monthName.toLowerCase());
        return new Date(entry.year, monthIndex) <= todayMarker;
    });

    const currentBalance = lastPaidEntry ? lastPaidEntry.remainingBalance : initialPrincipal;
    const progress = initialPrincipal > 0 ? ((initialPrincipal - currentBalance) / initialPrincipal) * 100 : 0;

    const cardClasses = `bg-gray-800/80 rounded-lg shadow-md transition-all duration-500 hover:bg-gray-800 ${isJustUpdated ? 'border-2 border-green-500' : 'border-2 border-transparent'}`;

    return (
        <div className={cardClasses}>
            <div className="p-4 cursor-pointer" onClick={onToggle}>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{loan.loanName}</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1 rounded-full hover:bg-gray-600 transition-colors" title="Editar Préstamo">
                           <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.232 3.232z"></path></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded-full hover:bg-gray-600 transition-colors" title="Eliminar Préstamo">
                           <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Progreso ({progress > 100 ? 100 : progress.toFixed(1)}%)</span>
                        <span className="font-semibold">{formatCurrency(currentBalance)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress > 100 ? 100 : progress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


function AmortizationPage() {
    const { loans, addPrepayment, removePrepayment, loadingData, isSubmitting, deleteLoan } = useFinanceData();
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [loanToEdit, setLoanToEdit] = useState(null);
    const [prepaymentModalInfo, setPrepaymentModalInfo] = useState({ isOpen: false, loan: null });
    const [expandedLoanId, setExpandedLoanId] = useState(null);
    const [justUpdatedLoanId, setJustUpdatedLoanId] = useState(null);

    useEffect(() => {
        if (prepaymentModalInfo.isOpen && prepaymentModalInfo.loan) {
            const updatedLoanInList = loans.find(l => l.id === prepaymentModalInfo.loan.id);
            if (updatedLoanInList) {
                setPrepaymentModalInfo(prev => ({ ...prev, loan: updatedLoanInList }));
            }
        }
    }, [loans, prepaymentModalInfo.isOpen]);

    const handleOpenCreateModal = () => {
        setLoanToEdit(null);
        setIsLoanModalOpen(true);
    };

    const handleOpenEditModal = (loan) => {
        setLoanToEdit(loan);
        setIsLoanModalOpen(true);
    };
    
    const handleCloseLoanModal = () => {
        setIsLoanModalOpen(false);
        setLoanToEdit(null);
    };
    
    const handleDeleteLoan = async (loanId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este préstamo? Esta acción no se puede deshacer.")) {
            await deleteLoan(loanId);
        }
    };

    const handleToggleLoan = (loanId) => {
        if (loanId) { setExpandedLoanId(prevId => (prevId === loanId ? null : loanId)); }
    };
    
    const handlePrepaymentSubmit = async (data) => {
        if (!prepaymentModalInfo.loan) return;
        await addPrepayment(prepaymentModalInfo.loan.id, data.date, data.amount);
        setJustUpdatedLoanId(prepaymentModalInfo.loan.id);
        setTimeout(() => setJustUpdatedLoanId(null), 1500);
    };

    const handlePrepaymentDelete = async (dateKey) => {
        if (!prepaymentModalInfo.loan) return;
        await removePrepayment(prepaymentModalInfo.loan.id, dateKey);
        setJustUpdatedLoanId(prepaymentModalInfo.loan.id);
        setTimeout(() => setJustUpdatedLoanId(null), 1500);
    };

    // Usar el nuevo LoadingSpinner aquí
    if (loadingData) { return <LoadingSpinner />; }

    return (
        <div className="relative min-h-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Mis Préstamos</h1>
                {/* Siempre mostrar el botón para añadir préstamo si ya hay préstamos */}
                {loans && loans.length > 0 && (
                     <button onClick={handleOpenCreateModal} title="Añadir Préstamo" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path></svg>
                     </button>
                )}
            </div>

            {(!loans || loans.length === 0) && (
                <div className="bg-gray-800/50 rounded-lg p-6 sm:p-8 mt-8">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Añadir Préstamo</h2>
                    <p className="text-gray-400 mb-6 text-center">Añade tu primer préstamo para empezar a gestionarlo.</p>
                    <div className="w-full max-w-lg mx-auto">
                        <LoanForm 
                            onClose={handleCloseLoanModal}
                            usedSubcategories={loans.map(l => l.linkedSubcategory)}
                        />
                    </div>
                </div>
            )}

            {loans && loans.length > 0 && (
                <div className="space-y-4 mt-6">
                    {loans.map(loan => (
                        <div key={loan.id}>
                            <LoanSummaryCard 
                                loan={loan} 
                                isExpanded={expandedLoanId === loan.id} 
                                isJustUpdated={justUpdatedLoanId === loan.id}
                                onToggle={() => handleToggleLoan(loan.id)}
                                onDelete={() => handleDeleteLoan(loan.id)}
                                onEdit={() => handleOpenEditModal(loan)}
                            />
                            {expandedLoanId === loan.id && (
                                <div className="pl-4 mt-1 border-l-2 border-blue-800/50">
                                    <div className="flex justify-end pt-2 pr-2">
                                        <button onClick={() => setPrepaymentModalInfo({ isOpen: true, loan })} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 text-sm rounded-md transition-colors">
                                            Gestionar Amortizaciones
                                        </button>
                                    </div>
                                    <AmortizationTable 
                                        loanData={loan} 
                                        highlightMonthIndex={new Date().getMonth()}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Transition show={isLoanModalOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseLoanModal}></div>
                        </Transition.Child>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            {/* CAMBIO AQUÍ: sm:max-w-lg a sm:max-w-6xl */}
                            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-xl leading-6 font-bold text-white text-center mb-4" id="modal-title">
                                        {loanToEdit ? 'Editar Préstamo' : 'Añadir Préstamo'}
                                    </h3>
                                    <LoanForm 
                                        loanToEdit={loanToEdit}
                                        onClose={handleCloseLoanModal}
                                        usedSubcategories={
                                            loanToEdit 
                                            ? loans.map(l => l.linkedSubcategory).filter(sub => sub !== loanToEdit.linkedSubcategory)
                                            : loans.map(l => l.linkedSubcategory)
                                        }
                                    />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition>
            
            <Transition show={prepaymentModalInfo.isOpen} as={React.Fragment}>
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setPrepaymentModalInfo({ isOpen: false, loan: null })}></div>
                            </Transition.Child>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <PrepaymentModal 
                                        loan={prepaymentModalInfo.loan}
                                        isSubmitting={isSubmitting}
                                        onSubmit={handlePrepaymentSubmit} 
                                        onDelete={handlePrepaymentDelete}
                                        onClose={() => setPrepaymentModalInfo({ isOpen: false, loan: null })}
                                    />
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
            </Transition>
        </div>
    );
}

export default AmortizationPage;