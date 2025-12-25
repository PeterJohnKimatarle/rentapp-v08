'use client';



import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import { Home, Search, Settings, Phone, Info, PlusCircle, Heart, Building, User, LogIn, ShieldCheck, LogOut } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

import { useState, useEffect } from 'react';



interface NavigationProps {

  variant?: 'default' | 'popup';

  onItemClick?: () => void;

  onSearchClick?: () => void;

  onLoginClick?: () => void;

  onLogoutClick?: () => void;

  onHomeClick?: () => void;

  onInstallClick?: () => void;

}



export default function Navigation({ variant = 'default', onItemClick, onSearchClick, onLoginClick, onLogoutClick, onHomeClick, onInstallClick }: NavigationProps) {

  const pathname = usePathname();

  const router = useRouter();

  const { isAuthenticated, user, endSession, isImpersonating, logout } = useAuth();

  const isStaff = user?.role === 'staff';

  const isApprovedStaff = isStaff && user?.isApproved === true;

  const isAdmin = user?.role === 'admin';


  const [isEndingSession, setIsEndingSession] = useState(false);

  // PWA detection - check if running as standalone app
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      // Check for iOS Safari standalone mode
      const isIOSStandalone = (window.navigator as any).standalone === true;

      // Check for Android/Chrome standalone mode
      const isAndroidStandalone = window.matchMedia('(display-mode: standalone)').matches;

      // Check for other browsers standalone mode
      const isOtherStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                               window.matchMedia('(display-mode: fullscreen)').matches ||
                               window.matchMedia('(display-mode: minimal-ui)').matches;

      setIsStandalone(isIOSStandalone || isAndroidStandalone || isOtherStandalone);
    };

    checkStandalone();

    // Listen for display mode changes (for dynamic PWA installations)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    return () => {
      mediaQuery.removeEventListener('change', checkStandalone);
    };
  }, []);



  const handleEndSession = async () => {

    setIsEndingSession(true);

    try {

      await endSession();

    } catch (error) {

      console.error('Error ending session:', error);

    } finally {

      setIsEndingSession(false);

    }

  };



  const handleNavClick = () => {

    if (variant === 'popup' && onItemClick) {

      onItemClick();

    }

    if (onHomeClick) {

      onHomeClick();

    }

  };



  return (
    <>
    <nav className="p-4 lg:p-6">

      {/* Logo removed as requested */}



      {/* Navigation Links */}

      <div className={`space-y-2 lg:space-y-2 ${variant === 'popup' ? 'flex flex-col items-start space-y-2 pt-0 pb-0' : ''}`}>

        <Link 

          href="/" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Home size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Home</span>

        </Link>



        <a 

          href="#" 

          onClick={(e) => {

            e.preventDefault();

            if (variant === 'popup' && onItemClick) {

              onItemClick();

            }

            if (onSearchClick) {

              onSearchClick();

            }

          }}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Search size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Search</span>

        </a>

        

        <Link 

          href="/services" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/services' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Settings size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Our Services</span>

        </Link>

        

        <Link 

          href="/contact" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/contact' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Phone size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Contact Info</span>

        </Link>

        

        <Link 

          href="/about" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/about' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Info size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">About Us</span>

        </Link>

        

        <Link 

          href="/list-property" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/list-property' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <PlusCircle size={20} className="flex-shrink-0" />

          <span className="text-base font-medium relative">

            List Your Property

            <span className="absolute bottom-0 left-0 right-0 h-px bg-current transform scale-x-105 origin-left -translate-x-0.75"></span>

          </span>

        </Link>



        <Link 

          href="/bookmarks" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/bookmarks' || pathname === '/recently-removed-bookmarks'

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Heart size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Bookmarks</span>

        </Link>



        <Link 

          href="/my-properties" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/my-properties' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Building size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">My Properties</span>

        </Link>



        {isApprovedStaff && (

          <Link 

            href="/staff" 

            onClick={handleNavClick}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

                : pathname === '/staff' 

                  ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                  : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

            }`}

          >

            <ShieldCheck size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Staff Portal</span>

          </Link>

        )}



        {isAdmin && (

          <Link 

            href="/admin" 

            onClick={handleNavClick}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? pathname === '/admin'
                  ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100'
                  : 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

                : pathname === '/admin' 

                  ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                  : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

            }`}

          >

            <ShieldCheck size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Admin Portal</span>

          </Link>

        )}



        {isImpersonating && (

          <button

            onClick={() => {

              if (variant === 'popup' && onItemClick) {

                onItemClick();

              }

              handleEndSession();

            }}

            disabled={isEndingSession}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed' 

                : 'text-red-600 hover:text-red-700 hover:bg-yellow-500 rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed'

            }`}

          >

            <LogOut size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">{isEndingSession ? 'Ending...' : 'End Session'}</span>

          </button>

        )}

        

        <Link 

          href="/profile" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/profile' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <User size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Profile</span>

        </Link>



        {/* Authentication Section */}

        {!isAuthenticated && (

          <button

            onClick={() => {

              if (variant === 'popup' && onItemClick) {

                onItemClick();

              }

              if (onLoginClick) {

                onLoginClick();

              }

            }}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'

            }`}

          >

            <LogIn size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Login/Register</span>

          </button>

        )}

        {isAuthenticated && (

          <button

            onClick={() => {

              if (onLogoutClick) {

                onLogoutClick();

              } else {

                // Fallback to direct logout if no handler provided

                if (variant === 'popup' && onItemClick) {

                  onItemClick();

                }

                const wasAdmin = isAdmin;

                logout();

                if (wasAdmin) {

                  router.push('/');

                }

              }

            }}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'

            }`}

          >

            <LogOut size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Logout</span>

          </button>

        )}

        {/* Test One Button - Only show when not running as standalone PWA */}
        {variant === 'popup' && !isStandalone && (
          <button
            onClick={() => {
              if (onInstallClick) {
                onInstallClick();
              }
            }}
            className="flex items-center space-x-3 text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-test-tube flex-shrink-0" aria-hidden="true">
              <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"></path>
              <path d="M8.5 2h7"></path>
              <path d="M14.5 16h-5"></path>
            </svg>
            <span className="text-base font-medium">Test One</span>
          </button>
        )}

        {/* Close and Home Buttons - Only in popup mode */}

        {variant === 'popup' && (

          <div className="flex space-x-2 w-full">

            <button

              onClick={() => {

                if (onItemClick) {

                  onItemClick();

                }

                if (onHomeClick) {

                  onHomeClick();

                }

              }}

              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"

              style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}

              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}

              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.8)'}

            >

              Home

            </button>

            <button

              onClick={() => {

                if (onItemClick) {

                  onItemClick();

                }

              }}

              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"

              style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}

              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}

              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}

            >

              Close

            </button>

          </div>

        )}

      </div>

    </nav>
    </>
  );

}

