import {
    Store,
    User,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Wallet,
    Bell,
    ShieldCheck,

} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Toaster, toast } from "react-hot-toast";
import storePhoto from "../assets/store-photo.jpg";

const HIGHLIGHTS = [
    { icon: Wallet, label: "Track utang" },
    { icon: Bell, label: "Due alerts" },
    { icon: ShieldCheck, label: "Secure records" },
];

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
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#ffffff",
                        color: "#0F172A",
                        border: "1px solid #E6E8F0",
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                    },
                }}
            />
            <div className="min-h-screen flex bg-surface-muted">

                {/* LEFT: form */}
                <div className="relative w-full lg:w-[480px] flex flex-col px-8 sm:px-12 py-10 shrink-0 overflow-hidden">

                    <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-brand-600 flex items-center justify-center">
                            <Store size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold tracking-tight text-slate-900 leading-none">
                                Cleofer Store
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Debt management system
                            </p>
                        </div>
                    </div>

                    <div className="relative flex-1 flex flex-col justify-center">

                        {/* Form card */}
                        <div className="w-full max-w-sm bg-white rounded-card border border-surface-line shadow-pop p-8">

                            <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h1>
                            <p className="text-slate-500 mt-1.5 text-sm">
                                Sign in to manage your store.
                            </p>

                            <div className="mt-6 space-y-4">
                                {/* Username */}
                                <div>
                                    <label
                                        htmlFor="login-username"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={17}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            id="login-username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Enter your username"
                                            autoComplete="username"
                                            autoFocus
                                            className="w-full h-11 rounded-control border border-surface-line bg-surface-muted pl-10 pr-4 text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                                        />
                                    </div>
                                </div>
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="login-password"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={17}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className="w-full h-11 rounded-control border border-surface-line bg-surface-muted pl-10 pr-11 text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Remember me & forgot password */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded accent-brand-600"
                                        />
                                        <span className="text-slate-600 text-sm">
                                            Remember me
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        className="text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                {/* Sign in */}
                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className={`w-full h-12 rounded-control flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/30 ${loading
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-brand-600 text-white hover:bg-brand-700"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2 mt-6 max-w-sm">
                            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-1.5 bg-white border border-surface-line rounded-full px-3 py-1.5"
                                >
                                    <Icon size={13} className="text-brand-600" />
                                    <span className="text-xs font-medium text-slate-600">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative text-xs text-slate-400">
                        © 2026 Cleofer Store. All rights reserved.
                    </p>
                </div>

                {/* RIGHT: store photo */}
                <div
                    className="hidden lg:block flex-1 relative bg-ink-950 bg-cover bg-center"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(7,20,43,0.35), rgba(7,20,43,0.35)),
                            url(${storePhoto})
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Gradient overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-ink-950/30" />

                    <div className="absolute bottom-0 left-0 right-0 p-12">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-control bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <Store size={20} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Cleofer Store
                            </span>
                        </div>
                        <p className="text-white/70 text-sm mt-3 max-w-sm">
                            Serving the community, one sari-sari transaction at a time.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
export default Login;