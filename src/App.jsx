import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Alogo from './Pages/Alogo'
import Blog from './Pages/Blog'

const App = () => {
  return (
    <Routes>
      {/* Login sahifasi (To'liq ekran) */}
      <Route path="/login" element={<Login />} />

      {/* Header barcha sahifalarda doimiy ishlaydi va sahifalar (Home, About...) uning ichida almashadi */}
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<About />} />
        <Route path="/my-works" element={<Home />} />
        <Route path="/games" element={<Home />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path='/blog' element={<Blog/>}/>
        <Route path="/hackathon" element={<Home />} />
        <Route path="/events" element={<About />} />
        <Route path="/rating" element={<Home />} />
        <Route path="/payment" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
