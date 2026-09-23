import { Search, Bell, Menu } from "lucide-react";

function Header({ onMenuClick }) {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "?";

    return (
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
                {/* Hamburger - mobile/tablet only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div className="min-w-0">
                    <h1 className="text-base md:text-lg font-bold text-gray-900 truncate">
                        Customer Debt Management System
                    </h1>
                    <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">
                        {today}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 shrink-0">

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>

                {/* Notifications */}
                <button
                    aria-label="Notifications"
                    className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <Bell size={18} />
                </button>

                <div className="w-px h-8 bg-gray-100 hidden sm:block" />

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">
                            {username}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {role}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials}
                    </div>
                </div>

            </div>

        </header>
    );
}

export default Header;