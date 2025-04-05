import { FaRegTrashAlt, FaPen, FaCheck, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import { useState } from "react";
import { db } from "./firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const MenuItem = ({ 
  item, 
  removeMenuItem, 
  toggleAvailability, 
  bulkEditMode = false, 
  isSelected = false, 
  onSelect = () => {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price || 0,
    description: item.description || "",
    category: item.category || "bebidas"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const editItem = async () => {
    await updateDoc(doc(db, "menuItems", item.id), {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category
    });
  };

  const handleConfirmation = () => {
    editItem();
    setIsEditing(false);
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <li 
      className={`flex bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 
        ${!item.available ? 'opacity-70 border-l-4 border-red-500' : ''} 
        ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
      onClick={() => bulkEditMode && onSelect(item.id)}
    >
      {bulkEditMode && (
        <div className="flex items-center justify-center px-4 bg-gray-50">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onSelect(item.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      )}
      
      <div className="flex-1 p-4">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio:</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bebidas">Bebidas</option>
                <option value="comidas">Comidas</option>
                <option value="postres">Postres</option>
                <option value="entrantes">Entrantes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
              <div className="text-lg font-bold text-emerald-600">{formatPrice(item.price)}</div>
            </div>
            
            {item.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            )}
            
            <div className="flex justify-between text-sm mt-2">
              <span className="bg-gray-100 px-2 py-1 rounded-full capitalize text-gray-600">
                {item.category}
              </span>
              <span className="text-gray-600">
                {item.available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {!bulkEditMode && (
        <div className="flex flex-col justify-center gap-2 p-2 bg-gray-50 md:flex-row">
          {isEditing ? (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }} 
                className="p-2 text-red-500 hover:bg-gray-200 rounded transition-colors"
              >
                <AiFillCloseSquare size="1.2em" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmation();
                }} 
                className="p-2 text-emerald-600 hover:bg-gray-200 rounded transition-colors"
              >
                <FaCheck size="1.2em" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }} 
                className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              >
                <FaPen size="1.2em" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAvailability(item.id, item.available);
                }} 
                className="p-2 text-emerald-600 hover:bg-gray-200 rounded transition-colors"
              >
                {item.available ? <FaToggleOn size="1.5em" /> : <FaToggleOff size="1.5em" />}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeMenuItem(item.id);
                }} 
                className="p-2 text-red-500 hover:bg-gray-200 rounded transition-colors"
              >
                <FaRegTrashAlt size="1.2em" />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
};

export default MenuItem;
