import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import profileIcon from '../assets/images/profile.png';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-yellow-500">Done-It</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {!user ? (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={user.user_type === 'customer' ? '/customer/dashboard' : '/worker/dashboard'}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Dashboard
                                </Link>
                                {user.user_type === 'customer' && (
                                    <>
                                        <Link
                                            to="/service/request"
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            New Request
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center"
                                        >
                                            <img
                                                src={profileIcon}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
                                            />
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;