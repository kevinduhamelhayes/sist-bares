import React, { useState, useContext } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { MenuContext } from '../context/MenuContext';
import { AuthContext } from '../context/AuthContext';
import { useClosureHistory } from '../hooks/useClosureHistory';
import { usePeriodCalculation } from '../hooks/usePeriodCalculation';
import './styles/registerClosure.css';

const RegisterClosure = () => {
  const [dateRange, setDateRange] = useState('day');
  const { menuItems } = useContext(MenuContext);
  const { currentUser } = useContext(AuthContext);
  const { closureHistory, isHistoryLoading, refreshHistory } = useClosureHistory();
  const { isProcessing, periodSummary, calculatePeriodSummary, resetPeriodSummary } = usePeriodCalculation();

  const executePeriodClosure = async () => {
    if (isProcessing || !currentUser || periodSummary.saleCount === 0) {
      if (!currentUser) alert("Error: Usuario no identificado.");
      if (periodSummary.saleCount === 0) alert("No hay ventas para cerrar en este período.");
      return;
    }
    
    if (!confirm(`¿Estás seguro de que deseas hacer el cierre de ${dateRange === 'day' ? 'día' : dateRange === 'week' ? 'semana' : 'mes'}? Esto marcará el corte para este período.`)) {
      return;
    }
    
    try {
      const timestamp = new Date();
      const closureRef = doc(collection(db, "periodClosures"));
      
      await setDoc(closureRef, {
        timestamp,
        period: dateRange,
        startDate: periodSummary.startDate,
        endDate: periodSummary.endDate,
        total: periodSummary.total,
        itemCount: periodSummary.itemCount,
        saleCount: periodSummary.saleCount,
        productDetails: periodSummary.details,
        closedBy: currentUser.uid
      });
      
      await refreshHistory();
      resetPeriodSummary();
      alert('Cierre de período completado con éxito.');
    } catch (error) {
      console.error("Error durante el cierre de período:", error);
      alert('Error al realizar el cierre. Por favor, inténtalo de nuevo.');
    }
  };

  const formatPeriod = (period) => {
    switch (period) {
      case 'day': return 'Día';
      case 'week': return 'Semana';
      case 'month': return 'Mes';
      default: return period;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Cierre de Período</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Seleccionar Período</h3>
        <div className="flex gap-4 mb-6">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => {
              setDateRange('day');
              calculatePeriodSummary('day');
            }}
          >
            Hoy
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => {
              setDateRange('week');
              calculatePeriodSummary('week');
            }}
          >
            Semana
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => {
              setDateRange('month');
              calculatePeriodSummary('month');
            }}
          >
            Mes
          </button>
        </div>

        {isProcessing ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-600 mb-1">Total Ventas</h4>
                <p className="text-2xl font-bold">${periodSummary.total.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-600 mb-1">Items Vendidos</h4>
                <p className="text-2xl font-bold">{periodSummary.itemCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-600 mb-1">Número de Ventas</h4>
                <p className="text-2xl font-bold">{periodSummary.saleCount}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Producto</th>
                    <th className="px-4 py-2 text-right">Cantidad</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {periodSummary.details.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">${item.totalValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={executePeriodClosure}
                disabled={isProcessing || periodSummary.saleCount === 0}
              >
                Ejecutar Cierre
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Historial de Cierres</h3>
        {isHistoryLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Período</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2 text-right">Items</th>
                  <th className="px-4 py-2 text-right">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {closureHistory.map((closure) => (
                  <tr key={closure.id} className="border-b">
                    <td className="px-4 py-2">{formatDate(closure.timestamp)}</td>
                    <td className="px-4 py-2">{formatPeriod(closure.period)}</td>
                    <td className="px-4 py-2 text-right">${closure.total.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{closure.itemCount}</td>
                    <td className="px-4 py-2 text-right">{closure.saleCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterClosure; 