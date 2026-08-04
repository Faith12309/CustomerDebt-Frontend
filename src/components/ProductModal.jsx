import { useState } from "react";
import { X, Package } from "lucide-react";
import { createProduct } from "../services/productService";

const ProductModal = ({ isOpen, onClose }) => {

    const [form, setForm] = useState({
        name: "",
        category: "",
        unit: "",
        price: "",
        stock: ""
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            await createProduct({
                ...form,
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

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Package size={16} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Add product
                            </h2>
                            <p className="text-sm text-gray-500">
                                Add a new item to your inventory.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Product name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Milo Sachet"
                            className={inputClass}
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                        category: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Unit
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. sachet, kg, can"
                                className={inputClass}
                                value={form.unit}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        unit: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ?
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`${inputClass} pl-8`}
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                className={inputClass}
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stock: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50/50">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-colors"
                    >
                        Save product
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ProductModal;
