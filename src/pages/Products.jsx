import { useEffect, useState } from "react";
import { Search, Plus, Pencil, PackagePlus, Trash2, Boxes } from "lucide-react";
import {
    getProducts,
    deleteProduct,
    searchProducts
} from "../services/productService";

import ProductModal from "../components/ProductModal";
import RestockModal from "../components/RestockModal";
import EditProductModal from "../components/EditProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

const LOW_STOCK_THRESHOLD = 20;

const peso = (value) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value);

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
        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold text-gray-900">
                    Products
                </h1>

                <div className="flex gap-3">

                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 w-64 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                        />
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        Add product
                    </button>

                </div>

            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Category
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Unit
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Price
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Stock
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {products.length > 0 ? (

                                products.map((p, index) => {
                                    const isLowStock = p.stock <= LOW_STOCK_THRESHOLD;

                                    return (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-blue-50/60 transition-colors ${index !== products.length - 1
                                                    ? "border-b border-gray-100"
                                                    : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {p.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    {p.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {p.unit}
                                            </td>

                                            <td className="px-6 py-4 text-right text-gray-900 tabular-nums">
                                                {peso(p.price)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${isLowStock
                                                            ? "text-amber-600"
                                                            : "text-gray-700"
                                                        }`}
                                                >
                                                    {p.stock}
                                                    {isLowStock && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                                            Low
                                                        </span>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowEditModal(true);
                                                        }}
                                                        title="Edit product"
                                                        aria-label={`Edit ${p.name}`}
                                                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowRestockModal(true);
                                                        }}
                                                        title="Restock product"
                                                        aria-label={`Restock ${p.name}`}
                                                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                                                    >
                                                        <PackagePlus size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        title="Delete product"
                                                        aria-label={`Delete ${p.name}`}
                                                        className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })

                            ) : (

                                <tr>
                                    <td colSpan="6" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <Boxes size={22} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-medium">
                                                No products found
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Try a different search, or add a new product.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
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