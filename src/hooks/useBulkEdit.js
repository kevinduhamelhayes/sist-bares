import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebaseConfig";

export const useBulkEdit = (menuItems) => {
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkPriceChange, setBulkPriceChange] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const applyBulkPriceChange = async () => {
    if (bulkPriceChange === 0 || selectedItems.length === 0) {
      alert("Selecciona al menos un ítem y un valor de cambio diferente a 0");
      return;
    }
    
    const changePercent = parseFloat(bulkPriceChange) / 100;
    
    for (const itemId of selectedItems) {
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        const newPrice = item.price * (1 + changePercent);
        await updateDoc(doc(db, "menuItems", itemId), {
          price: Math.round(newPrice * 100) / 100, // Redondear a 2 decimales
        });
      }
    }
    
    resetBulkEdit();
  };

  const handleItemSelection = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const resetBulkEdit = () => {
    setBulkEditMode(false);
    setSelectedItems([]);
    setBulkPriceChange(0);
  };

  return {
    bulkEditMode,
    setBulkEditMode,
    bulkPriceChange,
    setBulkPriceChange,
    selectedItems,
    applyBulkPriceChange,
    handleItemSelection,
    resetBulkEdit
  };
}; 