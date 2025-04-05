import React, { useState, useEffect, useContext } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { MenuContext } from '../context/MenuContext'; // Para obtener precios si es necesario

const DailySales = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { menuItems } = useContext(MenuContext); // Podríamos necesitar el menú si los pedidos no guardan el precio

  useEffect(() => {
    console.log("DailySales: Suscribiéndose a tableStates...");
    setIsLoading(true);
    const tableStatesRef = collection(db, "tableStates");

    const unsubscribe = onSnapshot(tableStatesRef, (querySnapshot) => {
      let dailyTotal = 0;
      const today = new Date().toDateString(); // Obtener la fecha de hoy como string (ej: "Mon Jul 29 2024")

      console.log(`DailySales: Calculando ventas para ${today}...`);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.orders && Array.isArray(data.orders)) {
          data.orders.forEach(order => {
            // Verificar si el pedido tiene timestamp
            if (order.timestamp) {
              const orderDate = new Date(order.timestamp).toDateString();
              // Comparar si la fecha del pedido es igual a la de hoy
              if (orderDate === today) {
                // Sumar el precio del item
                // Asumimos que order.item tiene 'price'. Si no, buscar en menuItems
                const price = order.item?.price;
                if (typeof price === 'number') {
                  dailyTotal += price;
                } else {
                  // Si el precio no está en el pedido, intentar buscarlo en el menú (menos eficiente)
                  const menuItem = menuItems.find(mi => mi.id === order.item?.id); // Asumiendo que el item tiene id
                  if (menuItem && typeof menuItem.price === 'number') {
                    dailyTotal += menuItem.price;
                  } else {
                    console.warn("DailySales: No se pudo determinar el precio para el pedido:", order);
                  }
                }
              }
            }
          });
        }
      });

      console.log(`DailySales: Ventas totales calculadas: ${dailyTotal}`);
      setTotalSales(dailyTotal);
      setIsLoading(false);
    }, (error) => {
      console.error("DailySales: Error al leer tableStates: ", error);
      setIsLoading(false);
    });

    // Limpiar suscripción
    return () => {
      console.log("DailySales: Desuscribiéndose de tableStates.");
      unsubscribe();
    };
  }, [menuItems]); // Depender de menuItems por si los precios se obtienen del menú

  if (isLoading) {
    return (
      <div className="bg-gray-50 text-gray-400 p-5 mx-auto my-5 rounded-lg shadow-sm max-w-md text-center">
        Calculando ventas del día...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 p-5 mx-auto my-5 rounded-lg shadow-sm max-w-md text-center">
      <h2 className="mt-0 text-blue-700 border-b border-gray-200 pb-2.5 mb-5 text-xl font-semibold">
        Ventas del Día
      </h2>
      <div className="text-3xl font-bold text-rose-600">
        Total: ${totalSales.toFixed(2)}
      </div>
      {/* Aquí podríamos añadir más detalles si quisiéramos, como un desglose por mesa o producto */} 
    </div>
  );
};

export default DailySales; 