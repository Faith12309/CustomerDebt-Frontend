import { useState } from "react";
import { restockProduct } from "../services/productService";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[450px] rounded-xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-5">
                    Restock Product
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="font-semibold">
                            Product
                        </label>

                        <input
                            type="text"
                            value={product.name}
                            disabled
                            className="w-full border rounded-lg p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="font-semibold">
                            Current Stock
                        </label>

                        <input
                            type="text"
                            value={product.stock}
                            disabled
                            className="w-full border rounded-lg p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="font-semibold">
                            Quantity to Add
                        </label>

                        <input
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleRestock}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        Restock
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RestockModal;