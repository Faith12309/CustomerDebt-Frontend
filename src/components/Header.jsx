import { useState, useEffect, useRef } from "react";
import {
    Search,
    Bell,
    Menu,
    AlertTriangle,
    X,
    CheckCircle2,
    Users,
    Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Header({ onMenuClick }) {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({
        customers: [],
        products: [],
    });
    const [showSearch, setShowSearch] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "?";

    // Load alerts on mount
    useEffect(() => {
        loadAlerts();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadAlerts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/Dashboard/due-alerts");
            setAlerts(response.data || []);
        } catch (error) {
            console.error("Failed to load alerts:", error);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            loadAlerts();
        }
    };

    const handleAlertClick = () => {
        setShowNotifications(false);
        navigate("/debts");
    };

    // ===== SEARCH =====
// Debounced search
useEffect(() => {
    if (searchQuery.trim().length < 2) {
        setSearchResults({ customers: [], products: [] });
        setShowSearch(false);
        return;
    }

    setShowSearch(true);
    setSearchLoading(true);

    const timer = setTimeout(async () => {
        try {
            const [customersRes, productsRes] = await Promise.all([
                api.get(
                    `/Customer/search?name=${encodeURIComponent(searchQuery)}`
                ),
                api.get(
                    `/Product/search?keyword=${encodeURIComponent(searchQuery)}`
                ),
            ]);

            setSearchResults({
                customers: customersRes.data || [],
                products: productsRes.data || [],
            });
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults({ customers: [], products: [] });
        } finally {
            setSearchLoading(false);
        }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
}, [searchQuery]);

const handleSearchChange = (value) => {
    setSearchQuery(value);
};

    const handleSelectCustomer = (customer) => {
        setShowSearch(false);
        setSearchQuery("");
        navigate("/customers");
        // optional: you can later pass state to highlight the customer
    };

    const handleSelectProduct = (product) => {
        setShowSearch(false);
        setSearchQuery("");
        navigate("/products");
    };

    const hasResults =
        searchResults.customers.length > 0 ||
        searchResults.products.length > 0;

    return (
        <header className="bg-white border-b border-surface-line px-4 md:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
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
                <div className="relative hidden md:block" ref={searchRef}>
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Search customers or products..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => {
                            if (searchQuery.trim().length >= 2) {
                                setShowSearch(true);
                            }
                        }}
                        className="w-72 h-10 rounded-control border border-surface-line bg-surface-muted pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                    />

                    {/* Search dropdown */}
                    {showSearch && (
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-surface-line z-50 overflow-hidden">
                            {searchLoading ? (
                                <div className="px-4 py-6 text-center text-sm text-slate-500">
                                    Searching...
                                </div>
                            ) : !hasResults ? (
                                <div className="px-4 py-6 text-center text-sm text-slate-500">
                                    No results found
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    {/* Customers */}
                                    {searchResults.customers.length > 0 && (
                                        <div>
                                            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 bg-surface-muted/50">
                                                Customers
                                            </p>
                                            {searchResults.customers
                                                .slice(0, 5)
                                                .map((c) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() =>
                                                            handleSelectCustomer(
                                                                c
                                                            )
                                                        }
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-muted/60 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                            <Users
                                                                size={14}
                                                                className="text-blue-600"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                                {c.fullName}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {c.contactNumber ||
                                                                    c.address ||
                                                                    "Customer"}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                        </div>
                                    )}

                                    {/* Products */}
                                    {searchResults.products.length > 0 && (
                                        <div>
                                            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 bg-surface-muted/50">
                                                Products
                                            </p>
                                            {searchResults.products
                                                .slice(0, 5)
                                                .map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() =>
                                                            handleSelectProduct(
                                                                p
                                                            )
                                                        }
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-muted/60 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                            <Package
                                                                size={14}
                                                                className="text-emerald-600"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                                {p.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {p.category} · ₱
                                                                {Number(
                                                                    p.price
                                                                ).toLocaleString(
                                                                    "en-PH"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={handleBellClick}
                        aria-label="Notifications"
                        className="relative w-10 h-10 rounded-control flex items-center justify-center text-slate-500 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                    >
                        <Bell size={18} />
                        {alerts.length > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {alerts.length > 9 ? "9+" : alerts.length}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-surface-line z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-line bg-surface-muted/40">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Notifications
                                    {alerts.length > 0 && (
                                        <span className="ml-2 text-xs font-medium text-slate-500">
                                            ({alerts.length})
                                        </span>
                                    )}
                                </h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-1 rounded text-slate-400 hover:bg-surface-muted"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="max-h-72 overflow-y-auto">
                                {loading ? (
                                    <div className="px-4 py-10 text-center text-sm text-slate-500">
                                        Loading alerts...
                                    </div>
                                ) : alerts.length === 0 ? (
                                    <div className="px-4 py-10 flex flex-col items-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                                            <CheckCircle2
                                                size={18}
                                                className="text-emerald-600"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">
                                            All clear
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            No overdue or upcoming due debts
                                        </p>
                                    </div>
                                ) : (
                                    alerts.map((alert, index) => (
                                        <button
                                            key={alert.id || index}
                                            onClick={handleAlertClick}
                                            className="w-full text-left px-4 py-3 border-b border-surface-line last:border-0 hover:bg-surface-muted/60 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                    <AlertTriangle
                                                        size={14}
                                                        className="text-amber-600"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {alert.customerName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {alert.alertType}
                                                    </p>
                                                    <p className="text-xs font-semibold text-slate-800 mt-1">
                                                        ₱
                                                        {Number(
                                                            alert.remainingBalance
                                                        ).toLocaleString(
                                                            "en-PH"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {alerts.length > 0 && (
                                <div className="border-t border-surface-line">
                                    <button
                                        onClick={handleAlertClick}
                                        className="w-full px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
                                    >
                                        View all debts
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-px h-8 bg-surface-line hidden sm:block" />

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">
                            {username}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{role}</p>
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