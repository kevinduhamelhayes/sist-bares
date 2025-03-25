import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  // Estado para las mesas
  const [tables, setTables] = useState([]);
  const [specialTables, setSpecialTables] = useState([]);
  
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
  const addSpecialTable = (capacity) => {
    if (capacity <= 0) {
      throw new Error('La capacidad debe ser mayor que cero');
    }
    
    // Crear una nueva mesa especial
    const newTableNumber = tables.length + 1;
    const newTable = {
      id: `special-${Date.now()}`,
      number: newTableNumber,
      type: 'special',
      capacity: capacity,
      isSpecial: true,
      chairs: capacity
    };
    
    // Añadir la nueva mesa al estado
    setTables(prevTables => [...prevTables, newTable]);
    setSpecialTables(prevSpecialTables => [...prevSpecialTables, newTable]);
    
    return newTableNumber;
  };

  // Eliminar mesas (primero las especiales, luego las estándar)
  const removeTables = (count) => {
    if (count <= 0) {
      throw new Error('El número de mesas a eliminar debe ser mayor que cero');
    }
    
    if (count > tables.length) {
      throw new Error(`No se pueden eliminar ${count} mesas. Solo hay ${tables.length} mesas disponibles.`);
    }
    
    // Primero eliminamos mesas especiales si hay
    let remainingToRemove = count;
    let newTables = [...tables];
    
    if (specialTables.length > 0) {
      const specialToRemove = Math.min(remainingToRemove, specialTables.length);
      
      if (specialToRemove > 0) {
        // Filtrar las mesas especiales a conservar
        const updatedSpecialTables = specialTables.slice(0, -specialToRemove);
        setSpecialTables(updatedSpecialTables);
        
        // Actualizar el array de todas las mesas
        newTables = newTables.filter(table => !table.isSpecial || updatedSpecialTables.some(st => st.id === table.id));
        
        remainingToRemove -= specialToRemove;
      }
    }
    
    // Si aún quedan mesas por eliminar, eliminamos mesas estándar desde el final
    if (remainingToRemove > 0) {
      const standardTables = newTables.filter(table => !table.isSpecial);
      const standardToKeep = Math.max(0, standardTables.length - remainingToRemove);
      
      newTables = [
        ...standardTables.slice(0, standardToKeep),
        ...newTables.filter(table => table.isSpecial)
      ];
    }
    
    // Actualizar el estado de las mesas
    setTables(newTables);
    
    return count;
  };

  return (
    <TableContext.Provider value={{ 
      tables, 
      specialTables,
      addSpecialTable,
      removeTables
    }}>
      {children}
    </TableContext.Provider>
  );
}; 