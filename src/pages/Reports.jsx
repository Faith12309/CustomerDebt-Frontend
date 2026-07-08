import { useEffect, useState } from "react";
import { getDebts } from "../services/debtService";

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

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Reports
            </h1>

            {/* Report Type */}

            <div className="mb-6 flex items-center gap-3">

                <label className="font-medium">
                    Report Type:
                </label>

                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="border rounded-lg px-4 py-2"
                >

                    <option value="All">
                        All Reports
                    </option>

                    <option value="Paid">
                        Paid Debts
                    </option>

                    <option value="Unpaid">
                        Unpaid Debts
                    </option>

                    <option value="Partial Paid">
                        Partial Paid
                    </option>

                    <option value="Overdue">
                        Overdue Debts
                    </option>

                </select>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-2 gap-6 mb-6">

                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Total Debt Amount
                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {totalAmount.toLocaleString("en-PH", {
                            style: "currency",
                            currency: "PHP"
                        })}

                    </h2>

                </div>

                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Total Remaining Balance
                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {totalRemaining.toLocaleString("en-PH", {
                            style: "currency",
                            currency: "PHP"
                        })}

                    </h2>

                </div>

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

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

                            <th className="text-left px-6 py-3">
                                Due Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredReports.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No records found.
                                </td>

                            </tr>

                        ) : (

                            filteredReports.map((report) => (

                                <tr
                                    key={report.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">
                                        {report.customerName}
                                    </td>

                                    <td className="px-6 py-4">

                                        {Number(report.amount).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP"
                                        })}

                                    </td>

                                    <td className="px-6 py-4">

                                        {Number(report.remainingBalance).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP"
                                        })}

                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${report.status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : report.status === "Partial Paid"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : report.status === "Overdue"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                        >

                                            {report.status}

                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        {report.dueDate}

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Reports;