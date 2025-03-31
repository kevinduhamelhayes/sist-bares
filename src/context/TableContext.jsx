import { createContext, useState, useEffect, useMemo } from 'react';

// Crear el contexto
export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  // Estado para las mesas - Inicializar directamente con las 25 mesas estándar
  const [tables, setTables] = useState(() => {
    console.log('TableContext: Creando mesas estándar iniciales en useState...');
    const initialTables = Array(25).fill().map((_, index) => ({
      id: `standard-${index + 1}`,
      number: index + 1,
      type: 'standard',
      capacity: 4,
      isSpecial: false
    }));
    console.log(`TableContext: Mesas iniciales creadas (${initialTables.length})`);
    return initialTables;
  });

  // Log para verificar el estado actual (ya no necesitamos el useEffect de inicialización)
  useEffect(() => {
    console.log('TableContext: Estado actual de mesas:', tables.length > 0 ? `${tables.length} mesas` : 'Vacío');
  }, [tables]);

  // Añadir una mesa especial
  const addSpecialTable = (tableNumber, capacity) => {
    if (capacity <= 0 || tableNumber <= 0) {
      console.error('Error: El número de mesa y la capacidad deben ser positivos.');
      return false;
    }
    if (tables.some(table => table.number === tableNumber)) {
      console.warn(`Advertencia: Ya existe una mesa con el número ${tableNumber}.`);
      return false;
    }
    const newTable = {
      id: `special-${Date.now()}`,
      number: tableNumber,
      type: 'special',
      capacity: capacity,
      isSpecial: true
    };
    setTables(prevTables => {
      const updatedTables = [...prevTables, newTable];
      console.log(`TableContext: Mesa especial #${tableNumber} añadida. Total: ${updatedTables.length}`);
      return updatedTables;
    });
    return true;
  };

  // Eliminar mesas (por número de mesa)
  const removeTable = (tableNumber) => {
    setTables(prevTables => {
      const updatedTables = prevTables.filter(table => table.number !== tableNumber);
      if (updatedTables.length === prevTables.length) {
        console.warn(`Advertencia: No se encontró mesa con número ${tableNumber} para eliminar.`);
      } else {
        console.log(`TableContext: Mesa #${tableNumber} eliminada. Restantes: ${updatedTables.length}`);
      }
      return updatedTables;
    });
    return true;
  };

  // Eliminar múltiples mesas (las últimas n mesas)
  const removeTables = (count) => {
    if (count <= 0) {
      console.error('Error: El número de mesas a eliminar debe ser positivo.');
      return false;
    }
    setTables(prevTables => {
      if (count > prevTables.length) {
        console.error(`Error: No se pueden eliminar ${count} mesas. Solo hay ${prevTables.length}.`);
        return prevTables; // No modificar si no hay suficientes
      }
      const updatedTables = prevTables.slice(0, prevTables.length - count);
      console.log(`TableContext: ${count} mesas eliminadas. Restantes: ${updatedTables.length}`);
      return updatedTables;
    });
    return true;
  };
  
  // Memorizar el valor del contexto para evitar re-renderizados innecesarios
  const contextValue = useMemo(() => ({
    tables,
    addSpecialTable,
    removeTable,
    removeTables
  }), [tables]); // Solo se actualiza si 'tables' cambia

  // Log para verificar cuándo se renderiza el Provider
  useEffect(() => {
    console.log('TableProvider rendered/updated');
  });

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}; 