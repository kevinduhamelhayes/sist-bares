import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { TableContext } from "../context/TableContext"

const AddSpecialTable = () => {
  const [tableName, setTableName] = useState('')
  const [capacity, setCapacity] = useState(4)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const { addSpecialTable } = useContext(TableContext)

  const handleAddSpecialTable = (e) => {
    e.preventDefault()
    
    if (tableName.trim() === '') {
      setMessage({ text: 'Por favor, ingresa un número de mesa', type: 'error' })
      return
    }
    
    const tableNumber = parseInt(tableName)
    if (isNaN(tableNumber) || tableNumber <= 0) {
      setMessage({ text: 'Por favor, ingresa un número de mesa válido', type: 'error' })
      return
    }
    
    try {
      const added = addSpecialTable(tableNumber, capacity)
      
      if (added) {
        setMessage({ text: `Mesa especial #${tableNumber} añadida con éxito`, type: 'success' })
        setTableName('')
        setCapacity(4)
        setShowForm(false)
        
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
    <div className="pt-24 min-h-[calc(100vh-60px)] flex justify-center items-start pb-8">
      {!showForm ? (
        <button 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold 
            shadow-md hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          onClick={() => setShowForm(true)}
        >
          + Añadir Mesa Especial
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-center mb-6 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Crear Mesa Especial
          </h3>
          
          <form onSubmit={handleAddSpecialTable} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label 
                htmlFor="tableName"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Número de Mesa:
              </label>
              <input
                type="number"
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                min="1"
                placeholder="Ej: 26"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                  dark:focus:ring-blue-400/20 outline-none transition-colors duration-200"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label 
                htmlFor="capacity"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Número de Sillas:
              </label>
              <select
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                  dark:focus:ring-blue-400/20 outline-none transition-colors duration-200"
              >
                <option value="2">2 sillas</option>
                <option value="4">4 sillas</option>
                <option value="6">6 sillas</option>
                <option value="8">8 sillas</option>
                <option value="10">10 sillas</option>
                <option value="12">12 sillas</option>
              </select>
            </div>
            
            <div className="flex justify-between gap-4 mt-6">
              <button 
                type="button" 
                className="flex-1 px-4 py-2 rounded-full border-2 border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 
                  transition-colors duration-200"
                onClick={() => {
                  setShowForm(false)
                  setMessage({ text: '', type: '' })
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold 
                  hover:bg-blue-700 transition-colors duration-200"
              >
                Crear Mesa
              </button>
            </div>
          </form>
          
          {message.text && (
            <div 
              className={`mt-4 p-4 rounded-md text-center font-medium ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddSpecialTable
