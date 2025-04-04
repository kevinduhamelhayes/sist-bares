import React, { useState, useEffect, useContext } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { MenuContext } from '../context/MenuContext'; 
import './styles/registerClosure.css';

const RegisterClosure = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSales, setCurrentSales] = useState({
    total: 0,
    itemCount: 0,
    tableCount: 0,
    details: [] // Detalles por mesa o por producto
  });
  const [closureHistory, setClosureHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { menuItems } = useContext(MenuContext);

  // Cargar historial de cierres
  useEffect(() => {
    const loadClosureHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const closuresRef = collection(db, "registerClosures");
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

  // Calcular ventas actuales desde tableStates
  const calculateCurrentSales = async () => {
    setIsProcessing(true);
    
    try {
      const tableStatesRef = collection(db, "tableStates");
      const querySnapshot = await getDocs(tableStatesRef);
      
      let total = 0;
      let itemCount = 0;
      let tablesWithOrders = 0;
      let details = [];
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          tablesWithOrders++;
          
          let tableTotal = 0;
          data.orders.forEach(order => {
            const price = order.item?.price || 0;
            tableTotal += price;
            itemCount++;
          });
          
          total += tableTotal;
          details.push({
            tableNumber: data.tableNumber,
            total: tableTotal,
            orderCount: data.orders.length
          });
        }
      });
      
      setCurrentSales({
        total,
        itemCount,
        tableCount: tablesWithOrders,
        details
      });
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error al calcular ventas actuales:", error);
      setIsProcessing(false);
    }
  };

  // Ejecutar cierre de cajas
  const executeRegisterClosure = async () => {
    if (isProcessing) return;
    
    if (!confirm('¿Estás seguro de que deseas hacer el cierre de caja? Esto limpiará todas las mesas actuales.')) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 1. Guardar un nuevo documento en la colección registerClosures
      const timestamp = new Date();
      const closureRef = doc(collection(db, "registerClosures"));
      
      await setDoc(closureRef, {
        timestamp,
        total: currentSales.total,
        itemCount: currentSales.itemCount,
        tableCount: currentSales.tableCount,
        details: currentSales.details,
        closedBy: "usuario_actual" // Idealmente obtener del contexto de autenticación
      });
      
      // 2. Limpiar todas las mesas (eliminar pedidos)
      const tableStatesRef = collection(db, "tableStates");
      const querySnapshot = await getDocs(tableStatesRef);
      
      const promises = [];
      
      querySnapshot.forEach(document => {
        const data = document.data();
        
        // Solo limpiar mesas que tengan pedidos
        if (data.orders && data.orders.length > 0) {
          const tableRef = doc(db, "tableStates", document.id);
          
          // Mantener chairStates pero limpiar orders
          promises.push(setDoc(tableRef, {
            ...data,
            orders: []
          }, { merge: true }));
        }
      });
      
      await Promise.all(promises);
      
      // 3. Actualizar estado local
      setCurrentSales({
        total: 0,
        itemCount: 0,
        tableCount: 0,
        details: []
      });
      
      // 4. Recargar historial
      const refreshQuery = query(
        collection(db, "registerClosures"), 
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
      setIsProcessing(false);
      
      alert('Cierre de caja completado con éxito.');
    } catch (error) {
      console.error("Error durante el cierre de caja:", error);
      setIsProcessing(false);
      alert('Error al realizar el cierre de caja. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-closure-container">
      <h2>Cierre de Caja</h2>
      
      <div className="current-sales-section">
        <h3>Ventas Actuales en Sistema</h3>
        <button 
          className="calculate-button"
          onClick={calculateCurrentSales}
          disabled={isProcessing}
        >
          Calcular Ventas Actuales
        </button>
        
        {currentSales.total > 0 && (
          <div className="sales-summary">
            <div className="sales-total">Total: ${currentSales.total.toFixed(2)}</div>
            <div className="sales-details">
              <div>Productos vendidos: {currentSales.itemCount}</div>
              <div>Mesas con pedidos: {currentSales.tableCount}</div>
            </div>
            
            {currentSales.details.length > 0 && (
              <div className="table-details">
                <h4>Detalle por Mesa</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Mesa</th>
                      <th>Total</th>
                      <th>Pedidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSales.details.map(detail => (
                      <tr key={`table-${detail.tableNumber}`}>
                        <td>#{detail.tableNumber}</td>
                        <td>${detail.total.toFixed(2)}</td>
                        <td>{detail.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <button 
              className="execute-closure-button"
              onClick={executeRegisterClosure}
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Ejecutar Cierre de Caja'}
            </button>
          </div>
        )}
      </div>
      
      <div className="closure-history-section">
        <h3>Historial de Cierres</h3>
        
        {isHistoryLoading ? (
          <div className="loading">Cargando historial...</div>
        ) : closureHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Total</th>
                <th>Productos</th>
                <th>Mesas</th>
              </tr>
            </thead>
            <tbody>
              {closureHistory.map(closure => (
                <tr key={closure.id}>
                  <td>{new Date(closure.timestamp.seconds * 1000).toLocaleString()}</td>
                  <td>${closure.total.toFixed(2)}</td>
                  <td>{closure.itemCount}</td>
                  <td>{closure.tableCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-history">No hay cierres registrados.</div>
        )}
      </div>
    </div>
  );
};

export default RegisterClosure; 