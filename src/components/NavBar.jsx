import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/weight', label: 'Weight', icon: '⚖️' },
  { to: '/waist', label: 'Waist', icon: '📏' },
  { to: '/training', label: 'Train', icon: '💪' },
  { to: '/food', label: 'Food', icon: '🍽️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function NavBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around
                 pb-[env(safe-area-inset-bottom)] z-50"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-2 px-1.5 text-[10px] ${
              isActive ? 'text-accent' : 'text-text-dim'
            }`
          }
        >
          <span className="text-base leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
