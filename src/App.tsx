import React, { useEffect, useState } from 'react'
import Dashboard from './components/dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import CityPage from './pages/city-page'

export default function App() {

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || []
  })

  function addFavorite(item) {
    setFavorites((prev) => ([...prev, item]))
  }


  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])


  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Dashboard favorites={favorites}/>} />
          <Route path='/city/:cityname' element={<CityPage favorites={favorites}/>} addFavorite={addFavorite}/>


        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
