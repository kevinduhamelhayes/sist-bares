import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../components/firebaseConfig';

export const useSalesMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    averageTicket: 0,
    totalItems: 0,
    salesByDay: {},
    salesByProduct: {},
    topProducts: [],
    topDays: []
  });

  const loadMetrics = async (range) => {
    setIsLoading(true);

    try {
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
          startDate.setMonth(startDate.getMonth() - 1);
      }

      const salesRef = collection(db, "completedSales");
      const q = query(
        salesRef,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);

      let totalSales = 0;
      let totalSalesCount = 0;
      let totalItems = 0;
      let salesByDay = {};
      let salesByProduct = {};

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const amount = data.totalAmount || 0;
        totalSales += amount;
        totalSalesCount++;
        
        if (data.items && Array.isArray(data.items)) {
          totalItems += data.items.length;
          
          data.items.forEach(item => {
            const productId = item.id || item.name;
            if (!salesByProduct[productId]) {
              salesByProduct[productId] = { 
                name: item.name,
                quantity: 0,
                totalValue: 0
              };
            }
            salesByProduct[productId].quantity += 1;
            salesByProduct[productId].totalValue += item.price || 0;
          });
        }

        const date = new Date(data.timestamp.seconds * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
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
        
        salesByDay[dayKey].total += amount;
        if (data.items && Array.isArray(data.items)) {
          salesByDay[dayKey].items += data.items.length;
        }
        salesByDay[dayKey].count++;
      });

      const averageTicket = totalSalesCount > 0 ? totalSales / totalSalesCount : 0;
      
      const topDays = Object.entries(salesByDay)
        .map(([day, data]) => ({ 
          day: data.label, 
          value: data.total,
          items: data.items
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const topProducts = Object.entries(salesByProduct)
        .map(([id, data]) => ({ 
          id: id,
          name: data.name, 
          quantity: data.quantity,
          totalValue: data.totalValue
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10);

      setMetrics({
        totalSales,
        averageTicket,
        totalItems,
        salesByDay,
        salesByProduct,
        topProducts,
        topDays
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar métricas:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(dateRange);
  }, [dateRange]);

  return {
    isLoading,
    metrics,
    dateRange,
    setDateRange,
    loadMetrics
  };
}; 