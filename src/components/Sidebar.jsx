import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    UserCog,
    Wallet,
    FileText,
    Package,
    ShoppingCart,
    LogOut,
    Store
} from "lucide-react";

function Sidebar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

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
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200
        ${isActive
            ? "bg-blue-600 text-white font-medium"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`;

    const NAV_SECTIONS = [
        {
            label: "Overview",
            items: [
                { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            ],
        },
        {
            label: "Records",
            items: [
                { to: "/customers", label: "Customers", icon: Users },
                { to: "/products", label: "Products", icon: Package },
            ],
        },
        {
            label: "Transactions",
            items: [
                { to: "/debts", label: "Debts", icon: Wallet },
                { to: "/sales", label: "Sales", icon: ShoppingCart },
            ],
        },
        {
            label: "Insights",
            items: [
                { to: "/reports", label: "Reports", icon: FileText },
            ],
        },
        ...(role === "Admin"
            ? [
                {
                    label: "Administration",
                    items: [
                        { to: "/users", label: "User Accounts", icon: UserCog },
                    ],
                },
            ]
            : []),
    ];

    return (
        <aside className="w-64 min-h-screen bg-gray-900 border-r border-white/5 flex flex-col shrink-0">

            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                        <Store size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-white font-bold text-sm leading-tight truncate">
                            CLEOFER STORE
                        </h1>
                        <p className="text-gray-500 text-xs mt-0.5">
                            Debt Management
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.label}>
                        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                            {section.label}
                        </p>
                        <div className="space-y-1">
                            {section.items.map(({ to, label, icon: Icon }) => (
                                <NavLink key={to} to={to} className={navStyle}>
                                    <Icon size={18} />
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;