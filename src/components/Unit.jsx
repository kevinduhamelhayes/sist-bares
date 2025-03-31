import { useState, useEffect, useContext } from "react"
import "./styles/body.css"
import "./styles/unit.css"
// Importar Firebase y Firestore
import { db } from "./firebaseConfig";
import { collection, query, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { MenuContext } from "../context/MenuContext"; // Importar MenuContext

const Unit = ({ tableNumber }) => {
  const docId = `table-${tableNumber}`; // ID del documento en Firestore
  const tableStateRef = doc(db, "tableStates", docId); // Referencia al documento

  // Log para debugging
  useEffect(() => {
    console.log(`Rendering Unit for table ${tableNumber}`);
  }, [tableNumber]);

  // Estados locales (se inicializarán desde Firestore o por defecto)
  const [tableColor, setTableColor] = useState("#ddd")
  const [chairStates, setChairStates] = useState(Array(4).fill('empty'));
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentChairIndex, setCurrentChairIndex] = useState(null);
  const [isLoadingState, setIsLoadingState] = useState(true); // Estado de carga inicial
  
  // Mapeo de estados a colores (usando variables CSS)
  const stateColors = {
    empty: 'var(--chair-bg-empty)',
    male: 'var(--chair-bg-male)',
    female: 'var(--chair-bg-female)',
  };

  // Consumir MenuContext
  const { menuItems, isLoadingMenu } = useContext(MenuContext);

  // ---- useEffect para LEER/ESCUCHAR el estado de la mesa desde Firestore ----
  useEffect(() => {
    console.log(`Unit ${tableNumber}: Suscribiéndose al estado de la mesa (ID: ${docId})...`);
    setIsLoadingState(true);

    const unsubscribe = onSnapshot(tableStateRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log(`Unit ${tableNumber}: Datos recibidos de Firestore:`, docSnap.data());
        const data = docSnap.data();
        // Validar y establecer estados locales desde Firestore
        if (data.chairStates && Array.isArray(data.chairStates) && data.chairStates.length === 4) {
          setChairStates(data.chairStates);
        } else {
           console.warn(`Unit ${tableNumber}: chairStates inválidos o faltantes en Firestore.`);
           // Opcional: podrías querer inicializarlo en Firestore aquí si no existe
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
           console.warn(`Unit ${tableNumber}: orders inválidos o faltantes en Firestore.`);
        }
        // Podrías cargar tableColor también si lo guardas

      } else {
        // El documento no existe (primera vez que se interactúa con la mesa?)
        console.log(`Unit ${tableNumber}: No existe documento de estado en Firestore. Usando estado inicial.`);
        // Opcional: Crear el documento inicial aquí si se desea
        // setDoc(tableStateRef, { tableNumber, chairStates: Array(4).fill('empty'), orders: [] });
      }
      setIsLoadingState(false);
    }, (error) => {
      console.error(`Unit ${tableNumber}: Error al escuchar estado de Firestore: `, error);
      setIsLoadingState(false); // Dejar de cargar incluso si hay error
    });

    // Limpiar suscripción al desmontar
    return () => {
      console.log(`Unit ${tableNumber}: Desuscribiéndose del estado de la mesa.`);
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNumber]); // Dependencia solo de tableNumber para obtener la ref correcta

  // ---- useEffect para GUARDAR el estado de la mesa en Firestore ----
  useEffect(() => {
    // No guardar durante la carga inicial o si los estados no han cambiado realmente
    if (isLoadingState) {
      return;
    }

    const saveData = async () => {
      console.log(`Unit ${tableNumber}: Guardando estado en Firestore...`, { chairStates, orders });
      try {
        await setDoc(tableStateRef, {
          tableNumber: tableNumber,
          chairStates: chairStates, // Guardar el array completo
          orders: orders // Guardar el array completo
          // podrías añadir tableColor si quieres persistirlo
        }, { merge: true }); // merge: true crea el doc si no existe, o actualiza campos
        console.log(`Unit ${tableNumber}: Estado guardado con éxito.`);
      } catch (error) {
        console.error(`Unit ${tableNumber}: Error al guardar estado en Firestore: `, error);
      }
    };

    // Llamar a saveData DEBOUNCED sería ideal si hay muchos cambios rápidos,
    // pero por ahora lo llamamos directamente.
    saveData();

  }, [chairStates, orders, tableNumber, tableStateRef, isLoadingState]); // Ejecutar si cambia el estado local

  // Se asegura que todas las sillas sean visibles al montar el componente
  useEffect(() => {
    console.log(`Chair states for table ${tableNumber}:`, chairStates);
    
    // Verificar que las sillas están en la posición correcta usando el id en lugar del índice
    setTimeout(() => {
      // Damos un pequeño tiempo para que el DOM se actualice
      const unidadElement = document.querySelector(`[data-table-number="${tableNumber}"]`);
      if (unidadElement) {
        const chairElements = unidadElement.querySelectorAll('.chair');
        console.log(`Found ${chairElements.length} chair elements for table ${tableNumber}`);
      } else {
        console.log(`Could not find unidad element for table ${tableNumber}`);
      }
    }, 100);
  }, [tableNumber, chairStates]);

  // useEffect para actualizar el color de la mesa basado en el estado de las sillas
  useEffect(() => {
    const isAnyChairOccupied = chairStates.some(state => state === 'male' || state === 'female');
    if (isAnyChairOccupied) {
      setTableColor("var(--primary-color)"); // Color activo
    } else {
      setTableColor("#ddd"); // Color inactivo
    }
  }, [chairStates]); // Se ejecuta cada vez que cambie el estado de una silla

  const handleTableClick = () => {
    // Si la mesa está inactiva, la activamos
    if (tableColor === chairStates.empty) {
      setTableColor("var(--primary-color)")
    } else {
      // Solo permite cerrar la mesa si todas las sillas están vacías
      if (chairStates.every((state) => state === 'empty')) {
        setTableColor(stateColors.empty)
        setOrders([])
      } else {
        alert("No se puede cerrar la mesa si hay clientes sentados")
      }
    }
  }

  const handleChairClick = (index) => {
    setChairStates((prevStates) => {
      const newStates = [...prevStates];
      let nextState = 'empty';

      switch (newStates[index]) {
        case 'empty':
          nextState = 'male';
          // Ya no es necesario cambiar el color de la mesa aquí,
          // el useEffect se encargará.
          // setTableColor("var(--primary-color)"); // <-- Eliminado/Comentado
          break;
        case 'male':
          nextState = 'female';
          break;
        case 'female':
          nextState = 'empty';
          setOrders(prevOrders => prevOrders.filter(order => order.chairIndex !== index));
          break;
        default:
          nextState = 'empty';
      }
      newStates[index] = nextState;
      return newStates;
    });
  }

  // Función para añadir pedido (ahora verifica 'male' o 'female')
  const handleAddOrderToChair = (index) => {
    if (chairStates[index] === 'empty') {
      alert("No puedes añadir productos a una silla vacía.");
      return;
    }
    // Abrir modal independientemente de si es hombre o mujer
    setCurrentChairIndex(index);
    setShowOrderModal(true);
  };

  const handleAddOrder = (item) => {
    if (currentChairIndex !== null) {
      // Añadimos el pedido a la lista
      setOrders([...orders, {
        item,
        chairIndex: currentChairIndex,
        timestamp: new Date().toISOString()
      }]);
      setShowOrderModal(false);
    }
  };

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + (order.item.price || 0), 0).toFixed(2)
  }

  // Función para obtener los pedidos por silla
  const getOrdersByChair = (chairIndex) => {
    return orders.filter(order => order.chairIndex === chairIndex)
  }

  // ---- Renderizado ----
  if (isLoadingState || isLoadingMenu) {
    return <div className="unidad-loading">Cargando mesa {tableNumber}...</div>;
  }

  return (
    <div className="unidad" data-table-number={tableNumber}>
      {[0, 1, 2, 3].map((index) => {
        const state = chairStates[index];
        const color = stateColors[state];
        const positionClass = ['top', 'right', 'bottom', 'left'][index]; // Mapeo simple de índice a clase

        return (
          <div
            key={index}
            // Aplicar clase 'male' o 'female' para CSS, y 'occupied' si no está 'empty'
            className={`chair ${positionClass} ${state !== 'empty' ? 'occupied ' + state : ''}`}
            style={{ backgroundColor: color }} // El color se aplica directamente, pero las clases ayudan
            onClick={() => handleChairClick(index)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleAddOrderToChair(index);
            }}
          >
            <span className="chair-number">{index + 1}</span>
            {getOrdersByChair(index).length > 0 && (
              <span className="chair-orders">{getOrdersByChair(index).length}</span>
            )}
          </div>
        );
      })}
      
      {/* Mesa - Ahora usa el estado tableColor que se actualiza con useEffect */}
      <div
        className="table"
        style={{ backgroundColor: tableColor }} // Aplicar el color de fondo dinámico
        onClick={handleTableClick} // handleTableClick podría necesitar revisión si queremos otro comportamiento
      >
        <div className="table-number">Mesa {tableNumber}</div>
        {orders.length > 0 && (
          <div className="table-orders">
            Pedidos: {orders.length} (${getTotalAmount()})
          </div>
        )}
      </div>

      {/* Modal - Usa menuItems del Context */}
      {showOrderModal && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h3>Añadir pedido - Silla {currentChairIndex !== null ? currentChairIndex + 1 : ''}</h3>
            
            {getOrdersByChair(currentChairIndex).length > 0 && (
              <div className="current-orders">
                <h4>Pedidos actuales:</h4>
                <ul>
                  {getOrdersByChair(currentChairIndex).map((order, idx) => (
                    <li key={idx}>
                      {order.item.name} (${order.item.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="menu-items">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <button key={item.id} onClick={() => handleAddOrder(item)} disabled={!item.available}>
                    {item.name} (${item.price.toFixed(2)})
                    {!item.available && ' (No disp.)'}
                  </button>
                ))
              ) : (
                <p>No hay ítems en el menú.</p>
              )}
            </div>
            <div className="modal-actions">
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>Cerrar</button>
              <div className="help-text">
                <p>Click en silla: Cambiar estado</p>
                <p>Click derecho en silla: Añadir productos</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Unit
