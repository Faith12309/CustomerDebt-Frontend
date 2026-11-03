import { useEffect, useState } from "react";
import { Plus, Trash2, ShoppingCart, X } from "lucide-react";

import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { createSale } from "../services/saleService";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const fieldCls =
    "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-[2px]">

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="sale-modal-title"
                className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-card bg-white shadow-pop border border-surface-line"
            >

                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-8 py-5 border-b border-surface-line shrink-0">
                    <div>
                        <h2
                            id="sale-modal-title"
                            className="text-xl font-bold tracking-tight text-slate-900"
                        >
                            {paymentType === "credit"
                                ? "New credit sale"
                                : "New cash sale"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {paymentType === "credit"
                                ? "Select a customer and record the products they borrowed."
                                : "Record products purchased by a walk-in customer."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 -mr-2 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    id="sale-form"
                    onSubmit={handleSubmit}
                    className="px-8 py-6 space-y-5 overflow-y-auto"
                >

                    {/* Payment Type */}

                    <div>
                        <label className={labelCls}>
                            Payment type
                        </label>

                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className={fieldCls}
                        >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit</option>
                        </select>
                    </div>

                    {paymentType === "credit" && (
                        <div>
                            <label className={labelCls}>
                                Due date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={fieldCls}
                            />
                        </div>
                    )}

                    {paymentType === "credit" && (

                        <div>

                            <label className={labelCls}>
                                Customer
                            </label>

                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className={fieldCls}
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
                        <label className={labelCls}>
                            Add products
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3">

                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className={fieldCls}
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
                                className={fieldCls}
                            />

                            <button
                                type="button"
                                onClick={handleAddProduct}
                                className="flex h-10 items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-control text-sm font-semibold transition-colors"
                            >
                                <Plus size={16} />
                                Add product
                            </button>

                        </div>
                    </div>

                    {/* Product List */}

                    <div className="rounded-card border border-surface-line overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse">

                                <thead>
                                    <tr className="bg-surface-muted/60 border-b border-surface-line">

                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                                            Product
                                        </th>

                                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">
                                            Qty
                                        </th>

                                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">
                                            Unit price
                                        </th>

                                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">
                                            Subtotal
                                        </th>

                                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {items.length === 0 ? (

                                        <tr>
                                            <td colSpan="5" className="px-4 py-10">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mb-2">
                                                        <ShoppingCart size={18} className="text-brand-600" />
                                                    </div>
                                                    <p className="text-slate-500 text-sm">
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
                                                        ? "border-b border-surface-line"
                                                        : ""
                                                }
                                            >

                                                <td className="px-4 py-3 font-semibold text-slate-900">
                                                    {item.name}
                                                </td>

                                                <td className="px-4 py-3 text-center text-slate-600 tabular-nums">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                                                    {peso(item.unitPrice)}
                                                </td>

                                                <td className="px-4 py-3 text-right text-slate-900 font-semibold tabular-nums">
                                                    {peso(item.subtotal)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            title="Remove product"
                                                            aria-label={`Remove ${item.name}`}
                                                            className="p-2 rounded-control text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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

                    </div>

                </form>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-t border-surface-line bg-surface-muted/50 shrink-0">

                    <div>
                        <p className="text-xs font-medium text-slate-500">
                            Total
                        </p>
                        <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                            {peso(total)}
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-control border border-surface-line bg-white text-slate-700 hover:bg-surface-muted font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="sale-form"
                            className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                        >
                            {paymentType === "credit"
                                ? "Save credit sale"
                                : "Save cash sale"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default SaleModal;