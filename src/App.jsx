import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import About from './Pages/About'
import Asosiy from './Pages/Asosiy'
import Blog from './Pages/Blog'
import Home from './Pages/Home'
import Login from './Pages/Login'
import MyWorks from './Pages/My-works'
import Register from './Pages/Register'
import Algo from './Pages/Algo'
import Payment from './Pages/Payment'
import Hackathon from './Pages/Hackathon'
import SpaceShop from './Pages/SpaceShop'
import Reyting from './Pages/Reyting'
import BattleLobby from './Pages/BattleLobby'
import Events from './Pages/Events'
import Profil from './Pages/Profil'
import PrivateRoute from './Components/PrivateRoute'
import Error from './Pages/Error'

const App = () => {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route
				element={
					<PrivateRoute>
						<Header />
					</PrivateRoute>
				}
			>
				<Route path='/' element={<Asosiy />} />
				<Route path='/about' element={<About />} />
				<Route path='/my-works' element={<MyWorks />} />
				<Route path='/games' element={<BattleLobby />} />
				<Route path='/battle' element={<BattleLobby />} />
				<Route path='/algo' element={<Algo />} />
				<Route path='/space-shop' element={<SpaceShop />} />
				<Route path='/blog' element={<Blog />} />
				<Route path='/hackathon' element={<Hackathon />} />
				<Route path='/events' element={<Events />} />
				<Route path='/rating' element={<Reyting />} />
				<Route path='/payment' element={<Payment />} />
				<Route path='/profile' element={<Profil />} />

				{/* Qo'shimcha yo'nalishlar */}
				<Route path='/monkeytype' element={<Home />} />
				<Route path='/raqib-topish' element={<BattleLobby />} />
				<Route path='/uno' element={<Home />} />

				{/* Noma'lum yo'nalishlar */}
				<Route path='*' element={<Error />} />
			</Route>
		</Routes>
	)
}

export default App
