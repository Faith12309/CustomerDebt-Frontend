import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Wallet,
    FileText,
    LogOut
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

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold text-blue-400">
                    Debt Manager
                </h1>

                <p className="text-sm text-slate-400">
                    Customer Debt System
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">

                <NavLink
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/customers"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                >
                    <Users size={20} />
                    Customers
                </NavLink>

                <NavLink
                    to="/debts"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                >
                    <Wallet size={20} />
                    Debts
                </NavLink>

                <NavLink
                    to="/reports"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                >
                    <FileText size={20} />
                    Reports
                </NavLink>

            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700">

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-300 bg-transparent hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;