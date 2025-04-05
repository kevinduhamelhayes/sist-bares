import React from 'react';
import PropTypes from 'prop-types';
import './styles/chair.css';

/**
 * Componente Chair para representar las sillas alrededor de una mesa
 * 
 * @param {Object} props
 * @param {string} props.position - Posición de la silla (top, right, bottom, left)
 * @param {string} props.state - Estado de la silla (empty, male, female)
 * @param {string} props.color - Color de la silla basado en el estado
 * @param {Function} props.onClick - Manejador para click izquierdo (cambiar estado)
 * @param {Function} props.onAddOrder - Manejador para click derecho (añadir pedido)
 * @param {Array} props.orders - Lista de pedidos para esta silla
 */
const Chair = ({ position, state, color, onClick, onAddOrder, orders = [] }) => {
  // Determinar si la silla tiene pedidos
  const hasOrders = orders && orders.length > 0;
  
  // Manejar click derecho para añadir pedido
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevenir el menú contextual del navegador
    if (state !== 'empty') { // Solo permitir añadir pedidos si la silla está ocupada
      onAddOrder();
    }
  };

  return (
    <div 
      className={`chair chair-${position}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {/* Indicador de pedidos */}
      {hasOrders && (
        <div className="chair-orders-badge">
          {orders.length}
        </div>
      )}
      
      {/* Opcional: mostrar ícono según el estado */}
      {state === 'male' && (
        <span className="chair-icon">M</span>
      )}
      {state === 'female' && (
        <span className="chair-icon">F</span>
      )}
    </div>
  );
};

Chair.propTypes = {
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
  state: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onAddOrder: PropTypes.func.isRequired,
  orders: PropTypes.array
};

export default Chair; 