import { useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../components/firebaseConfig';

export const usePeriodCalculation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [periodSummary, setPeriodSummary] = useState({
    total: 0,
    itemCount: 0,
    saleCount: 0,
    startDate: null,
    endDate: null,
    details: []
  });

  const calculatePeriodSummary = async (dateRange) => {
    setIsProcessing(true);
    
    try {
      const endDate = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setHours(0, 0, 0, 0);
      }
      
      const salesRef = collection(db, "completedSales");
      const q = query(
        salesRef,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate),
        orderBy("timestamp", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      
      let total = 0;
      let itemCount = 0;
      let saleCount = 0;
      let productSummary = {};
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const amount = data.totalAmount || 0;
        
        total += amount;
        saleCount++;
        
        if (data.items && Array.isArray(data.items)) {
          itemCount += data.items.length;
          
          data.items.forEach(item => {
            const productId = item.id || item.name;
            if (!productSummary[productId]) {
              productSummary[productId] = {
                name: item.name,
                quantity: 0,
                totalValue: 0
              };
            }
            
            productSummary[productId].quantity += 1;
            productSummary[productId].totalValue += item.price || 0;
          });
        }
      });
      
      const productDetails = Object.entries(productSummary)
        .map(([id, data]) => ({
          id,
          name: data.name,
          quantity: data.quantity,
          totalValue: data.totalValue
        }))
        .sort((a, b) => b.totalValue - a.totalValue);
      
      const newSummary = {
        total,
        itemCount,
        saleCount,
        startDate,
        endDate,
        details: productDetails
      };
      
      setPeriodSummary(newSummary);
      setIsProcessing(false);
      return newSummary;
    } catch (error) {
      console.error("Error al calcular resumen del período:", error);
      setIsProcessing(false);
      throw error;
    }
  };

  const resetPeriodSummary = () => {
    setPeriodSummary({
      total: 0,
      itemCount: 0,
      saleCount: 0,
      startDate: null,
      endDate: null,
      details: []
    });
  };

  return {
    isProcessing,
    periodSummary,
    calculatePeriodSummary,
    resetPeriodSummary
  };
}; 