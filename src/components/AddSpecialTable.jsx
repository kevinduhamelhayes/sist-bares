import "./styles/addspecialtable.css"
const AddSpecialTable = () => {
  return (
    <div className="container-add-special-table">
      <form action="" className="form-table">
        <label className="label-add-tables" htmlFor="">
          Quieres una mesa especial para
        </label>
        <input
          className="input-add-tables"
          placeholder="numero de personas"
          type="number"
        />

        <label className="label-add-tables" htmlFor="">
          Deseas eliminar algunas mesas?
        </label>
        <input
          className="input-add-tables"
          placeholder="numero de mesas"
          type="number"
        />

        <button className="btn-add-tables" type="submit">
          Guardar
        </button>
      </form>
    </div>
  )
}

export default AddSpecialTable
