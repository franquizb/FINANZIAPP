import React from 'react';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(value || 0);
};

function AmortizationTable({ loanData, highlightMonthIndex }) {
    if (!loanData || !loanData.schedule || loanData.schedule.length === 0) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-4 mt-2 text-center text-gray-400">
                No hay un cuadro de amortización para mostrar.
            </div>
        );
    }

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    // Asegurarse de que el schedule tenga las propiedades necesarias, incluyendo accumulatedPrincipalPaid
    const formattedSchedule = loanData.schedule.map((row, index) => ({
        ...row,
        monthYear: `${row.monthName.charAt(0).toUpperCase() + row.monthName.slice(1)} ${row.year}`,
        installmentNumber: index + 1,
        // CAMBIO CRÍTICO AQUÍ: Usar row.payment en lugar de row.monthlyPayment
        payment: row.payment || 0, 
        accumulatedPrincipalPaid: row.accumulatedPrincipalPaid || 0 
    }));

    const prepayments = loanData.prepayments || {};
    
    return (
        <div className="bg-gray-800/50 rounded-lg p-2 sm:p-4 mt-2">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300 table-auto">
                    <thead className="hidden md:table-header-group bg-gray-700/50 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="px-3 py-2">Nº Cuota</th>
                            <th className="px-3 py-2">Mes/Año</th>
                            <th className="px-3 py-2 text-right">Cuota Fija</th>
                            <th className="px-3 py-2 text-right">Intereses</th>
                            <th className="px-3 py-2 text-right">Capital Amortizado Cuota</th>
                            <th className="px-3 py-2 text-right">Capital Amortizado Total</th>
                            <th className="px-3 py-2 text-right">Capital Pendiente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedSchedule.map((row) => {
                            const rowMonthIndex = new Date(Date.parse(row.monthName + " 1, 2000")).getMonth();
                            const isCurrentMonth = rowMonthIndex === currentMonthIndex && row.year === currentYear;
                            
                            const monthKey = `${row.year}-${String(rowMonthIndex + 1).padStart(2, '0')}`;
                            const prepaymentAmount = prepayments[monthKey];

                            return (
                                <tr 
                                    key={`${row.year}-${row.monthName}-${row.installmentNumber}`} 
                                    className={`
                                        border-b border-gray-700
                                        block mb-2 rounded-lg p-2 md:table-row md:mb-0 md:p-0 md:rounded-none
                                        ${isCurrentMonth ? 'bg-blue-900/50' : 'bg-gray-800/60 md:bg-transparent'}
                                        text-xs sm:text-sm font-light md:font-normal
                                    `}
                                >
                                    <td className="p-1 md:px-3 md:py-2 font-medium block md:table-cell text-right md:text-left">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Nº Cuota:</span>
                                            <span className="text-right">{row.installmentNumber}</span>
                                        </div>
                                        <span className="hidden md:inline">{row.installmentNumber}</span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 whitespace-nowrap capitalize block md:table-cell text-right md:text-left">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Mes/Año:</span>
                                            <span className="text-right">{row.monthYear}</span>
                                        </div>
                                        <span className="hidden md:inline">{row.monthYear}</span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 font-semibold text-blue-400 block md:table-cell text-right">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Cuota Fija:</span>
                                            <span className="text-right">{formatCurrency(row.payment)}</span>
                                        </div>
                                        <span className="hidden md:inline">{formatCurrency(row.payment)}</span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 text-red-400 block md:table-cell text-right">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Intereses:</span>
                                            <span className="text-right">{formatCurrency(row.interestPaid)}</span>
                                        </div>
                                        <span className="hidden md:inline">{formatCurrency(row.interestPaid)}</span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 text-green-400 block md:table-cell text-right">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Capital Cuota:</span>
                                            <span className="text-right">
                                                {formatCurrency(row.principalPaid)}
                                                {prepaymentAmount && (
                                                    <span className="text-xs text-green-300 ml-1 font-bold" title={`Amortización anticipada: ${formatCurrency(prepaymentAmount)}`}>
                                                        (+{formatCurrency(prepaymentAmount).replace(/\s*€/,'')})
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <span className="hidden md:inline">
                                            {formatCurrency(row.principalPaid)}
                                            {prepaymentAmount && (
                                                <span className="text-xs text-green-300 ml-1 font-bold" title={`Amortización anticipada: ${formatCurrency(prepaymentAmount)}`}>
                                                    (+{formatCurrency(prepaymentAmount).replace(/\s*€/,'')})
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 block md:table-cell text-right font-bold text-purple-400">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Amortizado Total:</span>
                                            <span className="text-right">{formatCurrency(row.accumulatedPrincipalPaid)}</span>
                                        </div>
                                        <span className="hidden md:inline">{formatCurrency(row.accumulatedPrincipalPaid)}</span>
                                    </td>
                                    <td className="p-1 md:px-3 md:py-2 block md:table-cell text-right">
                                        <div className="grid grid-cols-2 gap-x-2 items-center md:hidden">
                                            <span className="font-bold text-gray-400 text-left">Capital Pendiente:</span>
                                            <span className="text-right">{formatCurrency(row.remainingBalance)}</span>
                                        </div>
                                        <span className="hidden md:inline">{formatCurrency(row.remainingBalance)}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AmortizationTable;