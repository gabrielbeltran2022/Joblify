import { navdata } from "../../component-data/Navbar";
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import type { User } from "../../api/userApi";
import { Loading } from "../loading/Loading";

interface NavbarProps {
  user: User | null;
  loading: boolean;
  onLogout: () => void;
}

export const Navbar = ({ user, loading, onLogout }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use your imported Loading component when session is loading
  if (loading) {
    return <Loading isLoading={loading} />;
  }

  // Combine firstName and lastName cleanly
  const fullName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user?.email;

  const userId = user?._id || (user as any)?.id ;

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-20">
        
        {/* Brand / Logo */}
        <div className="flex items-center">
          <NavLink to={'/'} className="font-bold text-xl text-slate-800 flex items-center">
            {navdata[0]?.img ? (
              <img 
                src={navdata[0].img} 
                alt="Joblify Logo" 
                className="h-16 w-auto object-contain" 
              />
            ) : (
              <span className="font-bold text-xl text-slate-800">{navdata[0]?.title || 'Joblify'}</span>
            )}  
          </NavLink>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-10 font-medium">
          {navdata.slice(1, 3).map((item) => (
            <NavLink 
              to={item.link} 
              key={item.id} 
              className={({ isActive }) => 
                isActive 
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 py-1" 
                  : "text-slate-600 hover:text-slate-900 transition py-1"
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-slate-800 font-semibold text-sm sm:text-base hover:text-blue-600 transition cursor-pointer py-2 focus:outline-none"
              >
                <span>{fullName}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  {userId && (
                    <NavLink
                    to={`/profile/${userId}`}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 font-medium transition cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </NavLink>
                  )}

                  <hr className="border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink 
                to={navdata[3]?.link || "/login"} 
                className="text-slate-700 hover:text-black font-medium text-sm sm:text-base px-2 py-1"
              >
                {navdata[3]?.title || "Login"}
              </NavLink>

              <NavLink 
                to={navdata[4]?.link || "/login"} 
                className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition"
              >
                {navdata[4]?.title || "Register"}
              </NavLink>
            </div>
          )}
        </div>

      </div>
    </nav>
  ); 
};