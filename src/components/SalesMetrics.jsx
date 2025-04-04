import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import './styles/salesMetrics.css';

// Componente para métricas de ventas (diarias y mensuales)
const SalesMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // 'day', 'week', 'month', 'year'
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    averageTicket: 0,
    totalItems: 0,
    salesByDay: {},
    salesByProduct: {},
    topProducts: [],
    topDays: []
  });

  useEffect(() => {
    loadMetrics(dateRange);
  }, [dateRange]);

  const loadMetrics = async (range) => {
    setIsLoading(true);

    try {
      // Determinar fechas de inicio y fin según rango
      const endDate = new Date();
      let startDate = new Date();

      switch (range) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1); // Default a mes
      }

      // Consultar todos los cierres de caja en el rango
      const closuresRef = collection(db, "registerClosures");
      const q = query(
        closuresRef,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);

      // Variables para estadísticas
      let totalSales = 0;
      let totalClosures = 0;
      let totalItems = 0;
      let salesByDay = {};
      let salesByProduct = {};

      // Procesar datos
      querySnapshot.forEach(doc => {
        const data = doc.data();
        totalSales += data.total || 0;
        totalItems += data.itemCount || 0;
        totalClosures++;

        // Agrupar por día
        const date = new Date(data.timestamp.seconds * 1000);
        const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!salesByDay[dayKey]) {
          salesByDay[dayKey] = {
            total: 0,
            items: 0,
            count: 0,
            label: new Date(dayKey).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short' 
            })
          };
        }
        
        salesByDay[dayKey].total += data.total || 0;
        salesByDay[dayKey].items += data.itemCount || 0;
        salesByDay[dayKey].count++;

        // Si hay detalles por producto, procesarlos
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach(detail => {
            // Asumiendo que detail tiene tableNumber y puede tener orderBreakdown
            // Si en el futuro tenemos desglose por producto, lo procesaríamos aquí
          });
        }
      });

      // Calcular métricas adicionales
      const averageTicket = totalClosures > 0 ? totalSales / totalClosures : 0;
      
      // Preparar datos para gráficos - Top días
      const topDays = Object.entries(salesByDay)
        .map(([day, data]) => ({ 
          day: data.label, 
          value: data.total,
          items: data.items
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Actualizar estado
      setMetrics({
        totalSales,
        averageTicket,
        totalItems,
        salesByDay,
        salesByProduct,
        topProducts: [], // No tenemos esta info aún
        topDays
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar métricas:", error);
      setIsLoading(false);
    }
  };

  // Helpers para formatear valores
  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatNumber = (value) => value.toLocaleString('es-ES');

  return (
    <div className="sales-metrics-container">
      <h2>Métricas de Ventas</h2>
      
      {/* Selector de rango */}
      <div className="date-range-selector">
        <button 
          className={dateRange === 'day' ? 'active' : ''} 
          onClick={() => setDateRange('day')}
        >
          Hoy
        </button>
        <button 
          className={dateRange === 'week' ? 'active' : ''} 
          onClick={() => setDateRange('week')}
        >
          Semana
        </button>
        <button 
          className={dateRange === 'month' ? 'active' : ''} 
          onClick={() => setDateRange('month')}
        >
          Mes
        </button>
        <button 
          className={dateRange === 'year' ? 'active' : ''} 
          onClick={() => setDateRange('year')}
        >
          Año
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-metrics">Cargando métricas...</div>
      ) : (
        <div className="metrics-content">
          {/* Tarjetas de KPIs */}
          <div className="metrics-cards">
            <div className="metric-card">
              <h3>Ventas Totales</h3>
              <div className="metric-value">{formatCurrency(metrics.totalSales)}</div>
              <div className="metric-label">
                {dateRange === 'day' ? 'hoy' :
                 dateRange === 'week' ? 'esta semana' :
                 dateRange === 'month' ? 'este mes' : 'este año'}
              </div>
            </div>
            
            <div className="metric-card">
              <h3>Ticket Promedio</h3>
              <div className="metric-value">{formatCurrency(metrics.averageTicket)}</div>
              <div className="metric-label">por cierre de caja</div>
            </div>
            
            <div className="metric-card">
              <h3>Productos Vendidos</h3>
              <div className="metric-value">{formatNumber(metrics.totalItems)}</div>
              <div className="metric-label">unidades totales</div>
            </div>
          </div>
          
          {/* Gráfica de días (sería una visualización simple) */}
          {metrics.topDays.length > 0 && (
            <div className="days-chart-section">
              <h3>Ventas por Día</h3>
              <div className="days-chart">
                {metrics.topDays.map((day, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${(day.value / Math.max(...metrics.topDays.map(d => d.value))) * 100}%` 
                      }}
                    >
                      <div className="chart-value">{formatCurrency(day.value)}</div>
                    </div>
                    <div className="chart-label">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Aquí se podría añadir más visualizaciones */}
        </div>
      )}
    </div>
  );
};

export default SalesMetrics; 