"use client";

import { useSyncExternalStore, useEffect, useState } from "react";
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
  const [slide, setSlide] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const { user, logout } = useAuth();

  // Replaces setMounted(true) in useEffect — no setState in effect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const nav = () => setToggle(!toggle);

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  function matchRoute(route: string) {
    return route === pathname;
  }

  useEffect(() => {
    const handleSlide = () => setSlide(window.scrollY >= 0);
    window.addEventListener("scroll", handleSlide);
    return () => window.removeEventListener("scroll", handleSlide);
  }, []);

  return (
    <div className={
      slide
        ? "sticky top-0 shadow-xl transition-all duration-1000 bg-white z-50"
        : ""
    }>
      <div className="flex bg-[#7a0d20] justify-center p-3" />

      <div className="container mx-auto px-10 pb-5 md:px-20">
        <div className="flex justify-between items-center">

          {/* Left */}
          <div>
            <div className="md:hidden cursor-pointer flex gap-10">
              {!toggle ? <FaBars onClick={nav} size={20} /> : <FaXmark onClick={nav} size={20} />}
            </div>
            <div className="md:block hidden">
              <select className="p-2 rounded-lg text-[10px]">
                <option>NGN</option>
                <option>EUR</option>
                <option>CAN</option>
              </select>
            </div>
          </div>

          {/* Logo */}
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image src={logo} alt="logo" className="w-20 md:w-16" loading="eager" />
          </div>

          {/* Right */}
          <div className="flex items-center lg:gap-[50px] gap-8">
            <div className="flex items-center space-x-4">

              {/* Cart */}
              <div className="flex cursor-pointer p-2">
                <FaCartShopping size={20} onClick={() => router.push("/cart")} />
                {mounted && cartItems.length > 0 && (
                  <p className="bg-green-400 ml-4 mt-[-5px] rounded-full text-sm w-4 h-5 text-center absolute">
                    {cartItems.length}
                  </p>
                )}
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg"
                    >
                      Admin
                    </button>
                  )}
                  <button onClick={() => router.push("/profile")}>{user.firstName}</button>
                  <button onClick={handleSignOut}>Log Out</button>
                </div>
              ) : (
                <button onClick={() => router.push("/signin")}>Log In</button>
              )}

            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {toggle && (
          <ul className="absolute bg-slate-200 w-full px-10 py-5 left-0">
            <li onClick={() => { nav(); router.push("/"); }}>Home</li>
            <li onClick={() => { nav(); router.push("/product"); }}>Shop</li>
            <li onClick={() => { nav(); router.push("/about"); }}>About</li>
            <li onClick={() => { nav(); router.push("/size"); }}>Size</li>
          </ul>
        )}

        {/* Desktop */}
        <div className="md:flex justify-center hidden">
          <ul className="flex space-x-10 cursor-pointer">
            <li onClick={() => router.push("/")} className={matchRoute("/") ? "text-slate-400" : ""}>Home</li>
            <li onClick={() => router.push("/product")} className={matchRoute("/product") ? "text-slate-400" : ""}>Shop</li>
            <li onClick={() => router.push("/about")} className={matchRoute("/about") ? "text-slate-400" : ""}>About</li>
            <li onClick={() => router.push("/size")} className={matchRoute("/size") ? "text-slate-400" : ""}>Size</li>
          </ul>
        </div>
      </div>
    </div>
  );
}