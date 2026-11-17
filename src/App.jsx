import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import PrivateRouter from './Components/PrivateRouter'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'

import Blog from './Pages/Blog'
import Entertainment from './Pages/Entertainment'
import Asosiy from './Pages/Asosiy'
import Asosiy from './Pages/Asosiy'
import Blog from './Pages/Blog'
import TadbirVaTogareklar from './Pages/Events'
import MyWorks from './Pages/My-works'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Routes element={<Header />}>
        <Route path="/" element={<Asosiy />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<About />} />
        <Route path="/my-works" element={<Home />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/games" element={<Home />} />
        <Route path="/algo" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/games" element={<Home />} />
        <Route path="/alogo" element={<Alogo />} />
        <Route path='/blog' element={<Blog/>}/>
        <Route path="/hackathon" element={<Home />} />
        <Route path="/events" element={<About />} />
        <Route path="/rating" element={<Home />} />
        <Route path="/payment" element={<About />} />

       
        <Route path="/monkeytype" element={<Home />} />
        <Route path="/raqib-topish" element={<Home />} />
        <Route path="/uno" element={<Home />} />

        <Route path="*" element={<Home />} />

      <Route element={<PrivateRouter />}>
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