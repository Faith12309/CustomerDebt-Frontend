import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Wallet,
    FileText,
    LogOut,
    Store
} from "lucide-react";

function Sidebar() {

    const navigate = useNavigate();

    function handleLogout() {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/login");
    }

    const navStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
        ${isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="w-72 min-h-screen bg-[#020817] border-r border-slate-800 flex flex-col">

            {/* Logo */}

            <div className="p-8 border-b border-slate-800">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-600 flex items-center justify-center">

                        <Store
                            size={24}
                            className="text-blue-500"
                        />

                    </div>

                    <div>

                        <h1 className="text-white font-bold text-xl">
                            CLEOFER STORE
                        </h1>

                        <p className="text-slate-400 text-sm">
                            Debt Management
                        </p>

                    </div>

                </div>

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-5 py-6 space-y-3">

                <NavLink
                    to="/dashboard"
                    className={navStyle}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/customers"
                    className={navStyle}
                >
                    <Users size={20} />
                    Customers
                </NavLink>

                <NavLink
                    to="/debts"
                    className={navStyle}
                >
                    <Wallet size={20} />
                    Debts
                </NavLink>

                <NavLink
                    to="/reports"
                    className={navStyle}
                >
                    <FileText size={20} />
                    Reports
                </NavLink>

            </nav>

            {/* Bottom */}

            <div className="p-5 border-t border-slate-800">

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-400 hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;