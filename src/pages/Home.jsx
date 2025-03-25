import React, { useEffect, useContext } from 'react'
import Body from '../components/Body'
import AddSpecialTable from '../components/AddSpecialTable'
import { TableContext } from '../context/TableContext'

const Home = () => {
  const { tables } = useContext(TableContext);
  
  // Log para verificar el flujo de renderizado
  useEffect(() => {
    console.log('Home component rendered');
    console.log('Tables in Home context:', tables);
  }, [tables]);

  return (
    <div className="home-container">
      <div className="main-section">
        <AddSpecialTable />
        <Body />
      </div>
    </div>
  )
}

export default Home 