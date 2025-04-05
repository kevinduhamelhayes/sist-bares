import React, { useContext, useEffect } from "react"
import Unit from "./Unit"
import SpecialUnit from "./SpecialUnit"
import DailySales from './DailySales'
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
    <div className="pt-24 w-full max-w-[1400px] mx-auto">
      <DailySales />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 m-5 justify-items-center
        lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
        md:m-4 md:gap-4
        sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:gap-3
        xs:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] xs:m-3"
      >
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
          <div className="col-span-full p-5 text-center text-lg text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 rounded-lg my-5">
            No hay mesas configuradas.
          </div>
        )}
      </div>
    </div>
  )
}

export default Body
