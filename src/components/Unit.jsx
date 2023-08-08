import React, { useState } from 'react';
import "./styles/body.css";

const Unit = () => {
  const [tableColor, setTableColor] = useState('#ddd');
  const [chairColors, setChairColors] = useState(['#aaa', '#aaa', '#aaa', '#aaa']);

  const handleTableClick = () => {
    setTableColor(prevColor => prevColor === '#ddd' ? '#00A884' : '#ddd');
  };

  const handleChairClick = (index) => {
    setChairColors(prevColors => {
      const newColors = [...prevColors];
      switch (newColors[index]) {
        case '#aaa':
          newColors[index] = 'cyan'; // Celeste
          break;
        case 'cyan':
          newColors[index] = 'pink'; // Rosa
          break;
        case 'pink':
          newColors[index] = '#aaa'; // Gris
          break;
        default:
          newColors[index] = '#aaa';
      }
      return newColors;
    });
  };

  return (
    <div className="unidad">
      {chairColors.map((color, index) => (
        <div 
          key={index} 
          className="chair" 
          style={{backgroundColor: color}} 
          onClick={() => handleChairClick(index)}
        >
          silla
        </div>
      ))}
      <div 
        className="table" 
        style={{backgroundColor: tableColor}} 
        onClick={handleTableClick}
      >
        mesa
      </div>
    </div>
  );
}

export default Unit;
