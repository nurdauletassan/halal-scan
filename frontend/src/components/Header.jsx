import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = () => {
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
              Home
            </Link>
            <Link to="/scan" className="text-foreground hover:text-primary transition-colors">
              Scan
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-600 hover:text-primary">
              <User className="h-6 w-6" />
            </Link>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 