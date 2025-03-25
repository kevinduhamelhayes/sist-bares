import { useState } from "react"
import "./styles/body.css"
import "./styles/unit.css"

const Unit = ({ tableNumber }) => {
  const [tableColor, setTableColor] = useState("#ddd")
  const [chairColors, setChairColors] = useState([
    "#aaa",
    "#aaa",
    "#aaa",
    "#aaa",
  ])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [currentChairIndex, setCurrentChairIndex] = useState(null)

  const handleTableClick = () => {
    if (tableColor === "#ddd") {
      setTableColor("#00A884")
    } else {
      // Solo permite cerrar la mesa si todas las sillas están vacías
      if (chairColors.every((color) => color === "#aaa")) {
        setTableColor("#ddd")
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
        case "#aaa":
          setTableColor("#00A884")
          newColors[index] = "cyan" // Celeste - Cliente sentado
          break
        case "cyan":
          newColors[index] = "pink" // Rosa - Pedido realizado
          setCurrentChairIndex(index)
          setShowOrderModal(true)
          break
        case "pink":
          newColors[index] = "#aaa" // Gris - Silla libre
          // Eliminar pedidos asociados a esta silla
          setOrders(orders.filter(order => order.chairIndex !== index))
          break
        default:
          newColors[index] = "#aaa"
      }
      if (newColors.every((color) => color === "#aaa")) {
        setTableColor("#ddd")
      }
      return newColors
    })
  }

  const handleAddOrder = (item) => {
    if (currentChairIndex !== null) {
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

  return (
    <div className="unidad">
      {chairColors.map((color, index) => (
        <div
          key={index}
          className="chair"
          style={{ backgroundColor: color }}
          onClick={() => handleChairClick(index)}
        >
          {index + 1}
        </div>
      ))}
      <div
        className="table"
        style={{ backgroundColor: tableColor }}
        onClick={handleTableClick}
      >
        <div>
          <div className="table-number">Mesa {tableNumber}</div>
          {orders.length > 0 && (
            <div className="table-orders">
              Pedidos: {orders.length} (${getTotalAmount()})
            </div>
          )}
        </div>
      </div>

      {showOrderModal && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h3>Añadir pedido - Silla {currentChairIndex + 1}</h3>
            <div className="menu-items">
              <button onClick={() => handleAddOrder({ name: "Café", price: 2.50 })}>Café ($2.50)</button>
              <button onClick={() => handleAddOrder({ name: "Té", price: 2.00 })}>Té ($2.00)</button>
              <button onClick={() => handleAddOrder({ name: "Cerveza", price: 5.00 })}>Cerveza ($5.00)</button>
              <button onClick={() => handleAddOrder({ name: "Vino", price: 7.50 })}>Vino ($7.50)</button>
              <button onClick={() => handleAddOrder({ name: "Agua", price: 1.00 })}>Agua ($1.00)</button>
            </div>
            <button className="close-btn" onClick={() => setShowOrderModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Unit
