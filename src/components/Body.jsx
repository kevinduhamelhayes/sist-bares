import React, { useContext, useEffect } from "react"
import Unit from "./Unit"
import SpecialUnit from "./SpecialUnit"
import DailySales from './DailySales'
import "./styles/body.css"
import { TableContext } from "../context/TableContext"

const Body = () => {
  const { tables, specialTables } = useContext(TableContext)
  
  // Asegurarse de que specialTables sea un array antes de usar spread
  const safeSpecialTables = Array.isArray(specialTables) ? specialTables : [];
  const allTables = [...tables, ...safeSpecialTables].sort((a, b) => a.number - b.number);

  // Log para debugging
  useEffect(() => {
    console.log('Body component rendered with tables:', tables);
  }, [tables]);

  return (
    <div className="body-container">
      <DailySales />

      <div className="body-grid">
        {allTables.length > 0 ? (
          allTables.map((table) => {
            console.log(`Rendering table ${table.number}, isSpecial: ${table.isSpecial}`);
            return table.isSpecial ? (
              <SpecialUnit 
                key={`special-${table.number}`}
                table={table}
              />
            ) : (
              <Unit 
                key={`unit-${table.number}`} 
                tableNumber={table.number} 
              />
            )
          })
        ) : (
          <div className="no-tables-message">
            No hay mesas configuradas.
          </div>
        )}
      </div>
    </div>
  )
}

export default Body
