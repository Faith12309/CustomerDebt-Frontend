import { useState } from "react";
import { X, PackagePlus } from "lucide-react";
import { restockProduct } from "../services/productService";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const fieldCls =
    "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";
const readOnlyCls =
    "w-full h-10 rounded-control border border-surface-line bg-surface-muted px-3 text-sm text-slate-600";

const RestockModal = ({ isOpen, onClose, product }) => {
    const [quantity, setQuantity] = useState("");
    const handleRestock = async () => {
        try {

            await restockProduct(
                product.id,
                Number(quantity)
            );

            alert("Restocked successfully!");

            onClose();

            window.location.reload();

        } catch (error) {

            console.error(error);

            alert("Restock failed.");

        }
    };
    if (!isOpen || !product) return null;


    return (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="restock-title"
                className="bg-white w-full max-w-[450px] rounded-card shadow-pop border border-surface-line overflow-hidden"
            >

                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-emerald-50 flex items-center justify-center shrink-0">
                            <PackagePlus size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2
                                id="restock-title"
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Restock product
                            </h2>
                            <p className="text-sm text-slate-500">
                                Add more stock to this item.
                            </p>
                        </div>
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

                <div className="px-6 py-6 space-y-4">

                    <div>
                        <label className={labelCls}>
                            Product
                        </label>

                        <input
                            type="text"
                            value={product.name}
                            disabled
                            className={readOnlyCls}
                        />
                    </div>

                    <div>
                        <label className={labelCls}>
                            Current stock
                        </label>

                        <input
                            type="text"
                            value={product.stock}
                            disabled
                            className={`${readOnlyCls} font-semibold text-slate-900 tabular-nums`}
                        />
                    </div>

                    <div>
                        <label className={labelCls}>
                            Quantity to add
                        </label>

                        <input
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className={`${fieldCls} tabular-nums`}
                            autoFocus
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 px-6 py-5 border-t border-surface-line bg-surface-muted/50">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-control border border-surface-line bg-white text-slate-700 hover:bg-surface-muted font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleRestock}
                        className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                    >
                        Restock
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RestockModal;