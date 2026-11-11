import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { updateProduct } from "../services/productService";

const CATEGORY_OPTIONS = [
    "Beverages",
    "Snacks",
    "Personal Care",
    "Household",
    "Others",
];

const UNIT_OPTIONS = [
    "piece",
    "sachet",
    "pack",
    "can",
    "bottle",
    "kg",
    "box",
];

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const fieldCls =
    "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

const EditProductModal = ({ isOpen, onClose, product }) => {
    const [form, setForm] = useState({
        name: "",
        category: "",
        unit: "",
        price: "",
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                category: product.category || "",
                unit: product.unit || "",
                price: product.price ?? "",
            });
        }
    }, [product]);

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert("Product name is required.");
            return;
        }

        if (!form.category) {
            alert("Please select a category.");
            return;
        }

        if (!form.unit) {
            alert("Please select a unit.");
            return;
        }

        if (form.price === "" || Number(form.price) < 0) {
            alert("Please enter a valid price.");
            return;
        }

        try {
            await updateProduct(product.id, {
                name: form.name.trim(),
                category: form.category,
                unit: form.unit,
                price: Number(form.price),
                stock: product.stock,
            });

            alert("Product updated successfully!");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to update product.");
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-product-title"
                className="bg-white w-full max-w-lg rounded-card shadow-pop border border-surface-line overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                            <Pencil size={18} className="text-brand-600" />
                        </div>
                        <div>
                            <h2
                                id="edit-product-title"
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Edit product
                            </h2>
                            <p className="text-sm text-slate-500">
                                Update the details of this item.
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
                        <label className={labelCls}>Product name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            className={fieldCls}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={fieldCls}
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select category</option>
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelCls}>
                                Unit <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={fieldCls}
                                value={form.unit}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        unit: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select unit</option>
                                {UNIT_OPTIONS.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Price</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                ₱
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        price: e.target.value,
                                    })
                                }
                                className={`${fieldCls} pl-8 tabular-nums`}
                            />
                        </div>
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
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;