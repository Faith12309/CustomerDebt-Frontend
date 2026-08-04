import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserRound,
    ReceiptText,
    BadgeCheck,
    Hourglass,
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

const STATUS_STYLES = {
    Paid: "bg-green-50 text-green-700",
    "Partial Paid": "bg-yellow-50 text-yellow-700",
    Overdue: "bg-red-50 text-red-700",
};

function StatRow({ icon: Icon, label, value, isLast }) {
    return (
        <div
            className={`flex items-center justify-between py-3.5 ${!isLast ? "border-b border-white/10" : ""
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Icon size={15} className="text-white/50 shrink-0" />
                <span className="text-sm text-white/70 truncate">{label}</span>
            </div>
            <span className="text-sm font-semibold text-white shrink-0 ml-3">
                {value}
            </span>
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
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Loader2 size={28} className="animate-spin mb-3" />
                <p className="text-sm">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
            </h1>

            {/* Hero row: spotlight + stat list */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                <div className="xl:col-span-2 relative overflow-hidden rounded-2xl bg-gray-900 p-7 flex flex-col justify-between min-h-[180px]">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            Outstanding debt
                        </span>
                        <Wallet size={16} className="text-white/50" />
                    </div>

                    <div className="mt-6">
                        <p className="text-4xl font-bold text-white break-words">
                            {peso(dashboard.outstandingDebt)}
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            {dashboard.overdueDebts} overdue · {dashboard.totalCustomers} customers
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl bg-gray-900 px-6 flex flex-col justify-center">
                    <StatRow
                        icon={UserRound}
                        label="Customers"
                        value={dashboard.totalCustomers}
                    />
                    <StatRow
                        icon={ReceiptText}
                        label="Products"
                        value={dashboard.totalProducts}
                    />
                    <StatRow
                        icon={BadgeCheck}
                        label="Total sales"
                        value={peso(salesSummary?.totalSales)}
                    />
                    <StatRow
                        icon={Hourglass}
                        label="Transactions"
                        value={salesSummary?.totalTransactions ?? 0}
                        isLast
                    />
                </div>
            </div>

            {/* Charts */}
            <DashboardCharts dashboard={dashboard} salesSummary={salesSummary} />

            {/* Recent sales */}
            <RecentSales sales={recentSales} />

            {/* Activity: latest debts + due alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">

                {/* Latest debts */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">
                                Latest debts
                            </h2>

                            <Link
                                to="/debts"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                                View all
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Customer
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Amount
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Remaining
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {latestDebts.length > 0 ? (
                                        latestDebts.map((debt, index) => (
                                            <tr
                                                key={debt.id}
                                                className={`hover:bg-gray-50 transition-colors ${index !== latestDebts.length - 1
                                                        ? "border-b border-gray-50"
                                                        : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {debt.customerName}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600 tabular-nums">
                                                    {peso(debt.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600 tabular-nums">
                                                    {peso(debt.remainingBalance)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[debt.status] ||
                                                            "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {debt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-10 text-gray-400 text-sm"
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Due date alerts
                        </h2>

                        <div className="bg-red-50 text-red-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
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
                                        className="relative rounded-xl p-4 pl-5 bg-gray-50/60 border border-gray-100 overflow-hidden"
                                    >
                                        <div
                                            className={`absolute left-0 top-0 bottom-0 w-1 ${isOverdue ? "bg-red-500" : "bg-yellow-500"
                                                }`}
                                        />

                                        <div className="flex justify-between items-start gap-3">
                                            <h3 className="font-medium text-gray-900 truncate min-w-0">
                                                {alert.customerName}
                                            </h3>

                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${isOverdue
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {isOverdue ? "Overdue" : "Due soon"}
                                            </span>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-end">
                                            <p className="text-lg font-bold text-gray-900">
                                                {peso(alert.remainingBalance)}
                                            </p>

                                            <p className="text-sm text-gray-500">
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
                            <div className="text-center py-8">
                                <AlertTriangle
                                    size={28}
                                    className="mx-auto text-gray-300 mb-2"
                                />
                                <p className="text-gray-400 text-sm">No due date alerts.</p>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/reports"
                        className="block w-full mt-5 text-center bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        View full report
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
