import { useNavigate } from 'react-router-dom'

const Register = () => {
	const navigate = useNavigate()
async function handleSubmit(event) {
  event.preventDefault()

  const form = event.currentTarget
  const user = Object.fromEntries(new FormData(form))

  try {
    const response = await fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`)
    }

    const newUser = await response.json()

    // Mashq uchun PrivateRouter tekshiradigan qiymat
    localStorage.setItem('token', String(newUser.id))
    navigate('/', { replace: true })
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
	return (
	
     <div className="container m-auto p-4 flex justify-center items-center h-screen">
			
      	<form className='flex flex-col items-center border-2 border-gray-300  rounded-2xl p-5 max-w-[500px]' onSubmit={handleSubmit}>
			<label htmlFor='name'>Ism</label>
			<input className='text-black border-2 border-gray-200 ' id='name' name='name' required />

			<label htmlFor='email'>Email</label>
			<input className='text-black border-2 border-gray-200 ' id='email' name='email' type='email' required />

			<label htmlFor='phone'>Telefon</label>
			<input className='text-black border-2 border-gray-200 ' id='phone' name='phone' type='tel' required />

			<label htmlFor='password'>Parolingiz</label>
			<input className='text-black border-2 border-gray-200 ' id='password' name='password' type='password' required />

			<label htmlFor='password'>Parolingiz</label>
			<input className='text-black border-2 border-gray-200 ' id='password' name='password' type='password' required />


			<button
				type='submit'
				className='bg-gray-500 rounded-2xl px-10 py-3 mt-4 text-white'
			>
				Kiritish
			</button>
					{}
     
		</form>
    </div>
	)
}

export default Register
