import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import PrivateRouter from './Components/PrivateRouter'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import Blog from './Pages/Blog'
import Entertainment from './Pages/Entertainment'
import Asosiy from './Pages/Asosiy'
=======
import Asosiy from './Pages/Asosiy'
import Blog from './Pages/Blog'
>>>>>>> d972ffe4721fb515a9f29ea080250fac8e5c503e
=======
import TadbirVaTogareklar from './Pages/Events'
>>>>>>> 2d7295eb47bf2703634755b8b3f02c37eb5f7f97
=======
import MyWorks from './Pages/My-works'
>>>>>>> cfa587038d1b9c9062eddcd230d599a119fd262f

const App = () => {
  return (
    <Routes>
      {/* Login sahifasi ochiq (public) - token bo'lmasa ham ko'rinaveradi */}
      <Route path="/login" element={<Login />} />

<<<<<<< HEAD
      {/* Header barcha sahifalarda doimiy ishlaydi va sahifalar uning ichida almashadi */}
      <Route element={<Header />}>
        <Route path="/" element={<Asosiy />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<About />} />
<<<<<<< HEAD
        <Route path="/my-works" element={<Home />} />
<<<<<<< HEAD
        <Route path="/games" element={<Entertainment />} />
=======
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/games" element={<Home />} />
>>>>>>> cfa587038d1b9c9062eddcd230d599a119fd262f
        <Route path="/algo" element={<About />} />
        <Route path="/blog" element={<Blog />} />
=======
        <Route path="/games" element={<Home />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path='/blog' element={<Blog/>}/>
>>>>>>> d972ffe4721fb515a9f29ea080250fac8e5c503e
        <Route path="/hackathon" element={<Home />} />
        <Route path="/events" element={<About />} />
        <Route path="/rating" element={<Home />} />
        <Route path="/payment" element={<About />} />

       
        <Route path="/monkeytype" element={<Home />} />
        <Route path="/raqib-topish" element={<Home />} />
        <Route path="/uno" element={<Home />} />

        <Route path="*" element={<Home />} />
=======
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