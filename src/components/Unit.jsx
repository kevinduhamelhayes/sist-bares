import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTableLogic } from '../hooks/useTableLogic'; // Importar el hook
import { MenuContext } from '../context/MenuContext'; // Importar el contexto del menú
import './styles/unit.css'; // Mantener estilos

const Unit = ({ tableNumber }) => {
  const chairCount = 4; // Número fijo de sillas para mesas estándar
  const { // Usar el hook para la lógica
    isLoadingState,
    tableColor,
    chairStates,
    orders,
    stateColors,
    showOrderModal,
    currentChairIndex,
    handleTableClick,
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
  } = useTableLogic(tableNumber, chairCount);

  // Consumir el contexto del menú
  const { menuItems, isLoadingMenu } = useContext(MenuContext);

  // Lógica para mostrar mensaje de carga
  if (isLoadingState || isLoadingMenu) {
    return <div className="unidad loading">Cargando Mesa {tableNumber}...</div>;
  }

  // Renderizar la mesa y las sillas
  return (
    <div className="unidad">
      <div className="table" style={{ backgroundColor: tableColor }} onClick={handleTableClick}>
        <span className="table-number">{tableNumber}</span>
        {orders.length > 0 && (
          <div className="total-amount-display">
            Total: ${getTotalAmount()}
          </div>
        )}
      </div>
      {chairStates.map((state, index) => (
        <div
          key={index}
          className={`chair chair-${index + 1}`}
          style={{ backgroundColor: stateColors[state] }}
          onClick={() => handleChairClick(index)} // Click izquierdo para cambiar estado
          onContextMenu={(e) => { // Click derecho para añadir pedido
            e.preventDefault();
            handleAddOrderToChair(index);
          }}
        >
          {/* Opcional: mostrar un ícono o letra según el estado */}
          {/* {state === 'male' && 'M'}
          {state === 'female' && 'F'} */}
        </div>
      ))}

      {/* Modal para añadir pedidos */}
      {showOrderModal && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <h3>Añadir a Silla {currentChairIndex !== null ? currentChairIndex + 1 : ''}</h3>
            <div className="order-items-list">
              {menuItems.length > 0 ? (
                menuItems.map(item => (
                  <button
                    key={item.id}
                    className="order-item-button"
                    onClick={() => handleAddOrder(item)}
                  >
                    {item.name} (${item.price})
                  </button>
                ))
              ) : (
                <p>No hay productos en el menú.</p>
              )}
            </div>
            <button onClick={handleCloseModal} className="close-modal-button">Cerrar</button>
            {currentChairIndex !== null && (
              <div className="current-chair-orders">
                <h4>Pedidos Silla {currentChairIndex + 1}:</h4>
                <ul>
                  {getOrdersByChair(currentChairIndex).map((order, i) => (
                    <li key={`${order.timestamp}-${i}`}>{order.item?.name || 'Producto desconocido'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Unit.propTypes = {
  tableNumber: PropTypes.number.isRequired,
};

export default Unit;
