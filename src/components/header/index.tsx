import { useEffect, useState } from 'react';
import { IconBell, IconSettings, IconMenu } from '@tabler/icons-react';
import { Avatar, Indicator } from '@mantine/core';
import NavLinks from './navlinks';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../utils/Utility';
import { setUserData } from '../../store/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';


const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userData, loading } = useSelector((store: any) => store.user)


  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [userdata, setUserdata] = useState<any>(null);


  console.log("getUserData",userData);

  // Sync localStorage to store
  useEffect(() => {
    const updateFromLocalStorage = () => {
      const stored = localStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      dispatch(setUserData(parsed));
      console.log("🔄 Updated userData from localStorage:", parsed);
    };

    // Initial load
    updateFromLocalStorage();

    // Listen to changes (same tab)
    window.addEventListener("local-storage", updateFromLocalStorage);

    // Listen to changes (other tabs)
    window.addEventListener("storage", updateFromLocalStorage);

    return () => {
      window.removeEventListener("local-storage", updateFromLocalStorage);
      window.removeEventListener("storage", updateFromLocalStorage);
    };
  }, [dispatch]);
  

  return (
    <header className="w-full bg-mine-shaft-950 text-white">
      {/* Top Header */}
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=> navigate("/")}>
          <div className="text-2xl md:text-4xl font-bold text-bright-sun-400">
            <span className="text-white"> </span> Q<span className="text-white">Mark</span>
          </div>
        </div>

        {/* Desktop NavLinks */}
        <div className="hidden md:block" >
          <NavLinks />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {!userData? <button  onClick={()=>navigate("/login")} className="border px-4 py-1 rounded-full bg-mine-shaft-800 hover:cursor-pointer hover:bg-bright-sun-500">
            Login
          </button>
            :
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 hover:cursor-pointer"
            >
              <span className="hidden md:inline">{userData?.name}</span>
              <Avatar src="avatar.png" alt="it's me" />
            </div>}
          <IconSettings
            stroke={2}
            className="rounded-full p-1 h-7 w-7 bg-mine-shaft-800"
          />
          <Indicator color="bright-sun.4" size={8} offset={7}>
            <IconBell stroke={2} className="bg-mine-shaft-800 rounded-full p-1 h-7 w-7" />
          </Indicator>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <IconMenu stroke={2} className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile NavLinks */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <NavLinks />
        </div>
      )}
    </header>
  );
};

export default Header;
