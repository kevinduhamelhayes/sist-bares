import { useState, useEffect, useCallback, useContext } from 'react';
import { db } from '../components/firebaseConfig';
import { 
  doc, 
  collection, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  getDoc,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

// Hook reutilizable para la lógica de una mesa (estándar o especial)
export const useTableLogic = (tableNumber, chairCount) => {
  const { currentUser } = useContext(AuthContext);
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

  const clearTableData = useCallback(async (tableId, tableNumber) => {
    if (!currentUser) {
      console.error("Usuario no autenticado. No se puede completar la venta.");
      alert("Error: Debes iniciar sesión para registrar la venta.");
      return;
    }

    const tableRef = doc(db, "tableStates", tableId);

    try {
      // --- PASO 1: Guardar Venta Completada ---
      const tableSnap = await getDoc(tableRef);
      if (!tableSnap.exists()) {
        console.error(`Error: No se encontró la mesa con ID ${tableId}`);
        return;
      }

      const tableData = tableSnap.data();
      const orders = tableData.orders || [];

      if (orders.length > 0) {
        let totalAmount = 0;
        const items = [];
        
        orders.forEach(order => {
          const price = order?.item?.price;
          const name = order?.item?.name;
          const itemId = order?.item?.id || name;

          if (itemId && name && typeof price === 'number' && price > 0) {
            totalAmount += price;
            items.push({
              id: itemId,
              name: name,
              price: price,
            });
          } else {
             console.warn("Pedido inválido encontrado al cerrar mesa:", order);
          }
        });

        if (totalAmount > 0) {
           const saleData = {
             timestamp: Timestamp.now(),
             tableId: tableId,
             tableNumber: tableNumber || tableData.tableNumber || 'N/A',
             totalAmount: totalAmount,
             items: items,
             processedBy: currentUser.uid
           };

           try {
             const salesCollectionRef = collection(db, "completedSales");
             await addDoc(salesCollectionRef, saleData);
             console.log(`Venta de mesa ${tableNumber || tableId} guardada con éxito.`);
           } catch (saleError) {
             console.error("Error al guardar la venta completada:", saleError);
             alert("Error crítico al guardar la venta. No se limpiará la mesa.");
             return;
           }
        } else {
           console.log(`Mesa ${tableNumber || tableId} sin importe total, no se guarda venta.`);
        }

      } else {
         console.log(`Mesa ${tableNumber || tableId} sin pedidos, no se guarda venta.`);
      }

      // --- PASO 2: Limpieza de la mesa (Lógica existente asumida) ---
      await updateDoc(tableRef, {
        orders: [],
      }); 
      console.log(`Datos de la mesa ${tableNumber || tableId} limpiados.`);

    } catch (error) {
      console.error(`Error al procesar/limpiar la mesa ${tableId}:`, error);
      alert(`Error al procesar la mesa ${tableNumber || tableId}.`);
    }
  }, [currentUser]);

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
    clearTableData
  };
}; 