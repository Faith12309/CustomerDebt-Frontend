import { Pencil, Trash2, Wallet, Eye } from "lucide-react";


const role = localStorage.getItem("role");

/* Same status colors as the dashboard */
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

const iconBtn =
    "p-2 rounded-control transition-colors";
const iconBtnDisabled =
    "text-slate-300 cursor-not-allowed";

function DebtTable({
    debts,
    onEdit,
    onDelete,
    onPay,
    onView
}) {

    return (

        <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-surface-muted/60 border-b border-surface-line">

                        <tr>

                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">Customer</th>

                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">Amount</th>

                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">Remaining</th>

                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">Due date</th>

                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">Status</th>

                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {debts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-sm text-slate-400"
                                >
                                    No debts found.
                                </td>

                            </tr>

                        ) : (

                            debts.map((debt) => (

                                <tr
                                    key={debt.id}
                                    className="border-b border-surface-line last:border-0 hover:bg-surface-muted/70 transition-colors"
                                >

                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {debt.customerName}
                                    </td>

                                    <td className="px-6 py-4 text-right text-slate-600 tabular-nums">
                                        {Number(debt.amount).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP"
                                        })}
                                    </td>

                                    <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                                        {Number(debt.remainingBalance).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP"
                                        })}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {debt.dueDate}
                                    </td>

                                    <td className="px-6 py-4">

                                        <StatusBadge status={debt.status} />

                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                onClick={() => onEdit(debt)}
                                                disabled={debt.status === "Paid"}
                                                aria-label="Edit debt"
                                                className={`${iconBtn} ${debt.status === "Paid"
                                                    ? iconBtnDisabled
                                                    : "text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                                                    }`}
                                                title={
                                                    debt.status === "Paid"
                                                        ? "Paid debt cannot be edited"
                                                        : "Edit Debt"
                                                }
                                            >
                                                <Pencil size={17} />
                                            </button>
                                            <button
                                                onClick={() => onPay(debt)}
                                                disabled={debt.status === "Paid"}
                                                aria-label="Pay debt"
                                                className={`${iconBtn} ${debt.status === "Paid"
                                                    ? iconBtnDisabled
                                                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                                    }`}
                                                title={
                                                    debt.status === "Paid"
                                                        ? "Debt already paid"
                                                        : "Pay Debt"
                                                }
                                            >
                                                <Wallet size={17} />
                                            </button>
                                            <button
                                                onClick={() => onView(debt)}
                                                aria-label="View borrowed products"
                                                className={`${iconBtn} text-slate-400 hover:bg-brand-50 hover:text-brand-600`}
                                                title="View Borrowed Products"
                                            >
                                                <Eye size={17} />
                                            </button>
                                            {role === "Admin" && (
                                                <button
                                                    onClick={() => onDelete(debt)}
                                                    aria-label="Delete debt"
                                                    className={`${iconBtn} text-slate-400 hover:bg-red-50 hover:text-red-600`}
                                                    title="Delete Debt"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            )}
                                        </div>
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

export default DebtTable;