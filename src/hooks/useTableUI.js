import { useState } from 'react';

export const useTableUI = (tableNumber, orders, tableColor, chairStates, clearTableData) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleTableClick = (originalHandleTableClick) => {
    if (tableColor !== "#ddd" && chairStates.every(state => state === 'empty')) {
      if (orders.length > 0) {
        setShowPaymentModal(true);
      } else {
        originalHandleTableClick();
      }
    } else {
      originalHandleTableClick();
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleConfirmPayment = async () => {
    const docId = `table-${tableNumber}`;
    await clearTableData(docId, tableNumber);
  };

  return {
    showPaymentModal,
    handleTableClick,
    handleClosePaymentModal,
    handleConfirmPayment
  };
}; 