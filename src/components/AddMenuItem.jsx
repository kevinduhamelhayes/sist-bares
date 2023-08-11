import { useState, useEffect } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import Todo from "./MenuItem"
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "/firebaseConfig"

function NewMenuItems() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")

  //create a function to add todos
  const createMenuItem = async (e) => {
    e.preventDefault(e)
    if (input === "") {
      alert("please enter a todo")
      return
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    })
    setInput("")
  }

  //read todos from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = []
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id })
      })
      setTodos(todosArr)
    })
    return () => unsubscribe()
  }, [])
  //update todos to firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    })
  }
  //create a function to delete todos
  const deleteMenuItem = async (id) => {
    await deleteDoc(doc(db, "todos", id))
  }

  return (
    <div className="h-screen w-screen p-4 bg-gradient-to-r from-black to-slate-600 ">
      <div className=" bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4">
        <h3 className="text-3xl font-bold text-center text-gray-800 p-2">
          Todo App
        </h3>
        <form onSubmit={createMenuItem} className="flex justify-between ">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="order p-2 w-full text-xl"
          />
          <button className="border p-4 ml-2 bg-black text-white">
            <AiOutlinePlus color="white" size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteMenuItem}
            />
          ))}
        </ul>
        <ul>
          {todos.length < 1 ? null : (
            <p className="text-center p-2">You have {todos.length} To-Dos</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NewMenuItems
