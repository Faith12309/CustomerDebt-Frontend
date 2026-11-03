import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserRound,
    Package,
    TrendingUp,
    ReceiptText,
    AlertTriangle,
    Loader2,
    ArrowRight,
    Wallet,
} from "lucide-react";

import {
    getDashboard,
    getLatestDebts,
    getDueAlerts,
    getSalesSummary,
    getRecentSales,
} from "../services/dashboardService";
import RecentSales from "../components/RecentSales";
import DashboardCharts from "../components/DashboardCharts";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    });

/* Status colors: same meaning on every page */
const STATUS_STYLES = {
    Paid: { chip: "bg-emerald-50 text-emerald-700", dot: "bg-status-paid" },
    "Partial Paid": { chip: "bg-amber-50 text-amber-700", dot: "bg-status-partial" },
    Unpaid: { chip: "bg-orange-50 text-orange-700", dot: "bg-status-unpaid" },
    Overdue: { chip: "bg-red-50 text-red-700", dot: "bg-status-overdue" },
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || {
        chip: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}

const TONES = {
    brand: "bg-brand-50 text-brand-600",
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
};

function StatCard({ icon: Icon, label, value, tone = "brand" }) {
    return (
        <div className="rounded-card border border-surface-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
                <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${TONES[tone]}`}
                >
                    <Icon size={20} />
                </span>
                <p className="truncate text-[13px] font-medium text-slate-500">{label}</p>
            </div>
            <p className="mt-4 truncate text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {value}
            </p>
        </div>
    );
}

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [latestDebts, setLatestDebts] = useState([]);
    const [dueAlerts, setDueAlerts] = useState([]);
    const [salesSummary, setSalesSummary] = useState(null);
    const [recentSales, setRecentSales] = useState([]);

    async function loadDashboard() {
        try {
            const data = await getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadLatestDebts() {
        try {
            const data = await getLatestDebts();
            setLatestDebts(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadDueAlerts() {
        try {
            const data = await getDueAlerts();
            setDueAlerts(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadSalesSummary() {
        try {
            const data = await getSalesSummary();
            setSalesSummary(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadRecentSales() {
        try {
            const data = await getRecentSales();
            setRecentSales(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadData() {
            await Promise.all([
                loadDashboard(),
                loadLatestDebts(),
                loadDueAlerts(),
                loadSalesSummary(),
                loadRecentSales(),
            ]);
        }

        loadData();
    }, []);

    if (!dashboard) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Loader2 size={28} className="animate-spin mb-3" />
                <p className="text-sm">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                Dashboard
            </h1>

            {/* Hero: outstanding debt */}
            <section className="rounded-card bg-ink-950 p-8 text-white shadow-card">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Wallet size={16} />
                    Outstanding debt
                </div>

                <p className="mt-4 break-words text-5xl font-extrabold leading-none tracking-tight tabular-nums">
                    {peso(dashboard.outstandingDebt)}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-slate-400">
                        from {dashboard.totalCustomers} customers
                    </span>

                    {dashboard.overdueDebts > 0 && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1.5 font-medium text-red-300">
                            <AlertTriangle size={14} />
                            {dashboard.overdueDebts}{" "}
                            {dashboard.overdueDebts === 1 ? "debt is" : "debts are"} overdue
                        </span>
                    )}
                </div>
            </section>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    icon={UserRound}
                    label="Customers"
                    value={dashboard.totalCustomers}
                    tone="brand"
                />
                <StatCard
                    icon={Package}
                    label="Products"
                    value={dashboard.totalProducts}
                    tone="slate"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Total sales"
                    value={peso(salesSummary?.totalSales)}
                    tone="green"
                />
                <StatCard
                    icon={ReceiptText}
                    label="Transactions"
                    value={salesSummary?.totalTransactions ?? 0}
                    tone="amber"
                />
            </div>

            {/* Charts */}
            <DashboardCharts dashboard={dashboard} salesSummary={salesSummary} />

            {/* Recent sales */}
            <RecentSales sales={recentSales} />

            {/* Activity: latest debts + due alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">

                {/* Latest debts */}
                <div className="xl:col-span-2">
                    <div className="flex h-full flex-col overflow-hidden rounded-card border border-surface-line bg-white shadow-card">
                        <div className="flex items-center justify-between border-b border-surface-line px-6 py-4">
                            <h2 className="font-semibold text-slate-900">
                                Latest debts
                            </h2>

                            <Link
                                to="/debts"
                                className="flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                            >
                                View all
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-line bg-surface-muted/60">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                                            Remaining
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {latestDebts.length > 0 ? (
                                        latestDebts.map((debt, index) => (
                                            <tr
                                                key={debt.id}
                                                className={`transition-colors hover:bg-surface-muted/70 ${index !== latestDebts.length - 1
                                                    ? "border-b border-surface-line"
                                                    : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {debt.customerName}
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-600 tabular-nums">
                                                    {peso(debt.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                                                    {peso(debt.remainingBalance)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={debt.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="py-10 text-center text-sm text-slate-400"
                                            >
                                                No recent debts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Due date alerts */}
                <div className="h-fit rounded-card border border-surface-line bg-white p-6 shadow-card">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900">
                            Due date alerts
                        </h2>

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-600">
                            {dueAlerts.length}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {dueAlerts.length > 0 ? (
                            dueAlerts.map((alert) => {
                                const isOverdue = alert.alertType.startsWith("Overdue");

                                return (
                                    <div
                                        key={alert.id}
                                        className="relative overflow-hidden rounded-xl border border-surface-line bg-surface-muted/50 p-4 pl-5"
                                    >
                                        <div
                                            className={`absolute bottom-0 left-0 top-0 w-1 ${isOverdue ? "bg-status-overdue" : "bg-status-partial"
                                                }`}
                                        />

                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="min-w-0 truncate font-medium text-slate-900">
                                                {alert.customerName}
                                            </h3>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isOverdue
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {isOverdue ? "Overdue" : "Due soon"}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-end justify-between border-t border-surface-line pt-3">
                                            <p className="text-lg font-bold text-slate-900 tabular-nums">
                                                {peso(alert.remainingBalance)}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {new Date(alert.dueDate).toLocaleDateString(
                                                    "en-PH",
                                                    { month: "short", day: "numeric" }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center">
                                <AlertTriangle
                                    size={28}
                                    className="mx-auto mb-2 text-slate-300"
                                />
                                <p className="text-sm text-slate-400">No due date alerts.</p>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/reports"
                        className="mt-5 block w-full rounded-control bg-brand-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                        View full report
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;