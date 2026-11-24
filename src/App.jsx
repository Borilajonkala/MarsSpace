import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'

import Blog from './Pages/Blog'
import MyWorks from './Pages/My-works'
import Alogo from './Pages/Alogo'
<<<<<<< HEAD
import BattleLobby from './Pages/BattleLobby'
import PrivateRouter from './Components/PrivateRouter'
import Events from './Pages/Events'
import Register from './Pages/Register'
=======
import SpaceShop from './Pages/SpaceShop'

>>>>>>> 16aa550210adab982ff9c040691117c6c467dcfa
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
<<<<<<< HEAD
      <Route path='/register' element={<Register />} />
        
=======

      {/* Header barcha sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
      <Route element={<Header />}>
        <Route path="/" element={<Asosiy />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<MyWorks />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/games" element={<Entertainment />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path="/algo" element={<Alogo />} />
        <Route path="/space-shop" element={<SpaceShop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/hackathon" element={<TadbirVaTogareklar />} />
        <Route path="/events" element={<TadbirVaTogareklar />} />
        <Route path="/rating" element={<Home />} />
        <Route path="/payment" element={<About />} />
        <Route path="/space-shop" element={<SpaceShop />} />
>>>>>>> 16aa550210adab982ff9c040691117c6c467dcfa

        {/* Qo'shimcha yo'nalishlar */}
      <Route element={<PrivateRouter />}>
        <Route path="/monkeytype" element={<Home />} />
        <Route path="/raqib-topish" element={<Home />} />
        <Route path="/uno" element={<Home />} />

        <Route path="*" element={<Home />} />

        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<About />} />
          <Route path="/my-works" element={<MyWorks />} />
          <Route path="/games" element={<BattleLobby />} />
          <Route path="/algo" element={<Alogo />} />
          <Route path="/blog" element={<Blog />} />
          {/* <Route path="/hackathon" element={<Home />} /> */}
          <Route path="/events" element={<Events />} />
          <Route path="/rating" element={<Home />} />
          <Route path="/payment" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
