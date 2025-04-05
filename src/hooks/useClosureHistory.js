import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../components/firebaseConfig';

export const useClosureHistory = () => {
  const [closureHistory, setClosureHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const loadClosureHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const closuresRef = collection(db, "periodClosures");
        const q = query(closuresRef, orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        const history = [];
        querySnapshot.forEach(doc => {
          history.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setClosureHistory(history);
        setIsHistoryLoading(false);
      } catch (error) {
        console.error("Error al cargar historial de cierres:", error);
        setIsHistoryLoading(false);
      }
    };
    
    loadClosureHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const refreshQuery = query(
        collection(db, "periodClosures"), 
        orderBy("timestamp", "desc"), 
        limit(10)
      );
      
      const refreshSnapshot = await getDocs(refreshQuery);
      const newHistory = [];
      
      refreshSnapshot.forEach(doc => {
        newHistory.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setClosureHistory(newHistory);
      return newHistory;
    } catch (error) {
      console.error("Error al refrescar historial:", error);
      throw error;
    }
  };

  return {
    closureHistory,
    isHistoryLoading,
    refreshHistory
  };
}; 