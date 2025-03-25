import React from 'react'
import Body from '../components/Body'
import AddSpecialTable from '../components/AddSpecialTable'

const Home = () => {
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