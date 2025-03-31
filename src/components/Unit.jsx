import { useState, useEffect } from "react"
import "./styles/body.css"
import "./styles/unit.css"

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
          nextState = 'male'; // Vacío -> Hombre (Azul)
          // Activar mesa si no lo está ya
          // setTableColor("var(--primary-color)"); // Decidir si esto es necesario
          break;
        case 'male':
          nextState = 'female'; // Hombre (Azul) -> Mujer (Rosa)
          break;
        case 'female':
          nextState = 'empty'; // Mujer (Rosa) -> Vacío (Gris)
          // Eliminar pedidos asociados a esta silla si vuelve a estar vacía
          setOrders(orders.filter(order => order.chairIndex !== index));
          break;
        default:
          nextState = 'empty';
      }
      newStates[index] = nextState;

      // Lógica para desactivar mesa si todas las sillas están vacías
      // if (newStates.every((state) => state === 'empty')) {
      //   setTableColor(stateColors.empty); // O color base de mesa
      // }

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
      
      {/* Mesa */}
      <div
        className="table"
        // style={{ backgroundColor: tableColor }} // El color de la mesa podría manejarse diferente ahora
        onClick={handleTableClick}
      >
        <div className="table-number">Mesa {tableNumber}</div>
        {orders.length > 0 && (
          <div className="table-orders">
            Pedidos: {orders.length} (${getTotalAmount()})
          </div>
        )}
      </div>

      {/* Modal para añadir pedidos */}
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

export default Unit
