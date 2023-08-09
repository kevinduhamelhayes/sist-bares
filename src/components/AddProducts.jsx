import "./styles/addproducts.css"
const AddProducts = () => {
  return (
    <div className="add-products-container">
      <div className="add-products">
        <form className="form-add-products" action="">
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
          <button className="btn-add-to-table">sumar</button>
        </form>
      </div>
    </div>
  )
}

export default AddProducts
