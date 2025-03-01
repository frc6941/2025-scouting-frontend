"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ChartNoAxesGantt, Binoculars, BookUser, Home, Settings, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";

import { getCookie, hasCookie } from "cookies-next/client";


//sub in with the ironpulse logo
const Logo = () => (
  <svg width="64" height="64" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
    <g id="Complete-Logo" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path 
        d="M104.845575,49.7371163 C104.813055,55.8855427 107.044497,59.8945443 111.539901,61.764121 C116.035304,63.6336978 120.448862,62.638843 124.780576,58.7795566 L134.151136,68.038844 C132.723827,69.9167075 131.76941,71.8845243 131.287887,73.9422945 C130.806364,76.0000646 130.806364,78.1109082 131.287887,80.2748252 L120.602131,84.7841039 C123.810708,91.7244828 124.347419,98.6142508 122.212267,105.453408 C119.009538,115.712143 107.760181,128.454031 88.0131958,122.339477 C74.8485391,118.263107 68.8359488,108.021488 69.975425,91.6146187 C62.9441199,91.595244 59.4284673,94.1972743 59.4284673,99.4207097 C59.4284673,104.644145 62.9441199,107.641355 69.975425,108.412341 C26.2691963,128.378519 4.41608191,138.361608 4.41608191,138.361608 C4.41608191,138.361608 57.3129195,109.321202 57.3129195,109.321202 C57.3129195,109.321202 56.2443626,107.77224 54.5145341,107.255863 C53.3613152,106.911611 51.9878601,106.911611 50.3941689,107.255863 L49.3644847,92.6950857 C54.6306264,92.3774355 57.9852873,89.8581378 59.4284673,85.1371927 C61.322641,78.9409523 57.1253245,74.184012 56.0463989,73.0915932 L55.9431519,72.9886721 C55.8526766,72.8999761 55.8017751,72.8542597 55.8017751,72.8542597 C55.8017751,72.8542597 59.3723784,68.6028996 66.5135849,60.1001795 C71.6199665,63.2023709 76.2404279,63.7570181 80.374969,61.764121 C84.5095102,59.7712239 87.0555858,55.7622224 88.0131958,49.7371163 L104.845575,49.7371163 Z M96.7112551,78.4296226 C86.266521,78.4296226 78.0795494,86.8270652 78.0795494,97.0166403 C78.0795494,107.206215 86.411009,115.428805 96.7112551,115.428805 C107.011501,115.428805 115.020115,107.206215 115.020115,97.0166403 C115.020115,86.8270652 107.155989,78.4296226 96.7112551,78.4296226 Z M69.2836091,71.993838 C66.380758,74.9585447 66.464092,79.2608287 69.2836091,82.480418 C69.8438056,83.1201029 70.8965654,83.687571 72.4418887,84.1828223 C73.6349051,82.0749701 75.0192702,80.1869947 76.5949838,78.518896 C78.1706975,76.8507974 79.9615109,75.3774319 81.967424,74.0987995 C80.913425,72.4155373 80.0375767,71.3303773 79.3398791,70.8433197 C75.9137794,68.4515843 72.1699276,69.0460162 69.2836091,71.993838 Z M113.032571,70.588935 C111.257778,71.7755907 110.491363,73.3296441 110.491363,73.3296441 C110.491363,73.3296441 114.032443,75.7262947 116.271609,78.0690681 C117.764386,79.630917 119.041913,81.4036486 120.10419,83.3872626 C121.489389,82.520752 122.404667,81.8023472 122.850022,81.2320482 C125.318726,78.0707549 125.103797,74.4175531 122.230298,71.3957286 C119.1757,68.1834572 115.393999,69.0100448 113.032571,70.588935 Z M96.2810303,60.4493521 C86.9680415,60.4493521 89.4750398,70.1281057 89.5952257,70.5731059 L89.5995601,70.588935 C89.5995601,70.588935 93.1122019,69.7373516 96.7089402,69.7373516 C99.1067658,69.7373516 101.504964,70.0212127 103.903535,70.588935 C105.17661,63.8292131 102.635776,60.4493521 96.2810303,60.4493521 Z" 
        id="Combined-Shape" 
        fill="currentColor"
      />
      <path 
        d="M70.028973,110.413596 C73.8913028,115.764498 77.1930296,119.28074 79.9341532,120.962322 C89.6269107,126.908484 101.528486,127.268475 110.260454,121.894351 C120.472849,115.609092 125.311099,105.460211 124.196375,93.3939908 C124.034559,91.6424259 123.42684,89.2024144 122.373217,86.0739564 L123.32398,85.5663656 C124.183434,87.488054 124.891509,90.0972624 125.448205,93.3939908 C125.947609,96.3514392 125.845914,99.1735187 125.448205,101.845157 C123.877899,112.393783 116.420477,120.383244 110.94447,123.052061 C104.534461,126.176077 99.2452276,127.178291 94.5016949,126.986014 C88.947185,126.760864 84.133415,124.839687 79.0317206,121.894351 C73.0401056,118.435242 69.0149546,110.933824 69.0149546,110.933824 C69.0149546,110.933824 69.3529607,110.760415 70.028973,110.413596 Z" 
        id="Path-16" 
        fill="currentColor"
      />
      <path 
        d="M67.0701368,111.885796 L60.9810925,114.558714 C61.2627577,116.272479 61.1479154,117.953593 60.6365659,119.602058 C60.1252163,121.250523 59.2231548,122.847655 57.9303813,124.393454 L68.4933723,134.893781 C72.8166346,132.311316 76.625081,131.698251 79.9187115,133.054586 C84.8591572,135.089088 86.0343173,142.117236 86.0343173,142.117236 C86.0343173,142.117236 102.418674,142.724541 102.418674,142.724541 C102.418674,142.724541 105.186457,135.582855 109.480439,133.838797 C112.343093,132.676091 116.41578,133.027752 121.698499,134.893781 C129.915047,127.241129 134.023321,123.414803 134.023321,123.414803 C134.023321,123.414803 128.762405,116.500287 132.282894,110.989924 C134.629886,107.316348 137.843062,105.47956 141.922419,105.47956 L142.540298,90.624943 C140.819994,90.3129086 139.282604,89.7836545 137.928128,89.0371806 C136.573652,88.2907068 135.458238,87.3579576 134.581887,86.2389332 L188.531769,57.5343964 L125.422017,84.5591079 C126.927812,89.0554634 127.739227,92.4374645 127.856263,94.7051111 C128.571458,108.562556 122.444007,119.305073 111.111396,125.415555 C101.286476,130.713098 87.8414622,130.335796 77.4679482,123.887599 C74.4486681,122.010808 70.982731,118.010207 67.0701368,111.885796 Z" 
        id="Path-17" 
        fill="currentColor"
      />
    </g>
  </svg>
);

