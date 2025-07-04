import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTableLogic } from '../hooks/useTableLogic'; // Importar el hook
import { MenuContext } from '../context/MenuContext'; // Importar el contexto del menú
import { TableContext } from '../context/TableContext'; // Para el botón de eliminar
import PaymentModal from './PaymentModal'; // Importar el nuevo componente

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
    handleTableClick: originalHandleTableClick, // Renombrar para extender funcionalidad
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
    clearTableData // Usar la nueva función
  } = useTableLogic(tableNumber, chairCount);

  // Consumir contextos
  const { menuItems, isLoadingMenu } = useContext(MenuContext);
  const { removeTable } = useContext(TableContext);

  const [showPaymentModal, setShowPaymentModal] = useState(false); // Estado para el modal de pago

  // Extender handleTableClick para mostrar modal de pago cuando sea necesario
  const handleTableClick = () => {
    // Si la mesa está activa (tiene color diferente al default) y todas las sillas están vacías
    if (tableColor !== "#ddd" && chairStates.every(state => state === 'empty')) {
      // Si hay órdenes, mostrar modal de pago
      if (orders.length > 0) {
        setShowPaymentModal(true);
      } else {
        // Si no hay órdenes, proceder con comportamiento original
        originalHandleTableClick();
      }
    } else {
      // En otros casos, comportamiento original
      originalHandleTableClick();
    }
  };

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

  // Cerrar el modal de pago
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Función para confirmar el pago
  const handleConfirmPayment = async (tableId, tableNumber) => {
    const docId = `table-${tableNumber}`;
    await clearTableData(docId, tableNumber);
  };

  // Mensaje de carga
  if (isLoadingState || isLoadingMenu) {
    return (
      <div className="relative min-w-[300px] min-h-[300px] p-10 m-5 flex justify-center items-center animate-pulse">
        Cargando Mesa Especial {tableNumber}...
      </div>
    );
  }

  // Renderizado
  return (
    <div className="relative min-w-[300px] min-h-[300px] p-10 m-5 flex justify-center items-center">
      {/* Botón para eliminar mesa especial */} 
      <button 
        onClick={handleRemoveClick} 
        className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors duration-200 ${
          chairStates.some(state => state !== 'empty') ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={chairStates.some(state => state !== 'empty')} // Deshabilitar si hay sillas ocupadas
        title={chairStates.some(state => state !== 'empty') ? "Vacía las sillas para eliminar" : "Eliminar mesa"}
      >
        ×
      </button>
      
      <div 
        className="relative rounded-xl flex flex-col justify-center items-center text-center shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5 p-4 z-10 cursor-pointer dark:shadow-gray-800"
        style={{ backgroundColor: tableColor }}
        onClick={handleTableClick}
      >
        <span className="font-bold text-lg mb-1">{tableNumber}</span>
         {/* Mover el total dentro de la mesa */} 
         {orders.length > 0 && (
          <div className="text-sm bg-black/10 px-3 py-1 rounded-lg mt-1 dark:bg-white/10">
            Total: ${getTotalAmount()}
          </div>
        )}
      </div>
      {/* Renderizar sillas dinámicamente */} 
      {Array.from({ length: chairCount }).map((_, index) => (
        <div
          key={index}
          className="absolute w-10 h-10 rounded-full flex justify-center items-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg z-20 dark:shadow-gray-800"
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
        />
      ))}

      {/* Modal (igual que en Unit.jsx) */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Añadir a Silla {currentChairIndex !== null ? currentChairIndex + 1 : ''}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {menuItems.length > 0 ? (
                menuItems.map(item => (
                  <button
                    key={item.id}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => handleAddOrder(item)}
                  >
                    {item.name} (${item.price})
                  </button>
                ))
              ) : (
                <p className="col-span-2 text-center dark:text-gray-300">No hay productos en el menú.</p>
              )}
            </div>
            <button 
              onClick={handleCloseModal}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cerrar
            </button>
            {currentChairIndex !== null && (
              <div className="mt-4 border-t pt-4 dark:border-gray-700">
                <h4 className="font-semibold mb-2 dark:text-white">Pedidos Silla {currentChairIndex + 1}:</h4>
                <ul className="space-y-1">
                  {getOrdersByChair(currentChairIndex).map((order, i) => (
                    <li key={`${order.timestamp}-${i}`} className="text-sm dark:text-gray-300">
                      {order.item?.name || 'Producto desconocido'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nuevo Modal de Pago */}
      <PaymentModal
        show={showPaymentModal}
        onClose={handleClosePaymentModal}
        tableNumber={tableNumber}
        tableId={`table-${tableNumber}`}
        orders={orders}
        totalAmount={parseFloat(getTotalAmount())}
        onConfirm={handleConfirmPayment}
      />
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