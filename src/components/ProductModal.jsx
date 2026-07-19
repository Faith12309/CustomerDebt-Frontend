import { useState } from "react";
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

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[500px] p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-5">
                    Add Product
                </h2>

                <div className="space-y-4">

                    <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        className="w-full border rounded-lg p-2"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Unit"
                        className="w-full border rounded-lg p-2"
                        value={form.unit}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                unit: e.target.value
                            })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full border rounded-lg p-2"
                        value={form.price}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price: e.target.value
                            })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        className="w-full border rounded-lg p-2"
                        value={form.stock}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                stock: e.target.value
                            })
                        }
                    />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ProductModal;