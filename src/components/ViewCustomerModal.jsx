import { X, User, Phone, MapPin, BadgeCheck, ImageOff } from "lucide-react";

const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} className="text-gray-500" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5 break-words">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {getInitials(customer.fullName)}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 truncate">
                                {customer.fullName}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Customer details
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto">

                    <div className="space-y-0">
                        <DetailRow
                            icon={Phone}
                            label="Contact number"
                            value={customer.contactNumber}
                        />
                        <DetailRow
                            icon={MapPin}
                            label="Address"
                            value={customer.address}
                        />
                        <DetailRow
                            icon={BadgeCheck}
                            label="ID type"
                            value={customer.idType}
                        />
                        <DetailRow
                            icon={User}
                            label="ID number"
                            value={customer.idNumber}
                        />
                    </div>

                    {/* Valid ID */}
                    <div className="mt-5">
                        <p className="text-xs text-gray-400 mb-2">
                            Valid ID
                        </p>

                        {customer.idImage ? (
                            <img
                                src={customer.idImage}
                                alt="Customer valid ID"
                                className="w-full max-w-xs rounded-xl border border-gray-200 shadow-sm"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 rounded-xl py-8 text-center bg-gray-50/50">
                                <ImageOff size={20} className="text-gray-300" />
                                <p className="text-sm text-gray-400">
                                    No ID image on file.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewCustomerModal;
