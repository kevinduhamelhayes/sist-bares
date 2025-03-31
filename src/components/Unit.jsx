import { useState, useEffect } from "react"
import "./styles/body.css"
import "./styles/unit.css"
// Importar Firebase y Firestore
import { db } from "./firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

const Unit = ({ tableNumber }) => {
  // Log para debugging
  useEffect(() => {
    console.log(`Rendering Unit for table ${tableNumber}`);
  }, [tableNumber]);

  const [tableColor, setTableColor] = useState("#ddd")
  const [chairStates, setChairStates] = useState(Array(4).fill('empty'));
  
  // Mapeo de estados a colores (usando variables CSS)
  const stateColors = {
    empty: 'var(--chair-bg-empty)',
    male: 'var(--chair-bg-male)',
    female: 'var(--chair-bg-female)',
  };

  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [currentChairIndex, setCurrentChairIndex] = useState(null)

  // Estado para los ítems del menú leídos de Firebase
  const [menuItems, setMenuItems] = useState([]);

  // useEffect para leer el menú de Firebase
  useEffect(() => {
    console.log(`Unit ${tableNumber}: Suscribiéndose al menú de Firebase...`);
    const q = query(collection(db, "menuItems"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setMenuItems(itemsArr);
      console.log(`Unit ${tableNumber}: Menú actualizado de Firebase (${itemsArr.length} items)`);
    }, (error) => {
      console.error(`Unit ${tableNumber}: Error al leer menú de Firebase: `, error);
    });

    // Limpiar suscripción al desmontar
    return () => {
      console.log(`Unit ${tableNumber}: Desuscribiéndose del menú de Firebase.`);
      unsubscribe();
    };
  }, [tableNumber]); // Dependencia de tableNumber por los logs, aunque la query es la misma

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
          setOrders(orders.filter(order => order.chairIndex !== index));
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

      {/* Modal - Ahora usa menuItems del estado local (Firebase) */}
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
                <p>Cargando menú...</p>
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
