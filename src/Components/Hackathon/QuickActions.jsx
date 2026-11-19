import { QUICK_ACTIONS } from './hackathonData'

const svgProps = {
    className: 'w-5 h-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
}

const ICONS = {
    'create-team': (
        <svg {...svgProps}>
            <path d="M5 3v18l7-4 7 4V3z" />
        </svg>
    ),
    suggestions: (
        <svg {...svgProps}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    solo: (
        <svg {...svgProps}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    gallery: (
        <svg {...svgProps}>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    ),
}

const QuickActions = ({ onChangeTab }) => {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {QUICK_ACTIONS.map((action) => (
                <button
                    key={action.id}
                    type="button"
                    onClick={() => onChangeTab(action.tab)}
                    className={`flex flex-col items-start justify-between gap-4 rounded-2xl px-4 py-4 min-h-[96px] text-left transition cursor-pointer ${
                        action.dark
                            ? 'bg-[#0f1b34] text-white hover:bg-[#152443] shadow-md'
                            : 'bg-white border border-gray-100 text-gray-900 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                >
                    <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            action.dark ? 'bg-white/10 text-white' : `${action.iconBg} ${action.iconColor}`
                        }`}
                    >
                        {ICONS[action.id]}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-tight">{action.label}</span>
                </button>
            ))}
        </section>
    )
}

export default QuickActions
