import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import PrivateRouter from './Components/PrivateRouter'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Asosiy from './Pages/Asosiy'
import Blog from './Pages/Blog'
import Entertainment from './Pages/Entertainment'
import Events from './Pages/Events'
import Alogo from './Pages/Alogo'

const App = () => {
  return (
    <Routes>
      {/* Login sahifasi ochiq (public) - token bo'lmasa ham ko'rinaveradi */}
      <Route path="/login" element={<Login />} />

      {/* Barcha ichki sahifalar himoyalangan: token bo'lmasa PrivateRouter /login ga qaytaradi */}
      <Route element={<PrivateRouter />}>
        {/* Header barcha himoyalangan sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
        <Route element={<Header />}>
          <Route path="/" element={<Asosiy />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<About />} />
          <Route path="/my-works" element={<Home />} />
          <Route path="/games" element={<Entertainment />} />
          <Route path="/alogo" element={<Alogo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/hackathon" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/rating" element={<Home />} />
          <Route path="/payment" element={<About />} />

          {/* Kometa vazifalari (keyin o'z komponentlariga almashtirasiz) */}
          <Route path="/monkeytype" element={<Home />} />
          <Route path="/raqib-topish" element={<Home />} />
          <Route path="/uno" element={<Home />} />

          <Route path="*" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
