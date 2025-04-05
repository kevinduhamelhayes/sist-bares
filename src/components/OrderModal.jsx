import React from 'react';
import PropTypes from 'prop-types';

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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => {
        // Cerrar modal si se hace click en el fondo
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[450px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-700 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-lg font-medium">
            Añadir a Silla {chairIndex !== null ? chairIndex + 1 : ''}
          </h3>
          <button 
            onClick={onClose}
            className="text-2xl leading-none hover:text-gray-200 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-5 text-gray-600">
              Cargando productos...
            </div>
          ) : menuItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-auto-fill-150 gap-2 mb-4">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onAddProduct(item)}
                  className="flex flex-col p-3 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium mb-1">{item.name}</span>
                  <span className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-5 text-gray-600">
              No hay productos en el menú.
            </p>
          )}

          {/* Mostrar pedidos actuales si existen */}
          {chairIndex !== null && currentOrders.length > 0 && (
            <div className="mt-5 border-t border-gray-200 pt-4">
              <h4 className="text-base font-medium text-gray-800 mb-3">
                Pedidos de Silla {chairIndex + 1}:
              </h4>
              <ul className="space-y-2">
                {currentOrders.map((order, i) => (
                  <li 
                    key={`${order.timestamp || i}`}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <span>{order.item?.name || 'Producto desconocido'}</span>
                    <span className="text-gray-600 ml-2">
                      ${order.item?.price?.toFixed(2) || '0.00'}
                    </span>
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