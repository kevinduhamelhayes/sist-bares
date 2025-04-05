import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTableLogic } from '../hooks/useTableLogic'; // Importar el hook
import { MenuContext } from '../context/MenuContext'; // Importar el contexto del menú
import './styles/unit.css'; // Mantener estilos
import Chair from './Chair';
import OrderModal from './OrderModal';
import PaymentModal from './PaymentModal'; // Importar el nuevo componente

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
    handleTableClick: originalHandleTableClick, // Renombrar para extender funcionalidad
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
    clearTableData // Usar la nueva función
  } = useTableLogic(tableNumber, chairCount);

  // Consumir el contexto del menú
  const { menuItems, isLoadingMenu } = useContext(MenuContext);
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

  // Cerrar el modal de pago
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Función para confirmar el pago
  const handleConfirmPayment = async (tableId, tableNumber) => {
    const docId = `table-${tableNumber}`;
    await clearTableData(docId, tableNumber);
  };

  // Lógica para mostrar mensaje de carga
  if (isLoadingState || isLoadingMenu) {
    return <div className="unidad loading">Cargando Mesa {tableNumber}...</div>;
  }

  // Renderizar la mesa y las sillas
  return (
    <div className="unit-container">
      <div className="unit-inner">
        {/* Mesa */}
        <div
          className="table"
          style={{ backgroundColor: tableColor }}
          onClick={handleTableClick}
        >
          <span className="table-number">{tableNumber}</span>
          {/* Mostrar total si hay órdenes */}
          {orders.length > 0 && (
            <div className="table-amount">${getTotalAmount()}</div>
          )}
        </div>
        
        {/* Sillas */}
        <Chair
          position="top"
          state={chairStates[0]}
          color={stateColors[chairStates[0]]}
          onClick={() => handleChairClick(0)}
          onAddOrder={() => handleAddOrderToChair(0)}
          orders={getOrdersByChair(0)}
        />
        <Chair
          position="right"
          state={chairStates[1]}
          color={stateColors[chairStates[1]]}
          onClick={() => handleChairClick(1)}
          onAddOrder={() => handleAddOrderToChair(1)}
          orders={getOrdersByChair(1)}
        />
        <Chair
          position="bottom"
          state={chairStates[2]}
          color={stateColors[chairStates[2]]}
          onClick={() => handleChairClick(2)}
          onAddOrder={() => handleAddOrderToChair(2)}
          orders={getOrdersByChair(2)}
        />
        <Chair
          position="left"
          state={chairStates[3]}
          color={stateColors[chairStates[3]]}
          onClick={() => handleChairClick(3)}
          onAddOrder={() => handleAddOrderToChair(3)}
          orders={getOrdersByChair(3)}
        />
      </div>

      {/* Modal de Orden (existente) */}
      {showOrderModal && (
        <OrderModal
          onClose={handleCloseModal}
          onAddProduct={handleAddOrder}
          menuItems={menuItems}
          isLoading={isLoadingMenu}
        />
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

Unit.propTypes = {
  tableNumber: PropTypes.number.isRequired,
};

export default Unit;
