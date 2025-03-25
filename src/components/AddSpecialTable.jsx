import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "./styles/addspecialtable.css"
import { TableContext } from "../context/TableContext"

const AddSpecialTable = () => {
  const [tableName, setTableName] = useState('')
  const [capacity, setCapacity] = useState(4)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const { addSpecialTable } = useContext(TableContext)

  const handleAddSpecialTable = (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (tableName.trim() === '') {
      setMessage({ text: 'Por favor, ingresa un número de mesa', type: 'error' })
      return
    }
    
    const tableNumber = parseInt(tableName)
    if (isNaN(tableNumber) || tableNumber <= 0) {
      setMessage({ text: 'Por favor, ingresa un número de mesa válido', type: 'error' })
      return
    }
    
    // Intentar añadir la mesa especial
    try {
      const added = addSpecialTable(tableNumber, capacity)
      
      if (added) {
        setMessage({ text: `Mesa especial #${tableNumber} añadida con éxito`, type: 'success' })
        // Limpiar formulario
        setTableName('')
        setCapacity(4)
        // Ocultar formulario después de añadir
        setShowForm(false)
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage({ text: '', type: '' })
        }, 3000)
      } else {
        setMessage({ text: 'Ya existe una mesa con ese número', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: error.message || 'Error al añadir mesa especial', type: 'error' })
    }
  }

  return (
    <div className="container-add-special-table">
      {!showForm ? (
        <button 
          className="add-table-button" 
          onClick={() => setShowForm(true)}
        >
          + Añadir Mesa Especial
        </button>
      ) : (
        <div className="special-table-form">
          <h3 className="special-table-title">Crear Mesa Especial</h3>
          
          <form onSubmit={handleAddSpecialTable} className="forms-container">
            <div className="form-group">
              <label htmlFor="tableName">Número de Mesa:</label>
              <input
                type="number"
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                min="1"
                placeholder="Ej: 26"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Número de Sillas:</label>
              <select
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="form-select"
              >
                <option value="2">2 sillas</option>
                <option value="4">4 sillas</option>
                <option value="6">6 sillas</option>
                <option value="8">8 sillas</option>
                <option value="10">10 sillas</option>
                <option value="12">12 sillas</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setShowForm(false)
                  setMessage({ text: '', type: '' })
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                Crear Mesa
              </button>
            </div>
          </form>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddSpecialTable
