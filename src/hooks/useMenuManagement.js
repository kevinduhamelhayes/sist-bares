import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, updateDoc } from "firebase/firestore";
import { db } from "../components/firebaseConfig";

export const useMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bebidas");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "menuItems"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setMenuItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);

  const addMenuItem = async (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Por favor, introduce el nombre del ítem del menú");
      return;
    }
    if (price === "" || isNaN(parseFloat(price))) {
      alert("Por favor, introduce un precio válido");
      return;
    }
    
    await addDoc(collection(db, "menuItems"), {
      name,
      price: parseFloat(price),
      description,
      category,
      available: true,
    });
    
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("bebidas");
  };

  const removeMenuItem = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ítem?")) {
      await deleteDoc(doc(db, "menuItems", id));
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    await updateDoc(doc(db, "menuItems", id), {
      available: !currentStatus,
    });
  };

  const filteredItems = menuItems.filter(item => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return {
    menuItems,
    filteredItems,
    name,
    setName,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    filter,
    setFilter,
    addMenuItem,
    removeMenuItem,
    toggleAvailability
  };
}; 