import { useState } from "react"
import "./styles/body.css"
import "./styles/unit.css"
import "./styles/specialUnit.css"

const SpecialUnit = ({ tableNumber, chairCount = 8 }) => {
  const [tableColor, setTableColor] = useState("#ddd")
  const [chairStates, setChairStates] = useState(Array(chairCount).fill('empty'))
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [currentChairIndex, setCurrentChairIndex] = useState(null)

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
        style={{ 
          backgroundColor: tableColor,
          // Ajustar tamaño dinámicamente o dejarlo al CSS
          // width: chairCount <= 8 ? '180px' : '220px',
          // height: chairCount <= 8 ? '120px' : '150px'
        }}
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
            <h3>Añadir pedido - Silla {currentChairIndex + 1}</h3>
            
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
              <button onClick={() => handleAddOrder({ name: "Café", price: 2.50 })}>Café ($2.50)</button>
              <button onClick={() => handleAddOrder({ name: "Té", price: 2.00 })}>Té ($2.00)</button>
              <button onClick={() => handleAddOrder({ name: "Cerveza", price: 5.00 })}>Cerveza ($5.00)</button>
              <button onClick={() => handleAddOrder({ name: "Vino", price: 7.50 })}>Vino ($7.50)</button>
              <button onClick={() => handleAddOrder({ name: "Agua", price: 1.00 })}>Agua ($1.00)</button>
              <button onClick={() => handleAddOrder({ name: "Refresco", price: 2.50 })}>Refresco ($2.50)</button>
              <button onClick={() => handleAddOrder({ name: "Hamburguesa", price: 9.00 })}>Hamburguesa ($9.00)</button>
              <button onClick={() => handleAddOrder({ name: "Pizza", price: 12.00 })}>Pizza ($12.00)</button>
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