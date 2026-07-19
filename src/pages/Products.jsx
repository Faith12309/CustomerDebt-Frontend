import { useEffect, useState } from "react";
import {
    getProducts,
    deleteProduct,
    searchProducts
} from "../services/productService";

import ProductModal from "../components/ProductModal";
import RestockModal from "../components/RestockModal";
import EditProductModal from "../components/EditProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleSearch = async (keyword) => {
        setSearch(keyword);

        try {

            if (keyword.trim() === "") {
                loadProducts();
                return;
            }

            const data = await searchProducts(keyword);
            setProducts(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {

        if (!selectedProduct) return;

        try {

            await deleteProduct(selectedProduct.id);

            alert("Product deleted successfully!");

            setShowDeleteModal(false);

            loadProducts();

        } catch (error) {

            console.error(error);

            alert("Failed to delete product.");

        }
    };

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-5">

                <h1 className="text-2xl font-bold">
                    Products
                </h1>

                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        + Add Product
                    </button>

                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full border border-gray-300">

                    <thead className="bg-gray-100">

                        <tr>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Unit</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {products.length > 0 ? (

                            products.map((p) => (

                                <tr key={p.id} className="hover:bg-gray-50">

                                    <td className="border p-2">{p.name}</td>

                                    <td className="border p-2">{p.category}</td>

                                    <td className="border p-2">{p.unit}</td>

                                    <td className="border p-2">
                                        {new Intl.NumberFormat("en-PH", {
                                            style: "currency",
                                            currency: "PHP",
                                        }).format(p.price)}
                                    </td>

                                    <td className="border p-2">
                                        {p.stock}
                                    </td>

                                    <td className="border p-2">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setShowEditModal(true);
                                                }}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setShowRestockModal(true);
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            >
                                                Restock
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-5 text-gray-500"
                                >
                                    No products found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>
            <ProductModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <EditProductModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                product={selectedProduct}
            />

            <RestockModal
                isOpen={showRestockModal}
                onClose={() => setShowRestockModal(false)}
                product={selectedProduct}
            />

            <DeleteProductModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                product={selectedProduct}
                onDelete={handleDelete}
            />

        </div>
    );
};

export default Products;


