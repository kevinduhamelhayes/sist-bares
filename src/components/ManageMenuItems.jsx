import { useState, useEffect } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { db } from "../firebase"
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore"
import Todo from "./MenuItem"

function ManageMenuItems() {
  const [menuItems, setMenuItems] = useState([])
  const [input, setInput] = useState("")

  const addMenuItem = async (e) => {
    e.preventDefault()
    if (input === "") {
      alert("Por favor, introduce el nombre del ítem del menú")
      return
    }
    await addDoc(collection(db, "menuItems"), {
      name: input,
      // Puedes agregar otros campos aquí, como price, description, etc.
    })
    setInput("")
  }

  useEffect(() => {
    const q = query(collection(db, "menuItems"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id })
      })
      setMenuItems(itemsArr)
    })
    return () => unsubscribe()
  }, [])

  const removeMenuItem = async (id) => {
    await deleteDoc(doc(db, "menuItems", id))
  }

  return (
    <div className="h-screen w-screen p-4 bg-gradient-to-r from-black to-slate-600 ">
      <div className=" bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4">
        <h3 className="text-3xl font-bold text-center text-gray-800 p-2">
          Gestión de Menú
        </h3>
        <form onSubmit={addMenuItem} className="flex justify-between ">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="order p-2 w-full text-xl"
            placeholder="Nombre del ítem"
          />
          <button className="border p-4 ml-2 bg-black text-white">
            <AiOutlinePlus color="white" size={30} />
          </button>
        </form>
        <ul>
          {menuItems.map((item, index) => (
            <Todo
              key={index}
              item={item}
              removeMenuItem={removeMenuItem}
              // Aquí debes adaptar el componente Todo para que muestre y funcione correctamente con los ítems del menú.
            />
          ))}
        </ul>
        <ul>
          {menuItems.length < 1 ? null : (
            <p className="text-center p-2">
              Tienes {menuItems.length} ítems en el menú
            </p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ManageMenuItems
