import React from 'react';
import PropTypes from 'prop-types';
import './styles/orderModal.css';

/**
 * Modal para añadir pedidos a una silla
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onAddProduct - Función para añadir un producto a la silla
 * @param {Array} props.menuItems - Lista de productos disponibles
 * @param {boolean} props.isLoading - Indica si se están cargando los productos
 * @param {Array} props.currentOrders - Pedidos actuales de la silla (opcional)
 * @param {number} props.chairIndex - Índice de la silla (opcional)
 */
const OrderModal = ({ 
  onClose, 
  onAddProduct, 
  menuItems = [], 
  isLoading = false,
  currentOrders = [],
  chairIndex = null
}) => {
  return (
    <div className="order-modal-backdrop" onClick={(e) => {
      // Cerrar modal si se hace click en el fondo
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="order-modal">
        <div className="order-modal-header">
          <h3>Añadir a Silla {chairIndex !== null ? chairIndex + 1 : ''}</h3>
          <button onClick={onClose} className="close-modal-button">&times;</button>
        </div>

        <div className="order-modal-content">
          {isLoading ? (
            <div className="loading-products">Cargando productos...</div>
          ) : menuItems.length > 0 ? (
            <div className="order-items-list">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className="order-item-button"
                  onClick={() => onAddProduct(item)}
                >
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="no-products">No hay productos en el menú.</p>
          )}

          {/* Mostrar pedidos actuales si existen */}
          {chairIndex !== null && currentOrders.length > 0 && (
            <div className="current-chair-orders">
              <h4>Pedidos de Silla {chairIndex + 1}:</h4>
              <ul>
                {currentOrders.map((order, i) => (
                  <li key={`${order.timestamp || i}`}>
                    {order.item?.name || 'Producto desconocido'}
                    <span className="order-price">${order.item?.price?.toFixed(2) || '0.00'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OrderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
  menuItems: PropTypes.array,
  isLoading: PropTypes.bool,
  currentOrders: PropTypes.array,
  chairIndex: PropTypes.number
};

export default OrderModal; 