function ViewSaleModal({
    isOpen,
    onClose,
    sale
}) {
    if (!isOpen || !sale) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[700px] max-h-[85vh] overflow-y-auto">
                <div className="border-b p-5">
                    <h2 className="text-2xl font-bold">
                        Sale Details
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <span className="font-semibold">
                            Customer:
                        </span>{" "}
                        {sale.customer}
                    </div>
                    <div>
                        <span className="font-semibold">
                            Date:
                        </span>{" "}
                        {new Date(sale.dateSold).toLocaleString()}
                    </div>
                    <div>
                        <span className="font-semibold">
                            Sale Type:
                        </span>{" "}
                        {
                            sale.isCredit
                                ? "Credit Sale"
                                : "Cash Sale"
                        }
                    </div>
                    <table className="w-full border mt-5">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">
                                    Product
                                </th>
                                <th className="border p-2">
                                    Qty
                                </th>
                                <th className="border p-2">
                                    Price
                                </th>
                                <th className="border p-2">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sale.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">
                                            {item.product}
                                        </td>
                                        <td className="border p-2">
                                            {item.quantity}
                                        </td>
                                        <td className="border p-2">
                                            {"\u20B1"}{item.unitPrice}
                                        </td>
                                        <td className="border p-2">
                                            {"\u20B1"}{item.subTotal}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="text-right text-xl font-bold">
                        Total:
                        {" "}
                        {"\u20B1"}{sale.totalAmount}
                    </div>
                </div>
                <div className="border-t p-5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ViewSaleModal;
