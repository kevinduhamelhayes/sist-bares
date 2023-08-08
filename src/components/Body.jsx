import Unit from "./Unit"
import "./styles/body.css"

const Body = () => {
  const totalUnits = 26

  return (
    <div className="body">
      {Array(totalUnits)
        .fill()
        .map((_, index) => (
          <Unit key={index} />
        ))}
    </div>
  )
}

export default Body
