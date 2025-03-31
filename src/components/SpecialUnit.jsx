import { useState, useEffect } from "react"
import "./styles/body.css"
import "./styles/unit.css"
import "./styles/specialUnit.css"
// Importar Firebase y Firestore
import { db } from "./firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

const SpecialUnit = ({ tableNumber, chairCount = 8 }) => {
  const [tableColor, setTableColor] = useState("#ddd")
  const [chairStates, setChairStates] = useState(Array(chairCount).fill('empty'))
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [currentChairIndex, setCurrentChairIndex] = useState(null)

  // Estado para los ítems del menú leídos de Firebase
  const [menuItems, setMenuItems] = useState([]);

  // useEffect para leer el menú de Firebase
  useEffect(() => {
    console.log(`SpecialUnit ${tableNumber}: Suscribiéndose al menú de Firebase...`);
    const q = query(collection(db, "menuItems"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setMenuItems(itemsArr);
      console.log(`SpecialUnit ${tableNumber}: Menú actualizado de Firebase (${itemsArr.length} items)`);
    }, (error) => {
      console.error(`SpecialUnit ${tableNumber}: Error al leer menú de Firebase: `, error);
    });

    // Limpiar suscripción al desmontar
    return () => {
      console.log(`SpecialUnit ${tableNumber}: Desuscribiéndose del menú de Firebase.`);
      unsubscribe();
    };
  }, [tableNumber]);

  // useEffect para actualizar el color de la mesa basado en el estado de las sillas
  useEffect(() => {
    const isAnyChairOccupied = chairStates.some(state => state === 'male' || state === 'female');
    if (isAnyChairOccupied) {
      setTableColor("var(--primary-color)"); // Color activo
    } else {
      setTableColor("#ddd"); // Color inactivo
    }
  }, [chairStates]);

  // Mapeo de estados a colores (usando variables CSS)
  const stateColors = {
    empty: 'var(--chair-bg-empty)',
    male: 'var(--chair-bg-male)',
    female: 'var(--chair-bg-female)',
  };

  const handleTableClick = () => {
    // Si la mesa está inactiva, la activamos
    if (tableColor === stateColors.empty) {
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

  // Calculamos el ángulo para cada silla alrededor de la mesa especial
  const getChairPosition = (index) => {
    const angleDegrees = (360 / chairCount) * index - 90;
    const angleRadians = (angleDegrees * Math.PI) / 180;
    
    // Radio reducido para acercar las sillas
    const radiusPercent = 40; // Reducido desde 45%
    
    const xPos = 50 + radiusPercent * Math.cos(angleRadians);
    const yPos = 50 + radiusPercent * Math.sin(angleRadians);
    
    return {
      left: `${xPos}%`,
      top: `${yPos}%`,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className="unidad special-unit" data-table-number={tableNumber}>
      {/* Etiqueta de mesa especial */}
      <div className="special-label">Especial</div>
      
      {/* Mesa (va primero en el DOM para z-index más bajo) */}
      <div
        className="table special-table"
        style={{ backgroundColor: tableColor }}
        onClick={handleTableClick}
      >
        <div>
          <div className="table-number">Mesa {tableNumber}</div>
          <div className="table-capacity">{chairCount} personas</div>
          {orders.length > 0 && (
            <div className="table-orders">
              Pedidos: {orders.length} (${getTotalAmount()})
            </div>
          )}
        </div>
      </div>
      
      {/* Sillas dinámicas alrededor de la mesa */}
      {chairStates.map((state, index) => {
        const positionStyle = getChairPosition(index);
        const color = stateColors[state];
        
        return (
          <div
            key={index}
            className={`chair special-chair ${state !== 'empty' ? 'occupied ' + state : ''}`}
            style={{ 
              backgroundColor: color,
              ...positionStyle,
            }}
            onClick={() => handleChairClick(index)}
            onContextMenu={(e) => {
              e.preventDefault()
              handleAddOrderToChair(index)
            }}
          >
            <span className="chair-number">{index + 1}</span>
            {getOrdersByChair(index).length > 0 && (
              <span className="chair-orders">{getOrdersByChair(index).length}</span>
            )}
          </div>
        );
      })}

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

export default SpecialUnit 