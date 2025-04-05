import React, { useState } from 'react';

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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto animate-modal">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-blue-700 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Confirmar Pago - Mesa #{tableNumber}</h2>
          <button 
            className="text-2xl leading-none opacity-80 hover:opacity-100 transition-opacity"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="p-5">
          {orders.length > 0 ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Resumen de Pedidos</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="py-2.5 px-3 text-left bg-gray-50 text-gray-600 font-medium">Producto</th>
                      <th className="py-2.5 px-3 text-left bg-gray-50 text-gray-600 font-medium">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2.5 px-3">{order.item?.name || 'Producto sin nombre'}</td>
                        <td className="py-2.5 px-3">{formatPrice(order.item?.price || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium text-gray-800">Total a Pagar</h3>
                <div className="text-2xl font-bold text-blue-700">{formatPrice(totalAmount)}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium
                    hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onClose} 
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button 
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-md font-medium
                    hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-5 text-gray-600">
              <p>No hay pedidos en esta mesa.</p>
              <button 
                className="mt-4 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium
                  hover:bg-gray-200 transition-colors mx-auto"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 