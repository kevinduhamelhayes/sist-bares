import React, { createContext, useState, useEffect, useMemo } from 'react';
import { db } from '../components/firebaseConfig'; // Importar db
import { collection, query, onSnapshot } from 'firebase/firestore'; // Importar funciones Firestore

export const MenuContext = createContext();

// Datos iniciales de ejemplo (podrían venir de localStorage o API)
const initialMenuItems = [
  { id: '1', name: 'Café', price: 2.50, category: 'Bebidas' },
  { id: '2', name: 'Té', price: 2.00, category: 'Bebidas' },
  { id: '3', name: 'Cerveza', price: 5.00, category: 'Bebidas' },
  { id: '4', name: 'Vino', price: 7.50, category: 'Bebidas' },
  { id: '5', name: 'Agua', price: 1.00, category: 'Bebidas' },
  { id: '6', name: 'Refresco', price: 2.50, category: 'Bebidas' },
  { id: '7', name: 'Hamburguesa', price: 9.00, category: 'Comida' },
  { id: '8', name: 'Pizza', price: 12.00, category: 'Comida' },
];

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true); // Estado de carga

  // useEffect para leer el menú de Firebase en tiempo real
  useEffect(() => {
    console.log('MenuContext: Suscribiéndose al menú de Firebase...');
    setIsLoadingMenu(true);
    const q = query(collection(db, "menuItems"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setMenuItems(itemsArr);
      setIsLoadingMenu(false);
      console.log(`MenuContext: Menú actualizado (${itemsArr.length} items)`);
    }, (error) => {
      console.error("MenuContext: Error al leer menú de Firebase: ", error);
      setIsLoadingMenu(false); // Dejar de cargar incluso si hay error
    });

    // Limpiar suscripción al desmontar
    return () => {
       console.log('MenuContext: Desuscribiéndose del menú.');
      unsubscribe();
    }
  }, []); // Array vacío para que se ejecute solo una vez al montar

  // Ya no necesitamos add/update/delete aquí si ManageMenuItems escribe directo a Firestore

  const contextValue = useMemo(() => ({
    menuItems, // Proveer los items leídos
    isLoadingMenu // Proveer estado de carga
  }), [menuItems, isLoadingMenu]);

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}; 