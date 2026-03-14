import { useEffect, useState } from 'react';
import { IconChevronDown, IconMenu, IconX, IconUserCircle, IconChartBar, IconActivity, IconBrain, IconBook2, IconSettings, IconLogout } from '@tabler/icons-react';
import { Avatar, Divider, Menu } from '@mantine/core';
import NavLinks from './navlinks';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../../store/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';

const MARK_SUFFIX = 'Mark';
const BRAND_STATES = ['Question', 'Q', '?'];

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((store: any) => store.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandIndex, setBrandIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    const currentWord = BRAND_STATES[brandIndex];

    const timerId = window.setTimeout(() => {
      if (!isDeleting && typedLength < currentWord.length) {
        setTypedLength((current) => current + 1);
        return;
      }

      if (!isDeleting && typedLength === currentWord.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedLength > 0) {
        setTypedLength((current) => current - 1);
        return;
      }

      if (isDeleting && typedLength === 0) {
        setIsDeleting(false);
        setBrandIndex((current) => (current + 1) % BRAND_STATES.length);
      }
    }, !isDeleting && typedLength === currentWord.length ? 1100 : isDeleting ? 70 : 110);

    return () => window.clearTimeout(timerId);
  }, [brandIndex, isDeleting, typedLength]);

  const lead = BRAND_STATES[brandIndex].slice(0, typedLength);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("local-storage"));
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-mine-shaft-950/50 backdrop-blur-sm backdrop-saturate-200 text-white">
      {/* Top Header */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div
            className="brand-wordmark text-2xl md:text-3xl"
            aria-label={`${BRAND_STATES[brandIndex]}${MARK_SUFFIX}`}
          >
            <span className="brand-wordmark__lead">{lead}</span>
            <span className="brand-wordmark__mark">{MARK_SUFFIX}</span>
            {/* <span className="brand-wordmark__caret" aria-hidden="true" /> */}
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
            <Menu shadow="md" width={260} position="bottom-end" withArrow>
              <Menu.Target>
                <button className="flex items-center gap-2 rounded-full border border-mine-shaft-700 bg-mine-shaft-900/80 px-2 py-1 hover:bg-mine-shaft-800 transition-colors">
                  <Avatar
                    src={null}
                    alt={userData?.name}
                    color="yellow"
                    radius="xl"
                    size="sm"
                  >
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm leading-none">{userData?.name}</div>
                    <div className="text-[11px] text-mine-shaft-400 mt-1">Workspace</div>
                  </div>
                  <IconChevronDown size={16} className="text-mine-shaft-400" />
                </button>
              </Menu.Target>

              <Menu.Dropdown className="bg-mine-shaft-900 border border-mine-shaft-700 text-white">
                <Menu.Label>Profile</Menu.Label>
                <Menu.Item leftSection={<IconUserCircle size={16} />} onClick={() => navigate('/profile')}>
                  My Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconActivity size={16} />} onClick={() => navigate('/dashboard/activity')}>
                  Activity
                </Menu.Item>
                <Menu.Item leftSection={<IconChartBar size={16} />} onClick={() => navigate('/dashboard/quiz-performance')}>
                  Performance
                </Menu.Item>
                <Menu.Item leftSection={<IconBrain size={16} />} onClick={() => navigate('/questions/analytics')}>
                  Question Analytics
                </Menu.Item>
                <Menu.Item leftSection={<IconBook2 size={16} />} onClick={() => navigate('/about')}>
                  About
                </Menu.Item>
                <Divider my={6} color="#4f4f4f" />
                <Menu.Label>Workspace</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={16} />} onClick={() => navigate('/profile#master-settings')}>
                  Subject Library
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

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
          {userData && (
            <div className="mt-4 rounded-lg border border-mine-shaft-800 bg-mine-shaft-900/80 p-3 space-y-2">
              <button className="block text-left w-full text-sm hover:text-bright-sun-400" onClick={() => { closeMenu(); navigate('/dashboard/activity'); }}>
                Activity
              </button>
              <button className="block text-left w-full text-sm hover:text-bright-sun-400" onClick={() => { closeMenu(); navigate('/dashboard/quiz-performance'); }}>
                Performance
              </button>
              <button className="block text-left w-full text-sm hover:text-bright-sun-400" onClick={() => { closeMenu(); navigate('/questions/analytics'); }}>
                Question Analytics
              </button>
              <button className="block text-left w-full text-sm hover:text-bright-sun-400" onClick={() => { closeMenu(); navigate('/profile#master-settings'); }}>
                Subject Library
              </button>
              <button className="block text-left w-full text-sm hover:text-bright-sun-400" onClick={() => { closeMenu(); navigate('/about'); }}>
                About
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
