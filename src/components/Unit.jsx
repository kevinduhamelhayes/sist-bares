import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTableLogic } from '../hooks/useTableLogic';
import { useTableUI } from '../hooks/useTableUI';
import { MenuContext } from '../context/MenuContext';
import Chair from './Chair';
import OrderModal from './OrderModal';
import PaymentModal from './PaymentModal';

const Unit = ({ tableNumber }) => {
  const chairCount = 4;
  const {
    isLoadingState,
    tableColor,
    chairStates,
    orders,
    stateColors,
    showOrderModal,
    currentChairIndex,
    handleTableClick: originalHandleTableClick,
    handleChairClick,
    handleAddOrderToChair,
    handleAddOrder,
    handleCloseModal,
    getTotalAmount,
    getOrdersByChair,
    clearTableData
  } = useTableLogic(tableNumber, chairCount);

  const { menuItems, isLoadingMenu } = useContext(MenuContext);
  
  const {
    showPaymentModal,
    handleTableClick: handleTableUIClick,
    handleClosePaymentModal,
    handleConfirmPayment
  } = useTableUI(tableNumber, orders, tableColor, chairStates, clearTableData);

  const handleTableClick = () => handleTableUIClick(originalHandleTableClick);

  if (isLoadingState || isLoadingMenu) {
    return (
      <div className="relative w-[250px] h-[250px] m-5 flex justify-center items-center text-gray-500 animate-pulse">
        Cargando Mesa {tableNumber}...
      </div>
    );
  }

  return (
    <div className="relative w-[250px] h-[250px] m-5 flex justify-center items-center transition-transform duration-300 hover:-translate-y-1">
      <div className="relative">
        <div
          className="relative w-[150px] h-[100px] rounded-lg flex flex-col justify-center items-center text-center 
            shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg z-10
            dark:bg-gray-700 dark:text-gray-200"
          style={{ backgroundColor: tableColor }}
          onClick={handleTableClick}
        >
          <span className="font-bold text-lg mb-2">{tableNumber}</span>
          {orders.length > 0 && (
            <div className="text-sm bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full mt-1">
              ${getTotalAmount()}
            </div>
          )}
        </div>
        
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

      {showOrderModal && (
        <OrderModal
          onClose={handleCloseModal}
          onAddProduct={handleAddOrder}
          menuItems={menuItems}
          isLoading={isLoadingMenu}
          chairIndex={currentChairIndex}
          currentOrders={currentChairIndex !== null ? getOrdersByChair(currentChairIndex) : []}
        />
      )}

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
