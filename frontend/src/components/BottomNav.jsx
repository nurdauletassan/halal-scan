import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, User, History } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/scan', label: 'Скан', icon: Camera },
  { to: '/history', label: 'История', icon: History },
  { to: '/profile', label: 'Профиль', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex md:hidden justify-around items-center h-16">
      {navItems.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive ? 'text-green-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Icon className={`h-6 w-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-1'}`} />
            <span className="text-xs leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 