import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import PrivateRouter from './Components/PrivateRouter'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import TadbirVaTogareklar from './Pages/Events'

const App = () => {
  return (
    <Routes>
      {/* Login sahifasi ochiq (public) - token bo'lmasa ham ko'rinaveradi */}
      <Route path="/login" element={<Login />} />

      {/* Barcha ichki sahifalar himoyalangan: token bo'lmasa PrivateRouter /login ga qaytaradi */}
      <Route element={<PrivateRouter />}>
        {/* Header barcha himoyalangan sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<About />} />
          <Route path="/my-works" element={<Home />} />
          <Route path="/games" element={<Home />} />
          <Route path="/algo" element={<About />} />
          <Route path="/blog" element={<About />} />
          <Route path="/hackathon" element={<Home />} />
          <Route path="/events" element={<TadbirVaTogareklar />} />
          <Route path="/rating" element={<Home />} />
          <Route path="/payment" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
