import Unit from "./Unit"
import "./styles/body.css"

const Body = () => {
  const totalUnits = 25

  return (
    <div className="body-container">
    <div className="body">
      {Array(totalUnits)
        .fill()
        .map((_, index) => (
          <Unit key={index} tableNumber={index+1} />
        ))}
    </div>
    </div>
  )
}

export default Body
