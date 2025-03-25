import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Estado para los pedidos - Estructura: { tableId: { chairIndex: [orders] } }
  const [orders, setOrders] = useState({});
  
  // Cargar pedidos guardados del localStorage al iniciar
  useEffect(() => {
    const savedOrders = localStorage.getItem('tableOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    }
  }, []);
  
  // Guardar pedidos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('tableOrders', JSON.stringify(orders));
  }, [orders]);
  
  // Añadir un pedido a una silla específica
  const addOrder = (tableId, chairIndex, item) => {
    setOrders(prevOrders => {
      // Crear estructura si no existe
      const tableOrders = prevOrders[tableId] || {};
      const chairOrders = tableOrders[chairIndex] || [];
      
      // Añadir nuevo pedido
      const newChairOrders = [...chairOrders, {
        ...item,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }];
      
      // Actualizar estructura completa
      return {
        ...prevOrders,
        [tableId]: {
          ...tableOrders,
          [chairIndex]: newChairOrders
        }
      };
    });
    
    return true;
  };
  
  // Eliminar un pedido específico
  const removeOrder = (tableId, chairIndex, orderId) => {
    setOrders(prevOrders => {
      // Verificar si existen las estructuras necesarias
      if (!prevOrders[tableId] || !prevOrders[tableId][chairIndex]) {
        return prevOrders;
      }
      
      // Filtrar el pedido a eliminar
      const updatedChairOrders = prevOrders[tableId][chairIndex].filter(
        order => order.id !== orderId
      );
      
      // Si no quedan pedidos para esta silla
      if (updatedChairOrders.length === 0) {
        const updatedTableOrders = { ...prevOrders[tableId] };
        delete updatedTableOrders[chairIndex];
        
        // Si no quedan sillas con pedidos para esta mesa
        if (Object.keys(updatedTableOrders).length === 0) {
          const updatedOrders = { ...prevOrders };
          delete updatedOrders[tableId];
          return updatedOrders;
        }
        
        return {
          ...prevOrders,
          [tableId]: updatedTableOrders
        };
      }
      
      // Actualizar con los pedidos restantes
      return {
        ...prevOrders,
        [tableId]: {
          ...prevOrders[tableId],
          [chairIndex]: updatedChairOrders
        }
      };
    });
    
    return true;
  };
  
  // Eliminar todos los pedidos de una silla
  const clearChairOrders = (tableId, chairIndex) => {
    setOrders(prevOrders => {
      // Verificar si existen las estructuras necesarias
      if (!prevOrders[tableId]) {
        return prevOrders;
      }
      
      const updatedTableOrders = { ...prevOrders[tableId] };
      
      // Eliminar todos los pedidos de esta silla
      delete updatedTableOrders[chairIndex];
      
      // Si no quedan sillas con pedidos para esta mesa
      if (Object.keys(updatedTableOrders).length === 0) {
        const updatedOrders = { ...prevOrders };
        delete updatedOrders[tableId];
        return updatedOrders;
      }
      
      return {
        ...prevOrders,
        [tableId]: updatedTableOrders
      };
    });
    
    return true;
  };
  
  // Eliminar todos los pedidos de una mesa
  const clearTableOrders = (tableId) => {
    setOrders(prevOrders => {
      const updatedOrders = { ...prevOrders };
      delete updatedOrders[tableId];
      return updatedOrders;
    });
    
    return true;
  };
  
  // Obtener todos los pedidos de una mesa
  const getTableOrders = (tableId) => {
    return orders[tableId] || {};
  };
  
  // Obtener todos los pedidos de una silla específica
  const getChairOrders = (tableId, chairIndex) => {
    return orders[tableId] && orders[tableId][chairIndex] 
      ? orders[tableId][chairIndex] 
      : [];
  };
  
  // Calcular el total de una mesa
  const calculateTableTotal = (tableId) => {
    if (!orders[tableId]) return 0;
    
    return Object.values(orders[tableId])
      .flat()
      .reduce((total, order) => total + (order.price || 0), 0);
  };
  
  return (
    <OrderContext.Provider value={{ 
      orders,
      addOrder,
      removeOrder,
      clearChairOrders,
      clearTableOrders,
      getTableOrders,
      getChairOrders,
      calculateTableTotal
    }}>
      {children}
    </OrderContext.Provider>
  );
}; 