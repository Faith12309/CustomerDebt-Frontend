export default function BorrowedProductsModal({
    isOpen,
    onClose,
    sales
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[85vh] overflow-y-auto">

                <div className="border-b p-5">
                    <h2 className="text-2xl font-bold">
                        Borrowed Products History
                    </h2>
                </div>

                <div className="p-6">

                    {sales.length === 0 ? (
                        <p className="text-gray-500">
                            No borrowed products found.
                        </p>
                    ) : (

                        sales.map((sale) => (

                            <div
                                key={sale.saleId}
                                className="mb-8 border rounded-lg overflow-hidden"
                            >

                                <div className="bg-gray-100 px-4 py-3 flex justify-between">

                                    <div>
                                        <span className="font-semibold">
                                            Sale #{sale.saleId}
                                        </span>
                                    </div>

                                    <div>
                                        {new Date(sale.dateSold).toLocaleString()}
                                    </div>

                                </div>

                                <table className="w-full">

                                    <thead className="bg-white">

                                        <tr>

                                            <th className="border p-2 text-left">
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

                                        {sale.items.map((item, index) => (

                                            <tr key={index}>

                                                <td className="border p-2">
                                                    {item.product}
                                                </td>

                                                <td className="border p-2 text-center">
                                                    {item.quantity}
                                                </td>

                                                <td className="border p-2 text-center">
                                                    ₱{item.unitPrice}
                                                </td>

                                                <td className="border p-2 text-center">
                                                    ₱{item.subTotal}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                                <div className="p-4 text-right font-bold text-lg">
                                    Total :
                                    {" "}
                                    ₱{sale.totalAmount}
                                </div>

                            </div>

                        ))

                    )}

                </div>

                <div className="border-t p-5 flex justify-end">

                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}