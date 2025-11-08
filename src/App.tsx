import React, { useEffect, useState } from 'react'
import Dashboard from './components/dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import CityPage from './pages/city-page'

export default function App() {

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || []
  })

  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('history')) || []
  })

  function clearHistory() {
    setHistory([])
  }

  function addHistory(historyItem) {

    const newSearch = {
      ...historyItem, 
      searchedAt: Date.now(),
    }

    const filteredHistory = history.filter(
            (item) => !(item.lat === history.lat && item.lon === history.lon)
          );
          const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

          setHistory(newHistory);
      }

  function addFavorite(item) {
    setFavorites((prev) => ([...prev, item]))
  }

  function removeFavorite(lat, lon) {
    console.log("hello")
    setFavorites((prev) => {
      return prev.filter((city) => city.lat !== lat && city.lon !== lon)
    })
  }


  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])


  return (
    <BrowserRouter>
      <Layout favorites={favorites} history={history} addHistory={addHistory} clearHistory={clearHistory}>
        <Routes>
          <Route path='/' element={<Dashboard favorites={favorites} removeFavorite={removeFavorite}/>} />
          <Route path='/city/:cityname' element={<CityPage favorites={favorites} addFavorite={addFavorite} removeFavorite={removeFavorite}/>} />


        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
