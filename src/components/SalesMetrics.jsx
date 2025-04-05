import React from 'react';
import { useSalesMetrics } from '../hooks/useSalesMetrics';
import { useFormatters } from '../hooks/useFormatters';

const SalesMetrics = () => {
  const { isLoading, metrics, dateRange, setDateRange } = useSalesMetrics();
  const { formatCurrency, formatNumber, formatDateRange } = useFormatters();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Métricas de Ventas</h2>
      
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            dateRange === 'day' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          onClick={() => setDateRange('day')}
        >
          Hoy
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            dateRange === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          onClick={() => setDateRange('week')}
        >
          Semana
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            dateRange === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          onClick={() => setDateRange('month')}
        >
          Mes
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            dateRange === 'year' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          onClick={() => setDateRange('year')}
        >
          Año
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-2">Ventas Totales</h3>
              <div className="text-3xl font-bold mb-1">{formatCurrency(metrics.totalSales)}</div>
              <div className="text-sm text-gray-500">{formatDateRange(dateRange)}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-2">Ticket Promedio</h3>
              <div className="text-3xl font-bold mb-1">{formatCurrency(metrics.averageTicket)}</div>
              <div className="text-sm text-gray-500">por venta completada</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-2">Productos Vendidos</h3>
              <div className="text-3xl font-bold mb-1">{formatNumber(metrics.totalItems)}</div>
              <div className="text-sm text-gray-500">unidades totales</div>
            </div>
          </div>
          
          {metrics.topDays.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">Ventas por Día</h3>
              <div className="flex justify-between items-end h-64 gap-4">
                {metrics.topDays.map((day, index) => {
                  const maxValue = Math.max(...metrics.topDays.map(d => d.value));
                  const height = `${(day.value / maxValue) * 100}%`;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full">
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all duration-500"
                             style={{ height }}>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                            {formatCurrency(day.value)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-medium">{day.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {metrics.topProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">Top 10 Productos Vendidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-right">Cantidad</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-right">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topProducts.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2 text-right">{formatNumber(product.quantity)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(product.totalValue)}</td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(product.totalValue / product.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesMetrics; 