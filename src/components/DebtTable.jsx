import { Pencil, Trash2, Wallet } from "lucide-react";

function DebtTable({
    debts,
    onEdit,
    onDelete,
    onPay
}) {

    return (

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-6 py-3">Customer</th>

                        <th className="text-left px-6 py-3">Amount</th>

                        <th className="text-left px-6 py-3">Remaining</th>

                        <th className="text-left px-6 py-3">Due Date</th>

                        <th className="text-left px-6 py-3">Status</th>

                        <th className="text-center px-6 py-3">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {debts.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="text-center py-8 text-gray-500"
                            >
                                No debts found.
                            </td>

                        </tr>

                    ) : (

                        debts.map((debt) => (

                            <tr
                                key={debt.id}
                                className="border-t hover:bg-gray-50"
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
                                    {debt.dueDate}
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

                                <td className="px-6 py-4">

                                    <div className="flex justify-center gap-3">

                                        <button
                                            onClick={() => onEdit(debt)}
                                            disabled={debt.status === "Paid"}
                                            className={`${debt.status === "Paid"
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-blue-600 hover:text-blue-800"
                                                }`}
                                            title={
                                                debt.status === "Paid"
                                                    ? "Paid debt cannot be edited"
                                                    : "Edit Debt"
                                            }
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onPay(debt)}
                                            disabled={debt.status === "Paid"}
                                            className={`${debt.status === "Paid"
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-green-600 hover:text-green-800"
                                                }`}
                                            title={
                                                debt.status === "Paid"
                                                    ? "Debt already paid"
                                                    : "Pay Debt"
                                            }
                                        >
                                            <Wallet size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(debt)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Debt"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default DebtTable;