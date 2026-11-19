import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Asosiy from './Pages/Asosiy'
import Blog from './Pages/Blog'
import Entertainment from './Pages/Entertainment'
import TadbirVaTogareklar from './Pages/Events'
import MyWorks from './Pages/My-works'
import Alogo from './Pages/Alogo'
import Profil from './Pages/Profil'

const App = () => {
  return (
    <Routes>
      {/* Login sahifasi (To'liq ekran) */}
      <Route path="/login" element={<Login />} />

      {/* Header barcha sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
      <Route element={<Header />}>
        <Route path="/" element={<Asosiy />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<MyWorks />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/games" element={<Entertainment />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path="/algo" element={<Alogo />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/hackathon" element={<TadbirVaTogareklar />} />
        <Route path="/events" element={<TadbirVaTogareklar />} />
        <Route path="/rating" element={<Home />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/payment" element={<About />} />

        {/* Qo'shimcha yo'nalishlar */}
        <Route path="/monkeytype" element={<Home />} />
        <Route path="/raqib-topish" element={<Home />} />
        <Route path="/uno" element={<Home />} />

        {/* Noma'lum yo'nalishlar */}
        <Route path="*" element={<Asosiy />} />
      </Route>
    </Routes>
  )
}

export default App
