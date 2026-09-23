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
    Store,
    X
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    }

    const navStyle = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200
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
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 h-full bg-gray-900 border-r border-white/5
                    flex flex-col shrink-0
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo + Close button (mobile) */}
                <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                            <Store size={18} className="text-white" />
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

                    {/* Close button - mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label}>
                            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                                {section.label}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map(({ to, label, icon: Icon }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={navStyle}
                                        onClick={onClose} // close sidebar when clicking a link on mobile
                                    >
                                        <Icon size={17} />
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;