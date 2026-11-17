import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouter = ({ children }) => {
	const token = localStorage.getItem('token')

	if (!token) return <Navigate to="/login" replace />

	return children || <Outlet />
}

export default PrivateRouter
