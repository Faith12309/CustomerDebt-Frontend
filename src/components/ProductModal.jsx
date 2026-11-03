import { useState } from "react";
import { X, Package } from "lucide-react";
import { createProduct, getProducts } from "../services/productService";

const ProductModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: "",
        category: "",
        unit: "",
        price: "",
        stock: "",
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!form.name.trim() || !form.price || form.stock === "") {
            alert("Please fill in product name, price, and stock.");
            return;
        }

        try {
            const existing = await getProducts();

            // Normalize: lowercase + remove all spaces
            const normalize = (str) =>
                str.trim().toLowerCase().replace(/\s+/g, "");

            const nameExists = existing.some(
                (p) => normalize(p.name) === normalize(form.name)
            );

            if (nameExists) {
                alert("A product with this name already exists.");
                return;
            }

            await createProduct({
                name: form.name.trim(),
                category: form.category.trim(),
                unit: form.unit.trim().toLowerCase(),
                price: Number(form.price),
                stock: Number(form.stock),
            });

            alert("Product added successfully!");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to add product.");
        }
    };

    const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
    const inputClass =
        "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                className="relative w-full max-w-lg overflow-hidden rounded-card bg-white shadow-pop border border-surface-line"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                            <Package size={18} className="text-brand-600" />
                        </div>
                        <div>
                            <h2
                                id="product-modal-title"
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Add product
                            </h2>
                            <p className="text-sm text-slate-500">
                                Add a new item to your inventory.
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

                {/* Form */}
                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className={labelCls}>
                            Product name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Milo Sachet"
                            className={inputClass}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Category
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Beverages"
                                className={inputClass}
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className={labelCls}>
                                Unit
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. sachet, kg, can"
                                className={inputClass}
                                value={form.unit}
                                onChange={(e) =>
                                    setForm({ ...form, unit: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    ?
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`${inputClass} pl-8 tabular-nums`}
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                className={`${inputClass} tabular-nums`}
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({ ...form, stock: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
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
                        Save product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;