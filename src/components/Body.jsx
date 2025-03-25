import { useContext, useEffect } from "react"
import Unit from "./Unit"
import SpecialUnit from "./SpecialUnit"
import "./styles/body.css"
import { TableContext } from "../context/TableContext"

const Body = () => {
  const { tables } = useContext(TableContext)

  // Log para debugging
  useEffect(() => {
    console.log('Body component rendered with tables:', tables);
  }, [tables]);

  return (
    <div className="body-container">
      <div className="body body-grid">
        {tables && tables.length > 0 ? (
          tables.map((table) => (
            table.isSpecial ? (
              <SpecialUnit 
                key={table.id}
                tableNumber={table.number}
                chairCount={table.capacity}
              />
            ) : (
              <Unit 
                key={table.id} 
                tableNumber={table.number} 
              />
            )
          ))
        ) : (
          <div className="no-tables-message">
            No hay mesas disponibles. Por favor, intenta recargar la página.
          </div>
        )}
      </div>
    </div>
  )
}

export default Body
