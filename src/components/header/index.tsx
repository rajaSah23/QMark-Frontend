import { useEffect, useState } from 'react';
import { IconBell, IconSettings, IconMenu, IconX } from '@tabler/icons-react';
import { Avatar, Indicator } from '@mantine/core';
import NavLinks from './navlinks';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../../store/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((store: any) => store.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync localStorage to store
  useEffect(() => {
    const updateFromLocalStorage = () => {
      const stored = localStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      dispatch(setUserData(parsed));
    };
    updateFromLocalStorage();
    window.addEventListener("local-storage", updateFromLocalStorage);
    window.addEventListener("storage", updateFromLocalStorage);
    return () => {
      window.removeEventListener("local-storage", updateFromLocalStorage);
      window.removeEventListener("storage", updateFromLocalStorage);
    };
  }, [dispatch]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-mine-shaft-950/50 backdrop-blur-sm backdrop-saturate-200 text-white">
      {/* Top Header */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="text-2xl md:text-3xl font-bold text-bright-sun-400">
            Q<span className="text-white">Mark</span>
          </div>
        </div>

        {/* Desktop NavLinks */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {!userData ? (
            <button
              onClick={() => navigate("/login")}
              className="border px-4 py-1 rounded-full bg-mine-shaft-800 hover:cursor-pointer hover:bg-bright-sun-500 transition-colors text-sm"
            >
              Login
            </button>
          ) : (
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 hover:cursor-pointer"
            >
              <span className="hidden md:inline text-sm">{userData?.name}</span>
              <Avatar
                src={null}
                alt={userData?.name}
                color="yellow"
                radius="xl"
                size="sm"
              >
                {userData?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </div>
          )}

          {/* Settings – navigates to Master Settings in profile */}
          <button
            onClick={() => navigate('/profile#master-settings')}
            title="Master Settings"
            className="rounded-full p-1 h-7 w-7 bg-mine-shaft-800 hover:bg-mine-shaft-700 transition-colors flex items-center justify-center"
          >
            <IconSettings stroke={2} size={16} />
          </button>

          {/* Notification bell – visual indicator only for now */}
          <button
            className="rounded-full p-1 h-7 w-7 bg-mine-shaft-800 hover:bg-mine-shaft-700 transition-colors flex items-center justify-center"
            title="Notifications"
          >
            <IconBell stroke={2} size={16} />
          </button>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded hover:bg-mine-shaft-800 transition-colors"
            >
              {menuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile NavLinks */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-mine-shaft-800">
          <NavLinks onLinkClick={closeMenu} />
        </div>
      )}
    </header>
  );
};

export default Header;
