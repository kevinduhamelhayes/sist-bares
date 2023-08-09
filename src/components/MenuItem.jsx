import { FaRegTrashAlt, FaPen, FaCheck } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import { useState } from "react";
import { db } from "./Firebase";
import { updateDoc, doc } from "firebase/firestore";

const style = {
  li: "flex justify-between bg-slate-200 p-4 my-2 capitalize",
  row: "flex items-center",
  text: "ml-2 cursor-pointer",
  button: "cursor flex items-center justify-center",
};

const MenuItem = ({ item, removeMenuItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.name);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const editItemName = async () => {
    await updateDoc(doc(db, "menuItems", item.id), {
      name: value,
    });
  };

  const handleConfirmation = () => {
    editItemName();
    setIsEditing(false);
  };

  return (
    <li className={style.li}>
      <div className={style.row}>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e)}
            className="ml-2 rounded-md pl-2"
          />
        ) : (
          <p className={style.text}>{item.name}</p>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <div className="flex gap-2 item-center">
            <button onClick={() => setIsEditing(false)}>
              <AiFillCloseSquare size="1.2em" />
            </button>
            <button onClick={handleConfirmation}>
              <FaCheck size="1.2em" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}>
            <FaPen size="1.2em" />
          </button>
        )}
        <button onClick={() => removeMenuItem(item.id)}>
          <FaRegTrashAlt size="1.2em" />
        </button>
      </div>
    </li>
  );
};

export default MenuItem;
