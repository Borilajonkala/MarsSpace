import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'

import Blog from './Pages/Blog'
import MyWorks from './Pages/My-works'
import Alogo from './Pages/Alogo'
import BattleLobby from './Pages/BattleLobby'
import PrivateRouter from './Components/PrivateRouter'
import Events from './Pages/Events'
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

        

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
