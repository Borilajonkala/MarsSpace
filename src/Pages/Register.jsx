
const Register = () => {
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

    form.reset()
  } catch (error) {
    console.error(error)
    alert('Saqlashda xato bo‘ldi. JSON Server ishlayotganini tekshir.')
  }
}
	return (
<form onSubmit={handleSubmit}>
  <label htmlFor="name">Ism</label>
  <input className="text-pink-500" id="name" name="name" required />

  <label htmlFor="email">Email</label>
  <input id="email" name="email" type="email" required />

  <label htmlFor="phone">Telefon</label>
  <input id="phone" name="phone" type="tel" required />

  <button type="submit" className="bg-gray-500 rounded-2xl px-10 py-3 text-white">
    Kiritish
  </button>
</form>
	)
}

export default Register