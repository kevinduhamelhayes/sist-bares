import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTableLogic } from '../hooks/useTableLogic'; // Importar el hook
import { MenuContext } from '../context/MenuContext'; // Importar el contexto del menú
import { TableContext } from '../context/TableContext'; // Para el botón de eliminar
import './styles/unit.css'; // Reutilizar estilos si es posible

const SpecialUnit = ({ table }) => {
  const { number: tableNumber, chairCount } = table;
  const { // Usar el hook para la lógica
    isLoadingState,
    tableColor,
    chairStates,
    orders,
    stateColors,
    showOrderModal,
    currentChairIndex,
    handleTableClick, // Podríamos no usarlo para mesas especiales
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
  } = useTableLogic(tableNumber, chairCount);

  // Consumir contextos
  const { menuItems, isLoadingMenu } = useContext(MenuContext);
  const { removeTable } = useContext(TableContext);

  const handleRemoveClick = () => {
    // Añadir confirmación antes de borrar
    if (window.confirm(`¿Seguro que quieres eliminar la mesa especial ${tableNumber}?`)) {
      // Verificar si hay sillas ocupadas
      if (chairStates.some(state => state !== 'empty')) {
        alert("No se puede eliminar la mesa si tiene sillas ocupadas.");
        return;
      }
      removeTable(tableNumber);
    }
  };

  // Mensaje de carga
  if (isLoadingState || isLoadingMenu) {
    return <div className="unidad special loading">Cargando Mesa Especial {tableNumber}...</div>;
  }

  // Renderizado
  return (
    <div className="unidad special">
      {/* Botón para eliminar mesa especial */} 
      <button 
        onClick={handleRemoveClick} 
        className="remove-special-table-button"
        disabled={chairStates.some(state => state !== 'empty')} // Deshabilitar si hay sillas ocupadas
        title={chairStates.some(state => state !== 'empty') ? "Vacía las sillas para eliminar" : "Eliminar mesa"}
      >
        X
      </button>
      
      <div className="table special-table" style={{ backgroundColor: tableColor }} onClick={handleTableClick}>
        <span className="table-number">{tableNumber}</span>
      </div>
      {/* Renderizar sillas dinámicamente */} 
      {Array.from({ length: chairCount }).map((_, index) => (
        <div
          key={index}
          className={`chair chair-${index + 1}`}
          style={{
            backgroundColor: stateColors[chairStates[index]],
            // Calcular posición dinámicamente (simplificado)
            // Esto es básico, se puede mejorar con transform-origin y rotate
            transform: `rotate(${(360 / chairCount) * index}deg) translateY(-60px)`,
          }}
          onClick={() => handleChairClick(index)}
          onContextMenu={(e) => {
            e.preventDefault();
            handleAddOrderToChair(index);
          }}
        >
           {/* {state === 'male' && 'M'}
          {state === 'female' && 'F'} */} 
        </div>
      ))}

      {/* Modal (igual que en Unit.jsx) */}
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

      {/* Total (igual que en Unit.jsx) */} 
      {orders.length > 0 && (
        <div className="total-amount-display">
          Total: ${getTotalAmount()}
        </div>
      )}
    </div>
  );
};

SpecialUnit.propTypes = {
  table: PropTypes.shape({
    number: PropTypes.number.isRequired,
    chairCount: PropTypes.number.isRequired,
    isSpecial: PropTypes.bool, // Podría ser útil
  }).isRequired,
};

export default SpecialUnit; 