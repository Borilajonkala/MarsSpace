// O'yin-kulgi bo'limi menyusi (Battle, MARSTYPE, O'ynash)
const menuItems = [
  {
    label: 'Battle',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    label: 'MARSTYPE',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"></path>
      </svg>
    ),
  },
  {
    label: "O'ynash",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
        <circle cx="8.5" cy="8.5" r="1"></circle>
        <circle cx="15.5" cy="8.5" r="1"></circle>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="8.5" cy="15.5" r="1"></circle>
        <circle cx="15.5" cy="15.5" r="1"></circle>
      </svg>
    ),
  },
]

const Entertainment = () => {
  return (
    <div className="p-6 sm:p-10 flex justify-center">
      <div className="w-60 bg-white rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col gap-1.5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#2b2d42] text-base font-medium bg-transparent border-0 hover:bg-[#f1f3f5] transition cursor-pointer text-left"
          >
            <span className="w-[22px] h-[22px] flex items-center justify-center text-[#6c757d]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Entertainment
