import { X } from "lucide-react";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

function InfoItem({ label, children }) {
    return (
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">
                {children}
            </div>
        </div>
    );
}

function ViewSaleModal({
    isOpen,
    onClose,
    sale
}) {
    if (!isOpen || !sale) return null;
    return (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="view-sale-title"
                className="bg-white rounded-card shadow-pop border border-surface-line w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5 shrink-0">
                    <div>
                        <h2
                            id="view-sale-title"
                            className="text-xl font-bold tracking-tight text-slate-900"
                        >
                            Sale details
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Products and totals for this transaction.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1.5 -mr-1.5 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-card bg-surface-muted/60 border border-surface-line p-4">
                        <InfoItem label="Customer">
                            {sale.customer}
                        </InfoItem>
                        <InfoItem label="Date">
                            {new Date(sale.dateSold).toLocaleString()}
                        </InfoItem>
                        <InfoItem label="Sale type">
                            {sale.isCredit ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                                    Credit sale
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-status-paid" />
                                    Cash sale
                                </span>
                            )}
                        </InfoItem>
                    </div>

                    <div className="rounded-card border border-surface-line overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surface-muted/60 border-b border-surface-line">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sale.items?.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-surface-line last:border-0"
                                            >
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {item.product}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 tabular-nums">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                                                    {peso(item.unitPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">
                                                    {peso(item.subTotal)}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-baseline justify-end gap-3">
                        <span className="text-sm text-slate-500">Total</span>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                            {peso(sale.totalAmount)}
                        </span>
                    </div>
                </div>

                <div className="border-t border-surface-line bg-surface-muted/50 px-6 py-4 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ViewSaleModal;