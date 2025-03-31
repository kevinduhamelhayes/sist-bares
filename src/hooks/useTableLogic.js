import { useState, useEffect } from 'react';
import { db } from '../components/firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Hook reutilizable para la lógica de una mesa (estándar o especial)
export const useTableLogic = (tableNumber, chairCount) => {
  const docId = `table-${tableNumber}`;
  const tableStateRef = doc(db, "tableStates", docId);

  // Estados locales
  const [chairStates, setChairStates] = useState(() => Array(chairCount).fill('empty'));
  const [orders, setOrders] = useState([]);
  const [tableColor, setTableColor] = useState("#ddd");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentChairIndex, setCurrentChairIndex] = useState(null);
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Mapeo de colores (igual que antes)
  const stateColors = {
    empty: 'var(--chair-bg-empty)',
    male: 'var(--chair-bg-male)',
    female: 'var(--chair-bg-female)',
  };

  // ---- LEER/ESCUCHAR ESTADO ----
  useEffect(() => {
    console.log(`useTableLogic ${tableNumber}: Suscribiéndose al estado...`);
    setIsLoadingState(true);
    const unsubscribe = onSnapshot(tableStateRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`useTableLogic ${tableNumber}: Datos recibidos:`, data);
        // Validar y establecer estados
        if (data.chairStates && Array.isArray(data.chairStates) && data.chairStates.length === chairCount) {
          setChairStates(data.chairStates);
        } else {
          console.warn(`useTableLogic ${tableNumber}: chairStates inválidos. Inicializando.`);
          setChairStates(Array(chairCount).fill('empty'));
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]); // Inicializar si falta o es inválido
        }
      } else {
        console.log(`useTableLogic ${tableNumber}: No existe documento.`);
        // Resetear a estado inicial si el documento no existe
        setChairStates(Array(chairCount).fill('empty'));
        setOrders([]);
      }
      setIsLoadingState(false);
    }, (error) => {
      console.error(`useTableLogic ${tableNumber}: Error Firestore: `, error);
      setIsLoadingState(false);
    });
    return () => {
      console.log(`useTableLogic ${tableNumber}: Desuscribiéndose.`);
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNumber, chairCount]); // Depender de chairCount por si cambia en SpecialUnit

  // ---- GUARDAR ESTADO ----
  useEffect(() => {
    if (isLoadingState) return;
    const saveData = async () => {
      console.log(`useTableLogic ${tableNumber}: Guardando estado...`);
      try {
        await setDoc(tableStateRef, {
          tableNumber: tableNumber,
          chairCount: chairCount,
          chairStates: chairStates,
          orders: orders
        }, { merge: true });
      } catch (error) {
        console.error(`useTableLogic ${tableNumber}: Error al guardar: `, error);
      }
    };
    saveData();
  }, [chairStates, orders, tableNumber, chairCount, tableStateRef, isLoadingState]);

  // ---- EFECTO COLOR MESA ----
  useEffect(() => {
    const isAnyOccupied = chairStates.some(state => state !== 'empty');
    setTableColor(isAnyOccupied ? "var(--primary-color)" : "#ddd");
  }, [chairStates]);

  // ---- MANEJADORES DE EVENTOS ----
  const handleTableClick = () => {
    if (tableColor === "#ddd") { // Si inactiva
      // No hacemos nada aquí, el useEffect de color la activará si se ocupa una silla
    } else { // Si activa
      if (chairStates.every(state => state === 'empty')) {
        // No se puede desactivar manualmente? O sí? Por ahora, no hacemos nada.
        // Si se quisiera desactivar manualmente y borrar pedidos:
        // setChairStates(Array(chairCount).fill('empty'));
        // setOrders([]);
      } else {
        alert("No se puede cerrar la mesa si hay clientes sentados");
      }
    }
  };

  const handleChairClick = (index) => {
    const currentState = chairStates[index];
    let nextState = 'empty';
    let shouldClearOrders = false;

    switch (currentState) {
      case 'empty': nextState = 'male'; break;
      case 'male': nextState = 'female'; break;
      case 'female': 
        nextState = 'empty'; 
        shouldClearOrders = true; 
        break;
      default: nextState = 'empty';
    }

    setChairStates(prev => prev.map((st, i) => i === index ? nextState : st));
    if (shouldClearOrders) {
      setOrders(prev => prev.filter(order => order.chairIndex !== index));
    }
  };

  const handleAddOrderToChair = (index) => {
    if (chairStates[index] === 'empty') {
      alert("No puedes añadir productos a una silla vacía.");
      return;
    }
    setCurrentChairIndex(index);
    setShowOrderModal(true);
  };

  const handleAddOrder = (item) => {
    if (currentChairIndex !== null) {
      setOrders(prev => [...prev, {
        item,
        chairIndex: currentChairIndex,
        timestamp: new Date().toISOString()
      }]);
      setShowOrderModal(false); // Cerrar modal al añadir
    }
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setCurrentChairIndex(null);
  };

  // ---- FUNCIONES AUXILIARES ----
  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + (order.item?.price || 0), 0).toFixed(2);
  };

  const getOrdersByChair = (chairIndex) => {
    return orders.filter(order => order.chairIndex === chairIndex);
  };

  // Devolver estados y funciones necesarios para los componentes
  return {
    isLoadingState,
    tableColor,
    chairStates,
    orders,
    stateColors,
    showOrderModal,
    currentChairIndex,
    handleTableClick,
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
  };
}; 