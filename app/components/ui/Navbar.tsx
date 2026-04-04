"use client";

import { useSyncExternalStore, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaXmark, FaCartShopping } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuth } from "@/app/features/auth/AuthContext";
import Image from "next/image";
import logo from "@/app/assets/logo.webp";
import { RootState } from "@/app/lib/redux/store";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  //const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const { user, logout } = useAuth();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Sticky shadow on scroll — this is why useEffect is needed:
  // we must attach a scroll listener to the window after mount.
  // There's no pure CSS / state way to detect scroll position without it.
  // useEffect(() => {
  //   const handleScroll = () => setScrolled(window.scrollY > 50);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // // Lock body scroll when mobile menu is open
  // useEffect(() => {
  //   document.body.style.overflow = toggle ? "hidden" : "";
  //   return () => { document.body.style.overflow = ""; };
  // }, [toggle]);

  const nav = () => setToggle((prev) => !prev);

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  function matchRoute(route: string) {
    return route === pathname;
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/product" },
    { label: "About", href: "/about" },
    { label: "Size", href: "/size" },
  ];

  return (
    <>
   
      <header
        // className={`sticky top-0 z-50 w-full transition-all shadow-md  duration-300 
        //   ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white" }
          
        //   ` } >
        className="sticky top-0 z-50 w-full transition-all shadow-md bg-white  duration-300" >
       
        <div className="h-2 w-full bg-[#7a0d20]" />

        <div className="mx-auto max-w-7xl pb-5 md:pb-2 px-6 md:px-10">
          <div className="flex h-16 items-center justify-between">

            <div className="flex items-center w-28">
            
              <button
                onClick={nav}
                aria-label="Toggle menu"
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {toggle ? <FaXmark size={12} />  : <FaBars size={12} />  }
              </button>

              {/* Desktop currency */}
              <div className="hidden md:block">
                <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-transparent text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7a0d20] cursor-pointer">
                  <option>NGN</option>
                  <option>EUR</option>
                  <option>CAN</option>
                </select>
              </div>
            </div>

        
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer flex-shrink-0"
            >
              <Image src={logo} alt="logo" className="w-16 md:w-14" loading="eager" />
            </div>

           
            <div className="flex items-center gap-4 w-28 justify-end">
              {/* Cart */}
              <button
                onClick={() => router.push("/cart")}
                aria-label="View cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaCartShopping size={14} />
                {mounted && cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#7a0d20] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="hidden md:block text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors" >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => router.push("/profile")}
                    className="text-sm font-medium hover:text-[#7a0d20] transition-colors"
                  >
                    {user.firstName}
                  </button>

                  {/* <button
                    onClick={handleSignOut}
                    className="text-[8px] font-medium w-[50px] rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200" >
                    Log Out
                  </button> */}
                </div>
              ) : (
                <button
                  onClick={() => router.push("/signin")}
                  className="text-[8px] font-medium px-4 py-1.5 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex justify-center pb-3">
            <ul className="flex gap-8">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => router.push(href)}
                    className={`relative text-sm font-semibold pb-1 transition-colors group ${
                      matchRoute(href) ? "text-[#7a0d20]" : "text-gray-700 hover:text-[#7a0d20]"
                    }`}
                  >
                    {label}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#7a0d20] transition-all duration-300 ${
                        matchRoute(href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

    
      {/* Backdrop */}
      {/* <div
        onClick={nav}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          toggle ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      /> */}

      {/* Slide-in drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          toggle ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Image src={logo} alt="logo" className="w-12" loading="eager" />
          <button
            onClick={nav}
            aria-label="Close menu"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaXmark size={16} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 px-6 pt-6">
          <ul className="space-y-1">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <button
                  onClick={() => { nav(); router.push(href); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    matchRoute(href)
                      ? "bg-[#7a0d20]/10 text-[#7a0d20]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer: auth */}
        <div className="px-6 pb-8 border-t border-gray-100 pt-6 space-y-2">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <button
                  onClick={() => { nav(); router.push("/admin"); }}
                  className="w-full text-sm bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => { nav(); router.push("/profile"); }}
                className="w-full text-left text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {user.firstName} Profile
              </button>
              <button
                onClick={async () => { nav(); await handleSignOut(); }}
                className="w-full text-left text-sm text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { nav(); router.push("/signin"); }}
              className="w-full text-sm font-semibold border border-gray-900 px-4 py-2 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              Log In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}