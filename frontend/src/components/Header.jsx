import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  // Чтобы обновлять header при login/logout на других страницах
  useEffect(() => {
    const onStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              HalalScan
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Главная
            </Link>
            <Link to="/scan" className="text-foreground hover:text-primary transition-colors">
              Скан
            </Link>
            <Link to="/history" className="text-foreground hover:text-primary transition-colors">
              История
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
              Профиль
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors hidden sm:inline-flex"
                >
                  Logout
                </button>
                <button
                  onClick={handleLogout}
                  className="sm:hidden text-red-600 hover:text-primary transition-colors"
                  aria-label="Выйти"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <>
            <Link
              to="/login"
              className="text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 