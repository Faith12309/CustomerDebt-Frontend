import { Pencil, Trash2 } from "lucide-react";

function CustomerTable({
    customers,
    onEdit,
    onDelete
}) {

    return (

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-6 py-3">Name</th>

                        <th className="text-left px-6 py-3">Address</th>

                        <th className="text-left px-6 py-3">Contact</th>

                        <th className="text-center px-6 py-3">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {customers.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"
                                className="text-center py-8 text-gray-500"
                            >
                                No customers found.
                            </td>

                        </tr>

                    ) : (

                        customers.map((customer) => (

                            <tr
                                key={customer.id}
                                className="border-t hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {customer.fullName}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.address}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.contactNumber}
                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center gap-3">

                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(customer)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default CustomerTable;