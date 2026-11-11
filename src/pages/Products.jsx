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

    const role = localStorage.getItem("role");
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

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

                <div>
                    <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                        Products
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {products.length} {products.length === 1 ? "product" : "products"}
                    </p>
                </div>

                <div className="flex gap-3">

                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="h-10 w-64 rounded-control border border-surface-line bg-white pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-card outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                        />
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-control text-sm font-semibold transition-colors"
                    >
                        <Plus size={16} />
                        Add product
                    </button>

                </div>

            </div>

            <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="bg-surface-muted/60 border-b border-surface-line">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Name
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Category
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Unit
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">
                                    Price
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Stock
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500">
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
                                            className={`hover:bg-surface-muted/70 transition-colors ${index !== products.length - 1
                                                ? "border-b border-surface-line"
                                                : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {p.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                                                    {p.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {p.unit}
                                            </td>

                                            <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                                                {peso(p.price)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 text-sm font-semibold tabular-nums ${isLowStock
                                                        ? "text-amber-700"
                                                        : "text-slate-700"
                                                        }`}
                                                >
                                                    {p.stock}
                                                    {isLowStock && (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-status-partial" />
                                                            Low
                                                        </span>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowEditModal(true);
                                                        }}
                                                        title="Edit product"
                                                        className="p-2 rounded-control text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setShowRestockModal(true);
                                                        }}
                                                        title="Restock product"
                                                        className="p-2 rounded-control text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                    >
                                                        <PackagePlus size={16} />
                                                    </button>
                                                    {role === "Admin" && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProduct(p);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            title="Delete product"
                                                            className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })

                            ) : (

                                <tr>
                                    <td colSpan="6" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                                <Boxes size={22} className="text-brand-600" />
                                            </div>
                                            <p className="text-slate-800 font-semibold">
                                                No products found
                                            </p>
                                            <p className="text-slate-500 text-sm mt-1">
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