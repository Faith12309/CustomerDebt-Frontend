import { useState, useEffect } from "react";
import { updateProduct } from "../services/productService";

const EditProductModal = ({ isOpen, onClose, product }) => {

    const [form, setForm] = useState({
        name: "",
        category: "",
        unit: "",
        price: ""
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                category: product.category,
                unit: product.unit,
                price: product.price
            });
        }
    }, [product]);

    const handleSave = async () => {
        try {

            await updateProduct(product.id, {
                name: form.name,
                category: form.category,
                unit: form.unit,
                price: Number(form.price),
                stock: product.stock
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-5">
                    Edit Product
                </h2>

                <div className="space-y-4">

                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="text"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value
                            })
                        }
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="text"
                        value={form.unit}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                unit: e.target.value
                            })
                        }
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price: e.target.value
                            })
                        }
                        className="w-full border rounded-lg p-2"
                    />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditProductModal;