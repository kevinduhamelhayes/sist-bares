import React from "react";
import { AiOutlinePlus, AiFillSave } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { useMenuManagement } from "../hooks/useMenuManagement";
import { useBulkEdit } from "../hooks/useBulkEdit";

function ManageMenuItems() {
  const {
    menuItems,
    filteredItems,
    name,
    setName,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    filter,
    setFilter,
    addMenuItem,
    removeMenuItem,
    toggleAvailability
  } = useMenuManagement();

  const {
    bulkEditMode,
    setBulkEditMode,
    bulkPriceChange,
    setBulkPriceChange,
    selectedItems,
    applyBulkPriceChange,
    handleItemSelection,
    resetBulkEdit
  } = useBulkEdit(menuItems);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Gestión de Menú</h2>
        
        {!bulkEditMode ? (
          <>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Añadir nuevo ítem</h3>
              <form onSubmit={addMenuItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Nombre del ítem"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Precio ($)
                    </label>
                    <input
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bebidas">Bebidas</option>
                    <option value="comidas">Comidas</option>
                    <option value="postres">Postres</option>
                    <option value="entrantes">Entrantes</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del ítem"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AiOutlinePlus className="mr-2" /> Añadir ítem
                </button>
              </form>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <button
                onClick={() => setBulkEditMode(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Edición masiva
              </button>
              
              <div className="flex items-center gap-2">
                <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                  Filtrar por categoría:
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="comidas">Comidas</option>
                  <option value="postres">Postres</option>
                  <option value="entrantes">Entrantes</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Edición masiva de precios</h3>
            <p className="text-gray-600 mb-4">Selecciona los ítems que quieres modificar</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="bulkChange" className="block text-sm font-medium text-gray-700 mb-1">
                  Cambio de precio (%)
                </label>
                <input
                  id="bulkChange"
                  type="number"
                  value={bulkPriceChange}
                  onChange={(e) => setBulkPriceChange(e.target.value)}
                  placeholder="Ej: 10 para +10%, -5 para -5%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={applyBulkPriceChange}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AiFillSave className="mr-2" /> Aplicar cambios
                </button>
                <button
                  onClick={resetBulkEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Ítems del menú ({filteredItems.length})
          </h3>
          {filteredItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay ítems para mostrar</p>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  removeMenuItem={removeMenuItem}
                  toggleAvailability={toggleAvailability}
                  bulkEditMode={bulkEditMode}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={handleItemSelection}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageMenuItems;
