import { useState } from "react"
import "./styles/body.css"
import "./styles/unit.css"
import "./styles/specialUnit.css"

const SpecialUnit = ({ tableNumber, chairCount = 8 }) => {
  const [tableColor, setTableColor] = useState("#ddd")
  const [chairColors, setChairColors] = useState(Array(chairCount).fill("#aaa"))
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [currentChairIndex, setCurrentChairIndex] = useState(null)

  // Colores para los estados de las sillas
  const chairStates = {
    empty: "#aaa",     // gris (vacía)
    occupied: "cyan",  // celeste (cliente sentado)
    ordered: "pink"    // rosa (pedido realizado)
  }

  const handleTableClick = () => {
    // Si la mesa está inactiva, la activamos
    if (tableColor === chairStates.empty) {
      setTableColor("var(--primary-color)")
    } else {
      // Solo permite cerrar la mesa si todas las sillas están vacías
      if (chairColors.every((color) => color === chairStates.empty)) {
        setTableColor(chairStates.empty)
        setOrders([])
      } else {
        alert("No se puede cerrar la mesa si hay clientes sentados")
      }
    }
  }

  const handleChairClick = (index) => {
    setChairColors((prevColors) => {
      const newColors = [...prevColors]
      
      switch (newColors[index]) {
        case chairStates.empty: // Si está vacía
          // Cambiar a celeste (ocupada)
          newColors[index] = chairStates.occupied
          setTableColor("var(--primary-color)")
          break
          
        case chairStates.occupied: // Si está ocupada (celeste)
          // Cambiar a rosa (con pedido)
          newColors[index] = chairStates.ordered
          setCurrentChairIndex(index)
          setShowOrderModal(true)
          break
          
        case chairStates.ordered: // Si ya tiene pedido (rosa)
          // Volver a vacía (gris)
          newColors[index] = chairStates.empty
          // Eliminar pedidos asociados a esta silla
          setOrders(orders.filter(order => order.chairIndex !== index))
          break
          
        default:
          newColors[index] = chairStates.empty
      }
      
      // Si todas las sillas están vacías, volver la mesa a inactiva
      if (newColors.every((color) => color === chairStates.empty)) {
        setTableColor(chairStates.empty)
      }
      
      return newColors
    })
  }

  // Función para añadir pedido desde cualquier silla ocupada
  const handleAddOrderToChair = (index) => {
    // Solo permitimos agregar pedidos a sillas ocupadas (celeste o rosa)
    if (chairColors[index] === chairStates.empty) {
      alert("No puedes añadir productos a una silla vacía")
      return
    }
    
    setCurrentChairIndex(index)
    setShowOrderModal(true)
  }

  const handleAddOrder = (item) => {
    if (currentChairIndex !== null) {
      // Si la silla no está marcada como pedido (rosa), la marcamos
      if (chairColors[currentChairIndex] === chairStates.occupied) {
        setChairColors(prevColors => {
          const newColors = [...prevColors]
          newColors[currentChairIndex] = chairStates.ordered
          return newColors
        })
      }
      
      // Añadimos el pedido a la lista
      setOrders([...orders, {
        item,
        chairIndex: currentChairIndex,
        timestamp: new Date().toISOString()
      }])
      
      setShowOrderModal(false)
    }
  }

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + (order.item.price || 0), 0).toFixed(2)
  }

  // Función para obtener los pedidos por silla
  const getOrdersByChair = (chairIndex) => {
    return orders.filter(order => order.chairIndex === chairIndex)
  }

  // Calculamos el ángulo para cada silla alrededor de la mesa especial
  const getChairPosition = (index) => {
    const angleDegrees = (360 / chairCount) * index - 90; // Empezar desde arriba (-90 grados)
    const angleRadians = (angleDegrees * Math.PI) / 180;
    
    // Radio para posicionar las sillas (ajustar según tamaño de mesa/silla)
    // Usaremos % relativo al contenedor .special-unit
    const radiusPercent = 45; // 45% del radio del contenedor .special-unit
    
    // Cálculo de la posición relativa al centro (50%, 50%)
    // Usamos translate para centrar la silla en la posición calculada
    const xPos = 50 + radiusPercent * Math.cos(angleRadians);
    const yPos = 50 + radiusPercent * Math.sin(angleRadians);
    
    // Devolvemos estilo para left, top y transform para centrar la silla
    return {
      left: `${xPos}%`,
      top: `${yPos}%`,
      transform: 'translate(-50%, -50%)', // Centra la silla
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
      {chairColors.map((color, index) => {
        const positionStyle = getChairPosition(index);
        
        return (
          <div
            key={index}
            className={`chair special-chair ${color !== chairStates.empty ? 'occupied' : ''}`}
            style={{ 
              backgroundColor: color,
              ...positionStyle, // Aplicar left, top y transform
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