import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./styles/addspecialtable.css"

const AddSpecialTable = () => {
  const [specialTableSize, setSpecialTableSize] = useState("")
  const [tablesToRemove, setTablesToRemove] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const navigate = useNavigate()

  // Función para crear una mesa especial
  const handleCreateSpecialTable = (e) => {
    e.preventDefault()
    
    if (!specialTableSize || isNaN(specialTableSize) || specialTableSize <= 0) {
      setMessage({
        text: "Por favor, introduce un número válido de personas",
        type: "error"
      })
      return
    }

    // En un escenario real, aquí enviaríamos los datos a la API o Firebase
    // Por ahora, simplemente mostramos un mensaje de éxito
    setMessage({
      text: `Mesa especial para ${specialTableSize} personas creada con éxito`,
      type: "success"
    })

    // Limpiar el campo después de crear la mesa
    setSpecialTableSize("")
    
    // Redirigir a la página principal después de 2 segundos
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  // Función para eliminar mesas
  const handleRemoveTables = (e) => {
    e.preventDefault()
    
    if (!tablesToRemove || isNaN(tablesToRemove) || tablesToRemove <= 0) {
      setMessage({
        text: "Por favor, introduce un número válido de mesas a eliminar",
        type: "error"
      })
      return
    }

    // En un escenario real, aquí enviaríamos los datos a la API o Firebase
    // Por ahora, simplemente mostramos un mensaje de éxito
    setMessage({
      text: `${tablesToRemove} mesas han sido eliminadas con éxito`,
      type: "success"
    })

    // Limpiar el campo después de eliminar las mesas
    setTablesToRemove("")
    
    // Redirigir a la página principal después de 2 segundos
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  return (
    <div className="container-add-special-table">
      <div className="special-table-container">
        <h2 className="special-table-title">Gestión de Mesas Especiales</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="forms-container">
          {/* Formulario para crear mesa especial */}
          <form onSubmit={handleCreateSpecialTable} className="form-table">
            <h3>Crear Mesa Especial</h3>
            
            <div className="form-group">
              <label className="label-add-tables" htmlFor="specialTableSize">
                Número de personas
              </label>
              <input
                id="specialTableSize"
                className="input-add-tables"
                placeholder="Ej: 8"
                type="number"
                min="1"
                value={specialTableSize}
                onChange={(e) => setSpecialTableSize(e.target.value)}
              />
            </div>

            <button className="btn-add-tables" type="submit">
              Crear Mesa Especial
            </button>
          </form>

          {/* Formulario para eliminar mesas */}
          <form onSubmit={handleRemoveTables} className="form-table">
            <h3>Eliminar Mesas</h3>
            
            <div className="form-group">
              <label className="label-add-tables" htmlFor="tablesToRemove">
                Número de mesas a eliminar
              </label>
              <input
                id="tablesToRemove"
                className="input-add-tables"
                placeholder="Ej: 2"
                type="number"
                min="1"
                value={tablesToRemove}
                onChange={(e) => setTablesToRemove(e.target.value)}
              />
            </div>

            <button className="btn-remove-tables" type="submit">
              Eliminar Mesas
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSpecialTable
