import { useState } from 'react';

const SpecialTableForm = ({ onAddTable }) => {
  const [numOfChairs, setNumOfChairs] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTable(numOfChairs);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número de sillas:
        <select value={numOfChairs} onChange={(e) => setNumOfChairs(Number(e.target.value))}>
          {Array.from({ length: 15 }, (_, i) => i + 2).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </label>
      <button type="submit">Agregar mesa especial</button>
    </form>
  );
};
export default SpecialTableForm;