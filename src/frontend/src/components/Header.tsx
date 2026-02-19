import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate({ to: '/' });
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-black/60 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="logo">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-cyan transition-colors duration-300"
            >
              Tesla
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white font-bold hover:text-cyan transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white font-bold hover:text-cyan transition-colors duration-300"
            >
              Features
            </button>
            <Link
              to="/cars"
              className="text-white font-bold hover:text-cyan transition-colors duration-300"
            >
              Cars
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="text-white font-bold hover:text-cyan transition-colors duration-300"
              >
                Admin
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-white font-bold hover:text-cyan transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white font-bold hover:text-cyan transition-colors duration-300"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-white font-bold hover:text-cyan transition-colors duration-300"
                >
                  {userProfile?.id ? 'Profile' : 'Profile'}
                </Link>
                <LoginButton />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
