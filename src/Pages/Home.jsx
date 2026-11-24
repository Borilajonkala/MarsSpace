import dbData from '../../db.json'

const Home = () => {
  const ratings = dbData.ratings || []
  const marstype = dbData.marstype || {}

  return (
    
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reyting va Yutuqlar 🏆</h1>
        <p className="text-sm text-gray-500 mb-6">
          Eng yaxshi o'quvchilar haftalik va oylik natijalari
        </p>

        {/* Reyting jadvali */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase">
                <th className="py-3 px-4">O'rin</th>
                <th className="py-3 px-4">O'quvchi</th>
                <th className="py-3 px-4 text-right">Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ratings.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50/80 transition ${
                    item.isCurrent ? 'bg-orange-50/60 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold">
                    {item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : item.rank}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {item.name} {item.isCurrent && <span className="text-xs text-orange-600 font-semibold">(Siz)</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-600">
                    🪙 {item.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marstype vazifalar */}
      {marstype.tasks && marstype.tasks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Kunlik Vazifalar & Kometa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marstype.tasks.map((task) => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Vazifa #{task.id}</p>
                <h3 className="text-sm font-bold text-gray-800 mt-1">{task.title}</h3>
                <p className="text-xs font-semibold text-orange-600 mt-2">Natija: {task.score}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
