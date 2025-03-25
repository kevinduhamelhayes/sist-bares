import { FaRegTrashAlt, FaPen, FaCheck, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import { useState } from "react";
import { db } from "./firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import "./styles/menuItem.css";

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
    <li className={`menu-item ${!item.available ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => bulkEditMode && onSelect(item.id)}>
      {bulkEditMode ? (
        <div className="menu-item-bulk-select">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onSelect(item.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
      
      <div className="menu-item-content">
        {isEditing ? (
          <div className="menu-item-edit-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Categoría:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="bebidas">Bebidas</option>
                <option value="comidas">Comidas</option>
                <option value="postres">Postres</option>
                <option value="entrantes">Entrantes</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="menu-item-details">
            <div className="menu-item-main-info">
              <h4 className="menu-item-name">{item.name}</h4>
              <div className="menu-item-price">{formatPrice(item.price)}</div>
            </div>
            
            {item.description && (
              <p className="menu-item-description">{item.description}</p>
            )}
            
            <div className="menu-item-meta">
              <span className="menu-item-category">{item.category}</span>
              <span className="menu-item-availability">
                {item.available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {!bulkEditMode && (
        <div className="menu-item-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }} className="btn-icon btn-cancel">
                <AiFillCloseSquare size="1.2em" />
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                handleConfirmation();
              }} className="btn-icon btn-confirm">
                <FaCheck size="1.2em" />
              </button>
            </div>
          ) : (
            <>
              <button onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }} className="btn-icon btn-edit">
                <FaPen size="1.2em" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAvailability(item.id, item.available)
                }} 
                className="btn-icon btn-toggle"
              >
                {item.available ? <FaToggleOn size="1.5em" /> : <FaToggleOff size="1.5em" />}
              </button>
              
              <button onClick={(e) => {
                e.stopPropagation();
                removeMenuItem(item.id);
              }} className="btn-icon btn-delete">
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
