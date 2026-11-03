import { X, ShoppingBag } from "lucide-react";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

export default function BorrowedProductsModal({
    isOpen,
    onClose,
    sales
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="borrowed-title"
                className="bg-white rounded-card shadow-pop border border-surface-line w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >

                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5 shrink-0">
                    <div>
                        <h2
                            id="borrowed-title"
                            className="text-xl font-bold tracking-tight text-slate-900"
                        >
                            Borrowed products history
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            All credit purchases made by this customer.
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

                <div className="p-6 overflow-y-auto space-y-5">

                    {sales.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                <ShoppingBag size={20} className="text-brand-600" />
                            </div>
                            <p className="text-slate-500 text-sm">
                                No borrowed products found.
                            </p>
                        </div>
                    ) : (

                        sales.map((sale) => (

                            <div
                                key={sale.saleId}
                                className="border border-surface-line rounded-card overflow-hidden"
                            >

                                <div className="bg-surface-muted/60 border-b border-surface-line px-4 py-3 flex flex-wrap justify-between gap-2">

                                    <span className="font-semibold text-slate-900">
                                        Sale #{sale.saleId}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                        {new Date(sale.dateSold).toLocaleString()}
                                    </span>

                                </div>

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b border-surface-line">

                                                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                                                    Product
                                                </th>

                                                <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                                                    Qty
                                                </th>

                                                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                                                    Price
                                                </th>

                                                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                                                    Subtotal
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {sale.items.map((item, index) => (

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

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                                <div className="px-4 py-3 border-t border-surface-line bg-surface-muted/40 flex justify-end items-baseline gap-2">
                                    <span className="text-sm text-slate-500">Total</span>
                                    <span className="text-lg font-bold text-slate-900 tabular-nums">
                                        {peso(sale.totalAmount)}
                                    </span>
                                </div>

                            </div>

                        ))

                    )}

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