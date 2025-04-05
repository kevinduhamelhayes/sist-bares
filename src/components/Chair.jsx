import React from 'react';
import PropTypes from 'prop-types';

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

  // Clases de posición para cada lado
  const positionClasses = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div 
      className={`
        w-[30px] h-[30px] rounded-full absolute flex items-center justify-center 
        cursor-pointer transition-all duration-300 z-[2]
        hover:brightness-90 hover:scale-110
        ${positionClasses[position]}
      `}
      style={{ backgroundColor: color }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {/* Indicador de pedidos */}
      {hasOrders && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold">
          {orders.length}
        </div>
      )}
      
      {/* Opcional: mostrar ícono según el estado */}
      {state === 'male' && (
        <span className="text-white font-bold text-xs drop-shadow-sm">M</span>
      )}
      {state === 'female' && (
        <span className="text-white font-bold text-xs drop-shadow-sm">F</span>
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