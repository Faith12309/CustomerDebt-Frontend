import { X, User, Phone, MapPin, BadgeCheck, ImageOff } from "lucide-react";

const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-surface-line last:border-0">
            <div className="w-9 h-9 rounded-control bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-brand-600" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5 break-words">
                    {value || "\u2014"}
                </p>
            </div>
        </div>
    );
}

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="view-customer-title"
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-card bg-white shadow-pop border border-surface-line"
            >

                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
                            {getInitials(customer.fullName)}
                        </div>
                        <div className="min-w-0">
                            <h2
                                id="view-customer-title"
                                className="text-lg font-bold tracking-tight text-slate-900 truncate"
                            >
                                {customer.fullName}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Customer details
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1.5 -mr-1.5 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors shrink-0"
                    >
                        <X size={18} />
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
                        <p className="text-xs text-slate-500 mb-2">
                            Valid ID
                        </p>

                        {customer.idImage ? (
                            <img
                                src={customer.idImage}
                                alt="Customer valid ID"
                                className="w-full max-w-xs rounded-card border border-surface-line shadow-card"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-surface-line rounded-card py-8 text-center bg-surface-muted/50">
                                <ImageOff size={20} className="text-slate-300" />
                                <p className="text-sm text-slate-500">
                                    No ID image on file.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-surface-line bg-surface-muted/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewCustomerModal;