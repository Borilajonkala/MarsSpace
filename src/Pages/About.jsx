import dbData from '../../db.json'

const About = () => {
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('mars_auth_user') || localStorage.getItem('token')
      return stored ? JSON.parse(stored) : dbData.currentUser
    } catch {
      return dbData.currentUser
    }
  })()

  const courses = dbData.courses || []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profil Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-md overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              ''
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentUser?.fullName || 'Mars Student'}
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Mars ID: <span className="font-mono text-gray-800">{currentUser?.marsId || 'MID-31710'}</span>
              {currentUser?.groupCode && (
                <span className="ml-3 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  Guruh: {currentUser.groupCode}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#fef9c3] border border-amber-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-amber-700 font-semibold block">Mars Coin</span>
            <span className="text-lg font-black text-amber-800">🪙 {currentUser?.coins || 239}</span>
          </div>
          <div className="bg-[#eff6ff] border border-blue-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-blue-700 font-semibold block">Tajriba (XP)</span>
            <span className="text-lg font-black text-blue-800">⚡ {currentUser?.xp || 650}</span>
          </div>
        </div>
      </div>

      {/* Kurslar ro'yxati */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mavjud Kurslar va Dasturlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: course.color || '#F97316' }}
                  >
                    {course.shortTitle || course.title}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {course.ageCategory || 'Barcha yoshlar'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{course.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Davomiyligi: {course.durationMonths} oy</span>
                <span>Modullar: {course.totalModules} ta</span>
                <span>Darslar: {course.lessonsPerMonth} ta / oy</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
