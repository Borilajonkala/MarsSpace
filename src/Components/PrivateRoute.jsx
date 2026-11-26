import { Navigate } from 'react-router-dom'
import { useProfile } from '../profile/ProfileContext.js'

// Login qilmagan foydalanuvchi hech qaysi sahifani ko'ra olmaydi.
const PrivateRoute = ({ children }) => {
  const { authUser } = useProfile()

  if (!authUser) return <Navigate to='/login' replace />
  return children
}

export default PrivateRoute
