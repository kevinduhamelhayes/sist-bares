import { useContext } from "react"
import Unit from "./Unit"
import SpecialUnit from "./SpecialUnit"
import "./styles/body.css"
import { TableContext } from "../context/TableContext"

const Body = () => {
  const { tables } = useContext(TableContext)

  return (
    <div className="body-container">
      <div className="body">
        {tables.map((table) => (
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
        ))}
      </div>
    </div>
  )
}

export default Body
