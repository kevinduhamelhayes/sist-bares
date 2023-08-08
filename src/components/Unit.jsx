import { useState } from 'react';
import "./styles/body.css";

const Unit = ({tableNumber}) => {
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
          setTableColor('#00A884');
          newColors[index] = 'cyan'; // Celeste
          break;
        case 'cyan':
          newColors[index] = 'pink'; // Rosa
          setTableColor('#00A884');
          break;
        case 'pink':
          newColors[index] = '#aaa'; // Gris
          break;
        default:
          newColors[index] = '#aaa';
      }
      if (newColors.every(color => color === '#aaa')) {
        setTableColor('#ddd');
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
        {`Mesa ${tableNumber} `}
      </div>
    </div>
  );
}

export default Unit;
