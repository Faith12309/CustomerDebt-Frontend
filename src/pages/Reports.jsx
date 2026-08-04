import { useEffect, useState } from "react";
import { Wallet, PiggyBank, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { getDebts } from "../services/debtService";
import DashboardCard from "../components/DashboardCard";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const STATUS_STYLES = {
    Paid: "bg-green-100 text-green-700",
    "Partial Paid": "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
};

function Reports() {

    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState("All");

    async function loadReports() {

        try {

            const data = await getDebts();
            setReports(data);

        } catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        loadReports();

    }, []);

    // Filter Reports

    const filteredReports =
        reportType === "All"
            ? reports
            : reports.filter(report => report.status === reportType);

    // Total Amount

    const totalAmount = filteredReports.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    // Total Remaining

    const totalRemaining = filteredReports.reduce(
        (sum, item) => sum + Number(item.remainingBalance),
        0
    );

    const paidCount = filteredReports.filter(
        report => report.status === "Paid"
    ).length;

    const overdueCount = filteredReports.filter(
        report => report.status === "Overdue"
    ).length;

    return (

        <div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Reports
                </h1>
                <p className="text-gray-500 mt-2">
                    Review debt performance and payment history across your customers.
                </p>
            </div>

            {/* Report Type */}

            <div className="mb-6 flex items-center gap-3">

                <label className="text-sm font-medium text-gray-700">
                    Report type
                </label>

                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                >

                    <option value="All">
                        All reports
                    </option>

                    <option value="Paid">
                        Paid debts
                    </option>

                    <option value="Unpaid">
                        Unpaid debts
                    </option>

                    <option value="Partial Paid">
                        Partial paid
                    </option>

                    <option value="Overdue">
                        Overdue debts
                    </option>

                </select>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <DashboardCard
                    title="Total debt amount"
                    value={peso(totalAmount)}
                    icon={Wallet}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <DashboardCard
                    title="Total remaining balance"
                    value={peso(totalRemaining)}
                    icon={PiggyBank}
                    bgColor="bg-amber-100"
                    iconColor="text-amber-600"
                />

                <DashboardCard
                    title="Paid debts"
                    value={paidCount}
                    icon={CheckCircle2}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                <DashboardCard
                    title="Overdue debts"
                    value={overdueCount}
                    icon={AlertTriangle}
                    bgColor="bg-red-100"
                    iconColor="text-red-600"
                />

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-gray-50 border-b border-gray-200">

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Customer
                                </th>

                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Amount
                                </th>

                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Remaining
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Due date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredReports.length === 0 ? (

                                <tr>

                                    <td colSpan="5" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <FileText size={22} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-medium">
                                                No records found
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Try a different report type.
                                            </p>
                                        </div>
                                    </td>

                                </tr>

                            ) : (

                                filteredReports.map((report, index) => (

                                    <tr
                                        key={report.id}
                                        className={`hover:bg-blue-50/60 transition-colors ${index !== filteredReports.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                            }`}
                                    >

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {report.customerName}
                                        </td>

                                        <td className="px-6 py-4 text-right text-gray-900 tabular-nums">
                                            {peso(report.amount)}
                                        </td>

                                        <td className="px-6 py-4 text-right text-gray-900 tabular-nums">
                                            {peso(report.remainingBalance)}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[report.status] ||
                                                    "bg-gray-100 text-gray-700"
                                                    }`}
                                            >

                                                {report.status}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-gray-600">

                                            {formatDate(report.dueDate)}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Reports;
