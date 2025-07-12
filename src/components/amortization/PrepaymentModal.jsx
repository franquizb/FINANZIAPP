import React, { useState, useEffect } from 'react';

const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);

const getInitialFormState = () => ({
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
});

function PrepaymentModal({ onClose, onSubmit, onDelete, loan, isSubmitting }) {
    const [formData, setFormData] = useState(getInitialFormState());
    const [error, setError] = useState('');
    const [editModeKey, setEditModeKey] = useState(null);

    useEffect(() => {
        if (loan) { // Reset form when a new loan is passed
            setFormData(getInitialFormState());
            setError('');
            setEditModeKey(null);
        }
    }, [loan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (dateKey, amount) => {
        const [year, month] = dateKey.split('-').map(Number);
        setEditModeKey(dateKey);
        setFormData({ amount, year, month });
    };

    const handleCancelEdit = () => {
        setEditModeKey(null);
        setFormData(getInitialFormState());
        setError('');
    };

    const handleDeleteClick = (dateKey) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar esta amortización?`)) {
            onDelete(dateKey);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(formData.amount);
        if (!parsedAmount || parsedAmount <= 0) {
            setError('Por favor, introduce un importe válido.');
            return;
        }
        setError('');
        const dateKey = `${formData.year}-${String(formData.month).padStart(2, '0')}`;
        onSubmit({ amount: parsedAmount, date: dateKey });
        
        if (editModeKey) {
            handleCancelEdit();
        } else {
            setFormData(getInitialFormState());
        }
    };

    const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('es-ES', { month: 'long' }) }));

    return (
        <div className="bg-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{editModeKey ? 'Editar' : 'Registrar'} Amortización</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none p-1">&times;</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Para: <span className="font-semibold text-blue-400">{loan?.loanName}</span></p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="prepayment-amount" className="block text-sm font-medium text-gray-300 mb-1">Importe (€)</label>
                    <input
                        type="number"
                        name="amount"
                        id="prepayment-amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: 5000"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Fecha del Pago</label>
                    <div className="flex gap-2">
                        <select name="month" value={formData.month} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
                            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                        <select name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-500 disabled:cursor-wait">
                        {isSubmitting ? 'Guardando...' : (editModeKey ? 'Actualizar Pago' : 'Registrar Pago')}
                    </button>
                    {editModeKey && <button type="button" onClick={handleCancelEdit} className="w-full mt-2 px-4 py-1 text-xs text-gray-300 hover:underline">Cancelar edición</button>}
                </div>
            </form>

            <hr className="my-6 border-gray-600"/>

            <div className="space-y-2">
                <h3 className="font-semibold text-white">Amortizaciones Registradas</h3>
                {loan?.prepayments && Object.keys(loan.prepayments).length > 0 ? (
                    <ul className="max-h-32 overflow-y-auto pr-2 space-y-1">
                        {Object.entries(loan.prepayments).sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => (
                            <li key={date} className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-700">
                                <span>{date}: <span className="font-bold text-green-400">{formatCurrency(value)}</span></span>
                                <div className="flex gap-3 items-center">
                                    <button onClick={() => handleEditClick(date, value)} className="text-yellow-400 hover:text-yellow-300 p-1 rounded-full hover:bg-gray-700" title="Editar">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.232 3.232z"></path></svg>
                                    </button>
                                    <button onClick={() => handleDeleteClick(date)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-700" title="Eliminar">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400">No hay amortizaciones registradas.</p>
                )}
            </div>
        </div>
    );
}

export default PrepaymentModal;