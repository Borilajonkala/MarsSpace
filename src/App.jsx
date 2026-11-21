import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Asosiy from './Pages/Asosiy'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Blog from './Pages/Blog'
import MyWorks from './Pages/My-works'
import Alogo from './Pages/Alogo'
import Payment from './Pages/Payment'
import Hackathon from './Pages/Hackathon'
import SpaceShop from './Pages/SpaceShop'
import Reyting from './Pages/Reyting'
import BattleLobby from './Pages/BattleLobby'
import Events from './Pages/Events'
import Profil from './Pages/Profil'

const App = () => {
  return (
    <Routes>
      {/* Auth sahifalari (Header siz, to'liq ekran) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Header barcha asosiy sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
      <Route element={<Header />}>
        <Route path="/" element={<Asosiy />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<About />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/games" element={<BattleLobby />} />
        <Route path="/battle" element={<BattleLobby />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path="/algo" element={<Alogo />} />
        <Route path="/space-shop" element={<SpaceShop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/hackathon" element={<Hackathon />} />
        <Route path="/events" element={<Events />} />
        <Route path="/rating" element={<Reyting />} />
        <Route path="/reyting" element={<Reyting />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/profil" element={<Profil />} />

        {/* Qo'shimcha yo'nalishlar */}
        <Route path="/monkeytype" element={<Home />} />
        <Route path="/raqib-topish" element={<BattleLobby />} />
        <Route path="/uno" element={<Home />} />

        {/* Noma'lum yo'nalishlar */}
        <Route path="*" element={<Asosiy />} />
      </Route>
    </Routes>
  )
}

export default App
