import React, { useState } from 'react';
import './styles/paymentModal.css';

/**
 * Modal de confirmación de pago para cerrar una mesa
 * @param {Object} props 
 * @param {boolean} props.show Si debe mostrar el modal
 * @param {Function} props.onClose Función para cerrar el modal
 * @param {number} props.tableNumber Número de mesa
 * @param {string} props.tableId ID del documento de la mesa en Firestore
 * @param {Array} props.orders Pedidos de la mesa
 * @param {number} props.totalAmount Total a pagar
 * @param {Function} props.onConfirm Función para confirmar el pago y limpiar la mesa
 */
const PaymentModal = ({ 
  show, 
  onClose, 
  tableNumber,
  tableId, 
  orders = [],
  totalAmount,
  onConfirm
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(tableId, tableNumber);
      onClose();
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Error al procesar el pago. Por favor, inténtelo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Formatear precio
  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  return (
    <div className="payment-modal-backdrop" onClick={handleBackdropClick}>
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Confirmar Pago - Mesa #{tableNumber}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="payment-modal-body">
          {orders.length > 0 ? (
            <>
              <div className="order-summary">
                <h3>Resumen de Pedidos</h3>
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.item?.name || 'Producto sin nombre'}</td>
                        <td>{formatPrice(order.item?.price || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="total-section">
                <h3>Total a Pagar</h3>
                <div className="total-amount">{formatPrice(totalAmount)}</div>
              </div>
              
              <div className="payment-actions">
                <button 
                  className="cancel-btn" 
                  onClick={onClose} 
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={handleConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-orders">
              <p>No hay pedidos en esta mesa.</p>
              <button className="close-btn-center" onClick={onClose}>Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 