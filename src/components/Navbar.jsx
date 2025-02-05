import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from "../assets/images/logo.webp";
import { login } from '../store/authSlice';
import axios from 'axios';

function Navbar() {
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector(state => state.auth.userData);
    const location = useLocation();

    React.useEffect(() => {
        axios.get("http://localhost:8080/profile", {
            withCredentials: true
        })
            .then(res => {
                const data = res.data;
                dispatch(login(data));
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, [dispatch]);

    // Override authStatus to false if the route is /login or /signup
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const effectiveAuthStatus = isAuthPage ? 'false' : authStatus;

    return (
      <nav className="w-full absolute top-0 z-10 bg-zinc-700 bg-opacity-40 p-2">
      <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center text-gray-800 text-2xl font-semibold">
              <Link to="/" className="mr-2">
                  <img src={logo} width={40} alt="Logo"/>
              </Link>
              <span className='text-white'>chess master</span>
          </div>
          <ul className="flex space-x-8">
              <li>
                  <Link
                      to="/"
                      className="text-white text-md md:text-xl hover:text-green-500 transition duration-300 ease-in-out"
                  >
                      Home
                  </Link>
              </li>
              {effectiveAuthStatus === "true" && userData.username ? (
                  <>
                      <li>
                          <Link
                              to="/modeselector"
                              className="text-white text-md md:text-xl hover:text-green-500 transition duration-300 ease-in-out"
                          >
                              Mode
                          </Link>
                      </li>
                      <li>
                          <Link
                              to="/puzzle"
                              className="text-white text-md md:text-xl hover:text-green-500 transition duration-300 ease-in-out"
                          >
                              Puzzles
                          </Link>
                      </li>
                      <li>
                          <Link
                              to="/profile"
                              className="text-green-600 text-md md:text-xl hover:text-green-500 transition duration-300 capitalize ease-in-out"
                          >
                              {userData ? userData.username.split(" ")[0] : "Profile"}
                          </Link>
                      </li>
                  </>
              ) : (
                  <>
                      <li>
                          <Link
                              to="/signup"
                              className="text-white text-md md:text-xl hover:text-green-500 transition duration-300 ease-in-out"
                          >
                              SignUp
                          </Link>
                      </li>
                      <li>
                          <Link
                              to="/login"
                              className="text-white text-md md:text-xl hover:text-green-500 transition duration-300 ease-in-out"
                          >
                              Login
                          </Link>
                      </li>
                  </>
              )}
          </ul>
      </div>
  </nav>
);
}

export default Navbar;