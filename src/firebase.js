import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBuSnjHd1ZuGkvWde1gpC3dGCxkRtlU57Q',
  authDomain: 'mars-space-auth.firebaseapp.com',
  projectId: 'mars-space-auth',
  storageBucket: 'mars-space-auth.firebasestorage.app',
  messagingSenderId: '1059683961479',
  appId: '1:1059683961479:web:ea786ea3f9015584588622',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()