import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">HalalScan</h3>
            <p className="text-foreground/80">
              Your trusted companion for halal product verification. Scan, verify, and shop with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-foreground/80 hover:text-primary transition-colors">
                  Scan
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-foreground/80">Email: info@halalscan.com</li>
              <li className="text-foreground/80">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} HalalScan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 