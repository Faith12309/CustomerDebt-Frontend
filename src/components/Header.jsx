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
        <header className="bg-white border-b border-surface-line px-4 md:px-6 py-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
                {/* Hamburger - mobile/tablet only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-1 rounded-control text-slate-600 hover:bg-surface-muted transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div className="min-w-0">
                    <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 truncate">
                        Customer Debt Management System
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">
                        {today}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 shrink-0">

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 h-10 rounded-control border border-surface-line bg-surface-muted pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                    />
                </div>

                {/* Notifications */}
                <button
                    aria-label="Notifications"
                    className="relative w-10 h-10 rounded-control flex items-center justify-center text-slate-500 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                >
                    <Bell size={18} />
                </button>

                <div className="w-px h-8 bg-surface-line hidden sm:block" />

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">
                            {username}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {role}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                    </div>
                </div>

            </div>

        </header>
    );
}

export default Header;