import { useState, useEffect } from "react"
import { AiOutlinePlus, AiFillSave } from "react-icons/ai"
import { db } from "./firebaseConfig"
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import MenuItem from "./MenuItem"
import "./styles/manageMenuItems.css"

function ManageMenuItems() {
  const [menuItems, setMenuItems] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("bebidas")
  const [filter, setFilter] = useState("all")
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [bulkPriceChange, setBulkPriceChange] = useState(0)
  const [selectedItems, setSelectedItems] = useState([])

  const addMenuItem = async (e) => {
    e.preventDefault()
    if (name === "") {
      alert("Por favor, introduce el nombre del ítem del menú")
      return
    }
    if (price === "" || isNaN(parseFloat(price))) {
      alert("Por favor, introduce un precio válido")
      return
    }
    
    await addDoc(collection(db, "menuItems"), {
      name,
      price: parseFloat(price),
      description,
      category,
      available: true,
    })
    
    // Limpiar el formulario
    setName("")
    setPrice("")
    setDescription("")
    setCategory("bebidas")
  }

  useEffect(() => {
    const q = query(collection(db, "menuItems"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id })
      })
      setMenuItems(itemsArr)
    })
    return () => unsubscribe()
  }, [])

  const removeMenuItem = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ítem?")) {
      await deleteDoc(doc(db, "menuItems", id))
    }
  }

  const toggleAvailability = async (id, currentStatus) => {
    await updateDoc(doc(db, "menuItems", id), {
      available: !currentStatus,
    })
  }

  const applyBulkPriceChange = async () => {
    if (bulkPriceChange === 0 || selectedItems.length === 0) {
      alert("Selecciona al menos un ítem y un valor de cambio diferente a 0")
      return
    }
    
    const changePercent = parseFloat(bulkPriceChange) / 100
    
    for (const itemId of selectedItems) {
      const item = menuItems.find(item => item.id === itemId)
      if (item) {
        const newPrice = item.price * (1 + changePercent)
        await updateDoc(doc(db, "menuItems", itemId), {
          price: Math.round(newPrice * 100) / 100, // Redondear a 2 decimales
        })
      }
    }
    
    setBulkEditMode(false)
    setSelectedItems([])
    setBulkPriceChange(0)
  }

  const handleItemSelection = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const filteredItems = menuItems.filter(item => {
    if (filter === "all") return true
    return item.category === filter
  })

  return (
    <div className="menu-manager-container">
      <div className="menu-manager">
        <h2 className="title">Gestión de Menú</h2>
        
        {!bulkEditMode ? (
          <>
            <div className="menu-form-container">
              <h3>Añadir nuevo ítem</h3>
              <form onSubmit={addMenuItem} className="menu-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Nombre del ítem"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Precio ($)</label>
                  <input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="bebidas">Bebidas</option>
                    <option value="comidas">Comidas</option>
                    <option value="postres">Postres</option>
                    <option value="entrantes">Entrantes</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del ítem"
                    rows="3"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  <AiOutlinePlus /> Añadir ítem
                </button>
              </form>
            </div>
            
            <div className="menu-actions">
              <button onClick={() => setBulkEditMode(true)} className="btn btn-secondary">
                Edición masiva
              </button>
              
              <div className="category-filter">
                <label htmlFor="filter">Filtrar por categoría:</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="comidas">Comidas</option>
                  <option value="postres">Postres</option>
                  <option value="entrantes">Entrantes</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="bulk-edit-container">
            <h3>Edición masiva de precios</h3>
            <p>Selecciona los ítems que quieres modificar</p>
            
            <div className="bulk-edit-controls">
              <div className="form-group">
                <label htmlFor="bulkChange">Cambio de precio (%)</label>
                <input
                  id="bulkChange"
                  type="number"
                  value={bulkPriceChange}
                  onChange={(e) => setBulkPriceChange(e.target.value)}
                  placeholder="Ej: 10 para +10%, -5 para -5%"
                />
              </div>
              
              <div className="bulk-edit-actions">
                <button onClick={applyBulkPriceChange} className="btn btn-primary">
                  <AiFillSave /> Aplicar cambios
                </button>
                <button onClick={() => {
                  setBulkEditMode(false)
                  setSelectedItems([])
                }} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="menu-items-list">
          <h3>Ítems del menú ({filteredItems.length})</h3>
          {filteredItems.length === 0 ? (
            <p className="empty-list">No hay ítems para mostrar</p>
          ) : (
            <ul>
              {filteredItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  removeMenuItem={removeMenuItem}
                  toggleAvailability={toggleAvailability}
                  bulkEditMode={bulkEditMode}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={handleItemSelection}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageMenuItems
