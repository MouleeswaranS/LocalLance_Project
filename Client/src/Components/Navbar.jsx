import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import Logo from "./Logo";

export default function Navbar({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Check if refs are available before animating
    if (!navbarRef.current || !logoRef.current || !linksRef.current) return;

    const tl = gsap.timeline();

    // Animate navbar entrance
    gsap.set([logoRef.current, linksRef.current], {
      opacity: 0,
      y: -30,
    });

    const initialBgColor = isHomePage ? "rgba(255, 255, 255, 1)" : "rgba(15, 23, 42, 0.95)";

    tl.to(navbarRef.current, {
      backgroundColor: initialBgColor,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      )
      .to(
        linksRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

    // Add scroll effect
    const handleScroll = () => {
      if (!isHomePage) {
        const scrolledBgColor = "rgba(15, 23, 42, 0.98)";
        const defaultBgColor = "rgba(15, 23, 42, 0.95)";

        if (window.scrollY > 50) {
          gsap.to(navbarRef.current, {
            backgroundColor: scrolledBgColor,
            backdropFilter: "blur(24px)",
            duration: 0.3,
          });
        } else {
          gsap.to(navbarRef.current, {
            backgroundColor: defaultBgColor,
            backdropFilter: "blur(16px)",
            duration: 0.3,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.kill();
    };
  }, [isHomePage]);

  const handleLogout = () => {
    // Temporary logout navigation (will connect to backend later)
    navigate("/");
  };

  return (
    <nav ref={navbarRef} className={`fixed top-0 left-0 w-full ${isHomePage ? 'bg-white shadow-lg' : 'backdrop-blur-lg shadow-lg bg-gradient-to-r from-slate-900/95 to-slate-800/95'} z-50 border-b ${isHomePage ? 'border-gray-200' : 'border-slate-700/30'}`} style={{ backgroundColor: isHomePage ? 'rgba(255, 255, 255, 1)' : 'rgba(15, 23, 42, 0.95)' }}>
      <div className={`max-w-7xl mx-auto px-6 py-3 flex justify-between items-center ${isHomePage ? 'text-black' : 'text-white'}`}>
        {/* Logo */}
        <Link
          ref={logoRef}
          to="/"
          className={`hover:scale-105 transition-transform duration-300 ${isHomePage ? 'text-black' : 'text-white'}`}
        >
          <Logo size="text-xl" isHomePage={isHomePage} />
        </Link>

        {/* Desktop Links */}
        <div ref={linksRef} className="hidden md:flex items-center gap-6 font-medium">
          {role === "client" ? (
            <>
              <Link
                to="/client/dashboard"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                Dashboard
              </Link>
              <Link
                to="/client/browse"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                Browse Freelancers
              </Link>
              <Link
                to="/client/bookings"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                My Bookings
              </Link>
            </>
          ) : role === "freelancer" ? (
            <>
              <Link
                to="/freelancer/dashboard"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                Dashboard
              </Link>
              <Link
                to="/freelancer/services"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                My Services
              </Link>
              <Link
                to="/freelancer/bookings"
                className="hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
              >
                Bookings
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`${isHomePage ? 'text-black hover:text-blue-600' : 'hover:text-yellow-300'} transition-colors duration-300 hover:scale-105 transform`}>
                Home
              </Link>
              <Link to="/login" className={`${isHomePage ? 'text-black hover:text-blue-600' : 'hover:text-yellow-300'} transition-colors duration-300 hover:scale-105 transform`}>
                Login
              </Link>
              <Link to="/signup" className={`${isHomePage ? 'text-black hover:text-blue-600' : 'hover:text-yellow-300'} transition-colors duration-300 hover:scale-105 transform`}>
                Signup
              </Link>
            </>
          )}

          {/* Logout Button */}
          {(role === "client" || role === "freelancer") && (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 rounded-lg hover:opacity-80 font-semibold transition-all duration-300 hover:scale-105 transform"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center space-y-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 ${isHomePage ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`w-6 h-0.5 ${isHomePage ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`w-6 h-0.5 ${isHomePage ? 'bg-black' : 'bg-white'}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`md:hidden backdrop-blur-lg flex flex-col items-center py-6 space-y-4 font-medium border-t ${isHomePage ? 'bg-white text-black border-gray-200' : 'bg-gradient-to-r from-slate-900/95 to-slate-800/95 text-white border-slate-700/30'}`}>
          {role === "client" ? (
            <>
              <Link
                to="/client/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                Dashboard
              </Link>
              <Link
                to="/client/browse"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                Browse Freelancers
              </Link>
              <Link
                to="/client/bookings"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                My Bookings
              </Link>
            </>
          ) : role === "freelancer" ? (
            <>
              <Link
                to="/freelancer/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                Dashboard
              </Link>
              <Link
                to="/freelancer/services"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                My Services
              </Link>
              <Link
                to="/freelancer/bookings"
                onClick={() => setMenuOpen(false)}
                className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}
              >
                Bookings
              </Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}>
                Home
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className={`${isHomePage ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-yellow-300 hover:bg-white/10'} transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center`}>
                Signup
              </Link>
            </>
          )}

          {(role === "client" || role === "freelancer") && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 rounded-lg hover:opacity-80 font-semibold transition-all duration-300 w-full text-center"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
