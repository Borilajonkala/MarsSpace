import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouter = () => {
	const token = localStorage.getItem('token')
	console.log('Private ishladi' , Boolean(token));
	
	if (!token) {return <Navigate to="/login"  />}

	return <Outlet />
}

export default PrivateRouter
