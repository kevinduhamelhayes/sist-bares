import { db } from "./firebaseConfig"
import firebase from "firebase/app"
import "firebase/firestore"
import "./styles/addproducts.css"

const AddProducts = () => {
  const handleSubmit = async (event) => {
    event.preventDefault()

    const productName = event.target[0].value
    const tableNumber = event.target[1].value

    try {
      await db.collection("products").add({
        name: productName,
        table: tableNumber,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      console.log("Producto agregado!")
    } catch (error) {
      console.error("Error al agregar el producto: ", error)
    }
  }

  return (
    <div className="add-products-container">
      <div className="add-products">
        <form className="form-add-products" onSubmit={handleSubmit}>
          <label className="label-add-products" htmlFor="">
            Producto
          </label>
          <input
            className="input-add-products"
            type="text"
            placeholder="Nombre del producto"
            autoFocus
          />
          <label className="numero de mesa" htmlFor="">
            Numero de mesa
          </label>
          <input
            className="input-add-products"
            type="number"
            placeholder="Numero de mesa"
          />
          <button className="btn-add-to-table" type="submit">
            sumar
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProducts
