import { Pencil, Trash2, Eye, Users, MapPin, Phone } from "lucide-react";

// Rotates through a small, deliberate palette so each customer gets a
// consistent, distinguishable avatar color based on their name.
const role = localStorage.getItem("role");
const AVATAR_STYLES = [
    "bg-brand-100 text-brand-700",
    "bg-cyan-100 text-cyan-700",
    "bg-teal-100 text-teal-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
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
        <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-surface-muted/60 border-b border-surface-line">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                Address
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                Contact
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-16">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                            <Users size={22} className="text-brand-600" />
                                        </div>
                                        <p className="text-slate-800 font-semibold">
                                            No customers found
                                        </p>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Add your first customer to get started.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className={`group hover:bg-surface-muted/70 transition-colors ${index !== customers.length - 1
                                        ? "border-b border-surface-line"
                                        : ""
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarStyle(
                                                    customer.fullName
                                                )}`}
                                            >
                                                {getInitials(customer.fullName)}
                                            </div>
                                            <span className="font-semibold text-slate-900">
                                                {customer.fullName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <MapPin
                                                size={14}
                                                className="text-slate-400 shrink-0"
                                            />
                                            <span>{customer.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 tabular-nums">
                                            <Phone
                                                size={14}
                                                className="text-slate-400 shrink-0"
                                            />
                                            <span>{customer.contactNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                onClick={() => onView(customer)}
                                                title="View customer"
                                                aria-label="View customer"
                                                className="p-2 rounded-control text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(customer)}
                                                title="Edit customer"
                                                aria-label="Edit customer"
                                                className="p-2 rounded-control text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            {role === "Admin" && (
                                                <button
                                                    onClick={() => onDelete(customer)}
                                                    title="Delete customer"
                                                    aria-label="Delete customer"
                                                    className="p-2 rounded-control text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomerTable;