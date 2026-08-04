import { Pencil, Trash2, Eye, Users, MapPin, Phone } from "lucide-react";

// Rotates through a small, deliberate palette so each customer gets a
// consistent, distinguishable avatar color based on their name.
const AVATAR_STYLES = [
    "bg-blue-50 text-blue-700",
    "bg-violet-50 text-violet-700",
    "bg-teal-50 text-teal-700",
    "bg-amber-50 text-amber-700",
    "bg-rose-50 text-rose-700",
    "bg-indigo-50 text-indigo-700",
];

function getInitials(fullName = "") {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarStyle(fullName = "") {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
}

function CustomerTable({ customers, onEdit, onDelete, onView }) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Name
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Address
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Contact
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-16">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                        <Users size={22} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        No customers found
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Add your first customer to get started.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer, index) => (
                            <tr
                                key={customer.id}
                                className={`group hover:bg-blue-50/60 transition-colors ${index !== customers.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarStyle(
                                                customer.fullName
                                            )}`}
                                        >
                                            {getInitials(customer.fullName)}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {customer.fullName}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <MapPin
                                            size={14}
                                            className="text-gray-400 shrink-0"
                                        />
                                        <span>{customer.address}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Phone
                                            size={14}
                                            className="text-gray-400 shrink-0"
                                        />
                                        <span>{customer.contactNumber}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onView(customer)}
                                            title="View customer"
                                            className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            onClick={() => onEdit(customer)}
                                            title="Edit customer"
                                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-100"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(customer)}
                                            title="Delete customer"
                                            className="p-2 rounded-lg text-red-600 hover:bg-red-100"
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
    );
}

export default CustomerTable;