export type JwtPayload = {
  name: string;
  sub: string;
  avatarUrl: string;
  roles: Role[];
};

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isLoggedIn = hasCookie("Authorization");
  const [userInfo, setUserInfo] = React.useState<JwtPayload | null>(null);

  const menuItems = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Pit Scouting", href: "/pit-scouting", icon: <BookUser className="w-5 h-5" /> },
    { name: "Scouting", href: "/scouting/step1", icon: <Binoculars className="w-5 h-5" /> },
    { name: "DashBoard", href: "/dashboard", icon: <Settings className="w-5 h-5" /> },
  ];

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn && window.location.pathname !== '/auth/feishu') {
      window.location.assign(`https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a71a0cebd21a900d&redirect_uri=${process.env.NEXT_PUBLIC_FEISHU_REDIRECT_URI}`);
      return;
    }

    // Try to get user info if logged in
    if (isLoggedIn && window.location.pathname !== '/auth/feishu') {
      try {
        const token = getCookie("Authorization");
        console.log(token);
        if (token) {
          const payload = jwtDecode<JwtPayload>(token);
          console.log(payload);
          setUserInfo(payload);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [isLoggedIn]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
      border-b border-gray-200 dark:border-zinc-800 
      bg-white/90 dark:bg-zinc-900/90 
      backdrop-blur-lg h-16">
      <div className="px-4 h-full mx-auto flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-lg
            text-gray-700 hover:bg-gray-100
            dark:text-zinc-100 dark:hover:bg-zinc-800/70"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo - Mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <Logo />
          <span className="font-bold text-gray-900 dark:text-zinc-100">IronPulse</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-gray-900 dark:text-zinc-100">IronPulse</span>
          </Link>

          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  transition-all duration-200
                  ${pathname === item.href 
                    ? 'text-gray-900 dark:text-zinc-100 font-semibold bg-gray-100 dark:bg-zinc-800' 
                    : 'text-gray-600 dark:text-zinc-400 font-normal hover:text-gray-900 hover:bg-gray-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/70'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Theme Switcher and Avatar */}
        <div className="flex justify-end gap-4">
          <div className="sm:flex hidden items-center">
            <ThemeSwitcher />
          </div>

          <div className="flex items-center">
            {userInfo?.avatarUrl && <img src={userInfo?.avatarUrl} onClick={()=>{
              window.location.assign(`https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a71a0cebd21a900d&redirect_uri=${process.env.NEXT_PUBLIC_FEISHU_REDIRECT_URI}`);
            }} alt="IronPulse" width={45} height={45} className="rounded-full" />}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden fixed inset-x-0 top-16 
            bg-white/95 dark:bg-zinc-900/95 
            backdrop-blur-lg 
            border-b border-gray-200 dark:border-zinc-800">
            <div className="px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${pathname === item.href 
                      ? 'text-gray-900 dark:text-zinc-100 font-semibold bg-gray-100 dark:bg-zinc-800' 
                      : 'text-gray-600 dark:text-zinc-400 font-normal hover:text-gray-900 hover:bg-gray-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/70'}
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 

