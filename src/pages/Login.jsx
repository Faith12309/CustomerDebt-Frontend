import { motion } from "framer-motion";
import { Store, User, Lock, Eye, EyeOff } from "lucide-react";
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
                password
            });

            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            toast.success("Login successful!");

            console.log("Saved Token:", localStorage.getItem("token"));

            navigate("/dashboard");

        }
        catch (error) {

            console.log(error);

            if (error.response) {
                toast.error(error.response?.data || "Invalid username or password.");
            } else {
                toast.error("Unable to connect to the server.");
            }

        }
        finally {

            setLoading(false);

        }
    };

    return (

        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#0F172A",
                        color: "#fff",
                        border: "1px solid #1E3A8A",
                    },
                    success: {
                        iconTheme: {
                            primary: "#2563EB",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        <div className="relative min-h-screen overflow-hidden bg-[#020817] flex items-center justify-center">


            {/* Background Glow */}

            <div className="absolute inset-0 overflow-hidden">

                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-blue-700/20 blur-[150px] rounded-full"
                />

                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-900/20 blur-[170px] rounded-full"
                />

                <div className="absolute top-32 right-60 grid grid-cols-4 gap-3 opacity-20">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                    ))}
                </div>

            </div>
            {/* Background Decoration */}
            <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20"></div>

            <div className="absolute w-80 h-80 bg-blue-800/20 rounded-full blur-3xl bottom-0 right-0"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-[460px] mx-4 rounded-3xl border border-slate-700 bg-[#0F172A]/90 backdrop-blur-xl shadow-[0_0_60px_rgba(37,99,235,0.15)] p-8"
            >

                {/* Logo */}

                <div className="flex justify-center">

                    <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-600">

                        <Store className="text-blue-500" size={38} />

                    </div>

                </div>

                {/* Title */}

                <h1 className="text-center text-4xl font-bold mt-6">

                    <span className="text-blue-500">
                        CLEOFER
                    </span>

                    <span className="text-white">
                        {" "}STORE
                    </span>

                </h1>

                <p className="text-gray-400 text-center uppercase tracking-[5px] text-sm mt-2">
                    Owner & Staff Access
                </p>

                <div className="w-24 h-[2px] bg-blue-600 mx-auto my-8"></div>

                {/* Username */}

                <label className="text-gray-300 text-sm">
                    Username
                </label>

                <div className="mt-2 mb-5 relative">

                    <User
                        size={20}
                        className="absolute left-4 top-4 text-gray-500"
                    />

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(37,99,235,.3)] duration-300 outline-none transition"
                        />

                </div>

                {/* Password */}

                <label className="text-gray-300 text-sm">
                    Password
                </label>

                <div className="mt-2 relative">

                    <Lock
                        size={20}
                        className="absolute left-4 top-4 text-gray-500"
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                            className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Button */}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full mt-8 py-3 rounded-xl font-semibold text-lg transition ${loading
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/20"
                        }`}
                >
                        <div className="flex items-center justify-center gap-2">
                            <span>{loading ? "Signing In..." : "Sign In"}</span>

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
                        </div>
                </motion.button>

                <div className="flex items-center gap-4 mt-8">

                    <div className="flex-1 border-t border-gray-700"></div>

                    <span className="text-gray-500 text-sm">
                        © 2026 Cleofer Store
                    </span>

                    <div className="flex-1 border-t border-gray-700"></div>

                </div>

                </motion.div>

            </div>

        </>

    );
}

export default Login;