import { useEffect, useState } from "react";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { createSale } from "../services/saleService";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

function SaleModal({
    isOpen,
    onClose,
    onSuccess
}) {

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [items, setItems] = useState([]);
    const [paymentType, setPaymentType] = useState("cash");
    const [dueDate, setDueDate] = useState("");

    const loadCustomers = async () => {

        try {

            const data = await getCustomers();
            setCustomers(data);

        } catch (error) {

            console.error(error);
            alert("Failed to load customers.");

        }

    };

    const loadProducts = async () => {

        try {

            const data = await getProducts();
            setProducts(data);

        } catch (error) {

            console.error(error);
            alert("Failed to load products.");

        }

    };

    useEffect(() => {

        if (!isOpen) return;

        const initialize = async () => {

            await loadCustomers();
            await loadProducts();

            setCustomerId("");
            setProductId("");
            setQuantity(1);
            setItems([]);
            setPaymentType("cash");
            setDueDate("");

        };

        initialize();

    }, [isOpen]);

    

    const handleAddProduct = () => {

        if (!productId) {

            alert("Please select a product.");
            return;

        }

        if (quantity <= 0) {

            alert("Invalid quantity.");
            return;

        }

        const product = products.find(
            p => p.id === Number(productId)
        );

        if (!product) return;

        const existingItem = items.find(
            item => item.productId === product.id
        );

        if (existingItem) {

            setItems(

                items.map(item =>

                    item.productId === product.id

                        ? {

                            ...item,
                            quantity: item.quantity + quantity,
                            subtotal:
                                (item.quantity + quantity) * item.unitPrice

                        }

                        : item

                )

            );

        } else {

            setItems([

                ...items,

                {

                    productId: product.id,
                    name: product.name,
                    quantity,
                    unitPrice: product.price,
                    subtotal: product.price * quantity

                }

            ]);

        }

        setProductId("");
        setQuantity(1);

    };
    const removeItem = (index) => {

        setItems(items.filter((_, i) => i !== index));

    };

    const total = items.reduce(

        (sum, item) => sum + item.subtotal,

        0

    );

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (paymentType === "credit" && !customerId) {

            alert("Please select a customer.");
            return;

        }

        if (items.length === 0) {

            alert("Please add at least one product.");
            return;

        }

        try {

            await createSale({

                customerId:
                    paymentType === "credit"
                        ? Number(customerId)
                        : null,

                isCredit: paymentType === "credit",

                dueDate:
                    paymentType === "credit"
                        ? dueDate
                        : null,

                items: items.map(item => ({

                    productId: item.productId,
                    quantity: item.quantity

                }))
            });

            alert(
                paymentType === "credit"
                    ? "Credit sale recorded successfully."
                    : "Cash sale recorded successfully."
            );

            setCustomerId("");
            setProductId("");
            setQuantity(1);
            setItems([]);
            setPaymentType("cash");

            if (onSuccess) {

                onSuccess();

            }

            onClose();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                (paymentType === "credit"
                    ? "Failed to save credit sale."
                    : "Failed to save cash sale.")
            );

        }

    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">

            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {paymentType === "credit"
                            ? "New Credit Sale"
                            : "New Cash Sale"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {paymentType === "credit"
                            ? "Select a customer and record the products they borrowed."
                            : "Record products purchased by a walk-in customer."}
                    </p>
                </div>

                <form
                    id="sale-form"
                    onSubmit={handleSubmit}
                    className="px-8 py-6 space-y-5 overflow-y-auto"
                >

                    {/* Payment Type */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Payment Type
                        </label>

                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                        >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit</option>
                        </select>
                    </div>

                    {paymentType === "credit" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Due Date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5
            text-gray-800 bg-white focus:border-blue-500
            focus:outline-none focus:ring-4
            focus:ring-blue-500/10 transition"
                            />
                        </div>
                    )}

                    {paymentType === "credit" && (

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Customer
                            </label>

                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                            >

                                <option value="">
                                    Select customer
                                </option>

                                {customers.map((customer) => (

                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.fullName}
                                    </option>

                                ))}

                            </select>

                        </div>

                    )}
                    {/* Product */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Add products
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3">

                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                            >

                                <option value="">
                                    Select product
                                </option>

                                {products.map((product) => (

                                    <option
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.name}
                                    </option>

                                ))}

                            </select>

                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                            />

                            <button
                                type="button"
                                onClick={handleAddProduct}
                                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Plus size={16} />
                                Add product
                            </button>

                        </div>
                    </div>

                    {/* Product List */}

                    <div className="rounded-xl border border-gray-100 overflow-hidden">

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">

                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Product
                                    </th>

                                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Qty
                                    </th>

                                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Unit price
                                    </th>

                                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Subtotal
                                    </th>

                                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {items.length === 0 ? (

                                    <tr>
                                        <td colSpan="5" className="px-4 py-10">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                    <ShoppingCart size={18} className="text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm">
                                                    No products added yet.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                ) : (

                                    items.map((item, index) => (

                                        <tr
                                            key={index}
                                            className={
                                                index !== items.length - 1
                                                    ? "border-b border-gray-100"
                                                    : ""
                                            }
                                        >

                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {item.name}
                                            </td>

                                            <td className="px-4 py-3 text-center text-gray-600">
                                                {item.quantity}
                                            </td>

                                            <td className="px-4 py-3 text-right text-gray-600 tabular-nums">
                                                {peso(item.unitPrice)}
                                            </td>

                                            <td className="px-4 py-3 text-right text-gray-900 font-medium tabular-nums">
                                                {peso(item.subtotal)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        title="Remove product"
                                                        aria-label={`Remove ${item.name}`}
                                                        className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </form>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50/50 shrink-0">

                    <h3 className="text-lg font-bold text-gray-900">
                        Total: {peso(total)}
                    </h3>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="sale-form"
                            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-colors"
                        >
                            {paymentType === "credit"
                                ? "Save Credit Sale"
                                : "Save Cash Sale"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default SaleModal;
