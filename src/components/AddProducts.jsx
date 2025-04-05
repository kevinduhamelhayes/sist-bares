import "./styles/addproducts.css"
const AddProducts = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="productName"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Producto
            </label>
            <input
              id="productName"
              type="text"
              placeholder="Nombre del producto"
              autoFocus
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                dark:focus:ring-blue-400/20 outline-none transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label 
              htmlFor="tableNumber"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Número de mesa
            </label>
            <input
              id="tableNumber"
              type="number"
              placeholder="Número de mesa"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                dark:focus:ring-blue-400/20 outline-none transition-colors duration-200"
            />
          </div>

          <button 
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md
              hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow
              dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sumar
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProducts
