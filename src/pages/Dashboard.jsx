import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    UserRound,
    HandCoins,
    BadgeCheck,
    TriangleAlert,
    Hourglass,
    ReceiptText
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";


import {
    getDashboard,
    getLatestDebts,
    getDueAlerts
} from "../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [latestDebts, setLatestDebts] = useState([]);
    const [dueAlerts, setDueAlerts] = useState([]);
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

        }

        catch (error) {

            console.error(error);

        }

    }
    useEffect(() => {

        async function loadData() {

            await Promise.all([
                loadDashboard(),
                loadLatestDebts(),
                loadDueAlerts()
            ]);

        }

        loadData();

    }, []);

    if (!dashboard) {

        return <h2 className="text-xl">Loading Dashboard...</h2>;

    }

    return (

        <div>


            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-900">
                    Dashboard Overview
                </h1>

                <p className="text-gray-500 mt-2">
                    Monitor customer debts, due dates, and payment status in one place.
                </p>

            </div>

            {/* Dashboard Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

                <DashboardCard
                    title="Total Customers"
                    value={dashboard.totalCustomers}
                    icon={UserRound}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <DashboardCard
                    title="Total Debts"
                    value={dashboard.totalDebts}
                    icon={HandCoins}
                    bgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                />

                <DashboardCard
                    title="Paid Debts"
                    value={dashboard.paidDebts}
                    icon={BadgeCheck}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                <DashboardCard
                    title="Unpaid Debts"
                    value={dashboard.unpaidDebts}
                    icon={ReceiptText}
                    bgColor="bg-red-100"
                    iconColor="text-red-600"
                />

                <DashboardCard
                    title="Partial Paid"
                    value={dashboard.partialPaidDebts}
                    icon={Hourglass}
                    bgColor="bg-orange-100"
                    iconColor="text-orange-600"
                />

                <DashboardCard
                    title="Overdue Debts"
                    value={dashboard.overdueDebts}
                    icon={TriangleAlert}
                    bgColor="bg-purple-100"
                    iconColor="text-purple-600"
                />

            </div>

            {/* Dashboard Bottom */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

                {/* LEFT SIDE */}

                <div className="xl:col-span-2">

                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">

                        <div className="px-6 py-4 border-b flex justify-between items-center">

                            <h2 className="text-xl font-bold">
                                Latest Debts
                            </h2>

                            <Link
                                to="/debts"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View All Debts →
                            </Link>

                        </div>

                        <div className="flex-1">

                            <table className="w-full">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="text-left px-6 py-3">
                                        Customer
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Amount
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Remaining
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {latestDebts.length > 0 ? (

                                    latestDebts.map((debt) => (

                                        <tr
                                            key={debt.id}
                                            className="border-t hover:bg-slate-50 transition-colors"
                                        >

                                            <td className="px-6 py-4">
                                                {debt.customerName}
                                            </td>

                                            <td className="px-6 py-4">
                                                {Number(debt.amount).toLocaleString("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP"
                                                })}
                                            </td>

                                            <td className="px-6 py-4">
                                                {Number(debt.remainingBalance).toLocaleString("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP"
                                                })}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium
                                                    ${debt.status === "Paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : debt.status === "Partial Paid"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : debt.status === "Overdue"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
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
                                            className="text-center py-6 text-gray-500"
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

                {/* RIGHT SIDE */}

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-fit">

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h2 className="text-xl font-bold text-gray-800">
                                Due Date Alerts
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Customers requiring immediate attention
                            </p>

                        </div>

                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {dueAlerts.length}
                        </div>

                    </div>

                    <div className="space-y-4">

                        {dueAlerts.length > 0 ? (

                            dueAlerts.map((alert) => {

                                const isOverdue =
                                    alert.alertType.startsWith("Overdue");

                                return (

                                    <div
                                        key={alert.id}
                                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition duration-300"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <div
                                                        className={`w-3 h-3 rounded-full ${isOverdue
                                                            ? "bg-red-500"
                                                            : "bg-yellow-500"
                                                            }`}
                                                    ></div>

                                                    <h3
                                                        className={`font-semibold ${isOverdue
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {alert.customerName}
                                                    </h3>

                                                </div>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    {alert.alertType}
                                                </p>

                                            </div>

                                            <span
                                                className={`text-xs font-bold px-3 py-1 rounded-full ${isOverdue
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {isOverdue ? "OVERDUE" : "DUE SOON"}
                                            </span>

                                        </div>

                                        <div className="mt-5 border-t pt-4">

                                            <div className="flex justify-between items-center">

                                                <div>

                                                    <p className="text-xs uppercase tracking-wide text-gray-400">
                                                        Remaining Balance
                                                    </p>

                                                    <p className="text-2xl font-bold text-gray-900">

                                                        ₱
                                                        {Number(
                                                            alert.remainingBalance
                                                        ).toLocaleString()}

                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <p className="text-xs uppercase tracking-wide text-gray-400">
                                                        Due Date
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-700">

                                                        {new Date(
                                                            alert.dueDate
                                                        ).toLocaleDateString("en-PH", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })

                        ) : (

                            <div className="text-center py-10">

                                <AlertTriangle
                                    size={40}
                                    className="mx-auto text-gray-300 mb-3"
                                />

                                <p className="text-gray-500">
                                    No due date alerts.
                                </p>

                            </div>

                        )}

                    </div>

                    <Link
                        to="/reports"
                        className="block w-full mt-6 text-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        View Full Report
                    </Link>

                </div>

            </div>



        </div>



    );

}

export default Dashboard;