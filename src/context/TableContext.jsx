import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  // Estado para las mesas
  const [tables, setTables] = useState([]);
  
  // Inicializar con 25 mesas estándar
  useEffect(() => {
    const initialTables = Array(25).fill().map((_, index) => ({
      id: index + 1,
      number: index + 1,
      type: 'standard',
      capacity: 4,
      isSpecial: false
    }));
    
    setTables(initialTables);
  }, []);

  // Añadir una mesa especial
  const addSpecialTable = (tableNumber, capacity) => {
    // Validar parámetros
    if (capacity <= 0) {
      throw new Error('La capacidad debe ser mayor que cero');
    }
    
    if (tableNumber <= 0) {
      throw new Error('El número de mesa debe ser mayor que cero');
    }
    
    // Verificar si ya existe una mesa con ese número
    if (tables.some(table => table.number === tableNumber)) {
      // La mesa ya existe
      return false;
    }
    
    // Crear una nueva mesa especial
    const newTable = {
      id: `special-${Date.now()}`,
      number: tableNumber,
      type: 'special',
      capacity: capacity,
      isSpecial: true
    };
    
    // Añadir la nueva mesa al estado
    setTables(prevTables => [...prevTables, newTable]);
    
    return true;
  };

  // Eliminar mesas (por número de mesa)
  const removeTable = (tableNumber) => {
    // Verificar si la mesa existe
    const tableExists = tables.some(table => table.number === tableNumber);
    
    if (!tableExists) {
      throw new Error(`No existe una mesa con el número ${tableNumber}`);
    }
    
    // Eliminar la mesa del estado
    setTables(prevTables => prevTables.filter(table => table.number !== tableNumber));
    
    return true;
  };

  // Eliminar múltiples mesas (las últimas n mesas)
  const removeTables = (count) => {
    if (count <= 0) {
      throw new Error('El número de mesas a eliminar debe ser mayor que cero');
    }
    
    if (count > tables.length) {
      throw new Error(`No se pueden eliminar ${count} mesas. Solo hay ${tables.length} mesas disponibles.`);
    }
    
    // Eliminar las últimas n mesas
    setTables(prevTables => prevTables.slice(0, prevTables.length - count));
    
    return count;
  };

  return (
    <TableContext.Provider value={{ 
      tables,
      addSpecialTable,
      removeTable,
      removeTables
    }}>
      {children}
    </TableContext.Provider>
  );
}; 