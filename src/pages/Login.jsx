import { motion } from "framer-motion";
import {
    Store,
    User,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Toaster, toast } from "react-hot-toast";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {

        if (!username || !password) {
            toast.error("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post("/Auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            toast.success("Login successful!");

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {
                toast.error(error.response?.data || "Invalid username or password.");
            } else {
                toast.error("Unable to connect to the server.");
            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#ffffff",
                        color: "#1F2937",
                        border: "1px solid #E5E7EB",
                    },
                }}
            />

            <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">

                {/* LEFT SIDE */}

                <div className="hidden lg:flex w-1/2 bg-white px-16 py-12 flex-col justify-between border-r border-gray-100">

                    {/* Logo */}

                    <div className="flex items-center gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-[#E0E7FF] flex items-center justify-center">

                            <Store
                                size={32}
                                className="text-[#1E3A8A]"
                            />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">

                                CLEOFER STORE

                            </h1>

                            <p className="text-gray-500 mt-1">

                                Customer Debt Management System

                            </p>

                        </div>

                    </div>

                    {/* Hero Text */}

                    <div>

                        <h2 className="text-5xl font-bold leading-tight">

                            <span className="text-[#1E3A8A]">

                                Manage Debts.

                            </span>

                            <br />

                            <span className="text-gray-900">

                                Grow Your Business.

                            </span>

                        </h2>

                        <p className="mt-8 text-lg text-gray-500 leading-9 max-w-lg">

                            Track customer debts, manage payments, and monitor
                            due dates in one secure and organized platform.

                        </p>

                        <div className="w-20 h-1 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]
hover:from-[#1D4ED8]
hover:to-[#3B82F6] rounded-full mt-10"></div>

                    </div>

                   

                </div>

                {/* RIGHT SIDE */}

                <div className="flex-1 flex items-center justify-center p-10">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .5 }}
                        className="w-full max-w-[560px] bg-white rounded-[30px] shadow-2xl border border-gray-100 px-12 py-10"
                    >

                        {/* Logo */}

                        <div className="flex justify-center">

                            <div className="w-20 h-20 rounded-full bg-[#DBEAFE] flex items-center justify-center">

                                <Store
                                    size={36}
                                    className="text-[#1D4ED8]"
                                />

                            </div>

                        </div>

                        {/* Welcome */}

                        <h2 className="text-4xl font-bold text-center text-gray-900 mt-6">

                            Welcome Back!

                        </h2>

                        <p className="text-center text-gray-500 mt-3 mb-8">

                            Sign in to continue to your account

                        </p>

                        {/* Username */}

                        <label className="text-gray-700 font-medium">

                            Username

                        </label>

                        <div className="relative mt-3 mb-6">

                            <User
                                size={20}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full h-12 rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#1E3A8A]
focus:ring-2
focus:ring-[#DBEAFE]"
                            />

                        </div>

                        {/* Password */}

                        <label className="text-gray-700 font-medium">

                            Password

                        </label>

                        <div className="relative mt-3">

                            <Lock
                                size={20}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full h-12 rounded-xl border border-gray-300 bg-white pl-12 pr-12 text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#1E3A8A]
focus:ring-2
focus:ring-[#DBEAFE]"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A8A]"
                            >

                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}

                            </button>

                        </div>
                        {/* Remember Me & Forgot Password */}

                        <div className="flex justify-start mt-6">

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-[#1E3A8A]"
                                />

                                <span className="text-gray-600 text-sm">
                                    Remember me
                                </span>

                            </label>

                            <button
                                type="button"
                                className="text-[#1E3A8A] hover:text-[#2563EB] text-sm font-medium"
                            >
                                Forgot password?
                            </button>

                        </div>

                        {/* Login Button */}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full h-14 mt-8 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-300 ${loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-300/30"
                                }`}
                        >
                            <span>
                                {loading ? "Signing In..." : "Sign In"}
                            </span>

                            {!loading && (

                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1
                                    }}
                                >
                                    →
                                </motion.span>

                            )}

                        </motion.button>

                        {/* Footer */}

                        <p className="text-center text-gray-400 text-sm mt-8">

                            © 2026 Cleofer Store. All rights reserved.

                        </p>

                    </motion.div>

                </div>

            </div>

        </>

    );

}

export default Login;


