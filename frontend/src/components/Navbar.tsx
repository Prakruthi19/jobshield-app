import React from 'react'
import { useNavigate } from "react-router-dom";
import theme from '../theme';
type Props = {}

const Navbar = (props: Props) => {
  const navigate = useNavigate();
  return (
    <>
<nav className="w-full top-0 left-0 right-0 z-20 shadow-md fixed" style={{ backgroundColor: theme.palette.primary.main }}>
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    
    {/* Logo */}
    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
       <img
        src="https://static.thenounproject.com/png/job-search-icon-65915-512.png"
        className="h-8 invert brightness-0"
        alt="Job Logo"
        color='#FFFF'
        />
      <span className="self-center text-2xl font-semibold whitespace-nowrap" style={{ color: theme.palette.background.paper }}>
        JobTrust
      </span>
    </a>

    {/* Right Buttons */}
    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button
        onClick={() => navigate('/register')}
        type="button"
        className="font-medium rounded-lg text-sm px-4 py-2 text-center border-none outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main
        }}
      >
        Get Started
      </button>
    </div>

    {/* Navbar Links */}
    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <li>
          <a
            href="#"
            className="block py-2 px-3 md:p-0 rounded-sm"
            style={{ color: theme.palette.background.paper }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-3 md:p-0 rounded-sm hover:underline"
            style={{ color: theme.palette.background.paper }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-3 md:p-0 rounded-sm hover:underline"
            style={{ color: theme.palette.background.paper }}
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-3 md:p-0 rounded-sm hover:underline"
            style={{ color: theme.palette.background.paper }}
          >
            Contact
          </a>
        </li>
      </ul>
    </div>

  </div>
</nav>

</>
  )
}
export default Navbar;