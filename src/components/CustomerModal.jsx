import { useState } from "react";
import { X, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

function buildInitialForm(customer) {
    return {
        fullName: customer?.fullName || "",
        address: customer?.address || "",
        contactNumber: customer?.contactNumber || "",
        idType: customer?.idType || "",
        idNumber: customer?.idNumber || "",
        idImage: customer?.idImage || "",
    };
}

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const fieldCls =
    "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function CustomerModal({ isOpen, onClose, onSave, customer }) {
    // Lazy initializer reads `customer` once, on mount, instead of an
    // effect that copies it into state on every change.
    const [form, setForm] = useState(() => buildInitialForm(customer));
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                "https://customerdebtsystem.runasp.net/api/Customer/upload-id",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setForm((prev) => ({
                ...prev,
                idImage: data.imageUrl,
            }));
        } catch {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, idImage: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="customer-modal-title"
                className="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-card bg-white shadow-pop border border-surface-line"
            >

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-surface-line px-8 py-5 shrink-0">
                    <div>
                        <h2
                            id="customer-modal-title"
                            className="text-xl font-bold tracking-tight text-slate-900"
                        >
                            {customer ? "Edit customer" : "Add customer"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Enter customer details and upload a valid government-issued ID.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 -mr-2 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body / Form */}
                <form
                    id="customer-form"
                    onSubmit={handleSubmit}
                    className="px-8 py-6 space-y-6 overflow-y-auto"
                >

                    {/* Section 1: Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Personal information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>
                                    Full name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/[^A-Za-z\u00D1\u00F1.'\- ]/g, '');
                                        handleChange({ target: { name: "fullName", value: filtered } });
                                    }}
                                    placeholder="e.g. Juan Dela Cruz"
                                    maxLength={100}
                                    className={fieldCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelCls}>
                                    Contact number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={form.contactNumber}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange({ target: { name: "contactNumber", value: filtered } });
                                    }}
                                    placeholder="09XXXXXXXXX"
                                    maxLength={11}
                                    className={`${fieldCls} tabular-nums`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                maxLength={255}
                                className={fieldCls}
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-surface-line" />

                    {/* Section 2: ID Information & Upload */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Identification and verification
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>
                                    ID type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="idType"
                                    value={form.idType}
                                    onChange={handleChange}
                                    className={fieldCls}
                                    required
                                >
                                    <option value="">Select valid ID</option>
                                    <option value="PhilSys National ID">PhilSys National ID</option>
                                    <option value="Driver's License">Driver's License</option>
                                    <option value="Passport">Passport</option>
                                    <option value="UMID">UMID</option>
                                    <option value="SSS ID">SSS ID</option>
                                    <option value="PhilHealth ID">PhilHealth ID</option>
                                    <option value="TIN ID">TIN ID</option>
                                    <option value="Postal ID">Postal ID</option>
                                    <option value="Voter's ID">Voter's ID</option>
                                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                                    <option value="PWD ID">PWD ID</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelCls}>
                                    ID number
                                </label>
                                <input
                                    type="text"
                                    name="idNumber"
                                    value={form.idNumber}
                                    onChange={handleChange}
                                    placeholder="Enter ID number"
                                    className={fieldCls}
                                />
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div>
                            <label className={labelCls}>
                                Upload valid ID
                            </label>

                            {!form.idImage ? (
                                <div className="relative border-2 border-dashed border-surface-line rounded-card p-6 bg-surface-muted/50 hover:border-brand-500 hover:bg-brand-50/40 transition-colors text-center group cursor-pointer">
                                    <input
                                        id="upload-id"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {uploading ? (
                                                <Loader2 size={22} className="animate-spin" />
                                            ) : (
                                                <UploadCloud size={22} />
                                            )}
                                        </div>

                                        <p className="font-semibold text-slate-700 text-sm">
                                            {uploading ? "Uploading ID..." : "Click or drag file to upload"}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            JPG, JPEG, or PNG (max size 5MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Uploaded Preview Card */
                                <div className="relative border border-surface-line rounded-card p-4 bg-surface-muted/50 flex items-center gap-4">
                                    <img
                                        src={form.idImage}
                                        alt="Customer ID"
                                        className="w-20 h-20 object-cover rounded-control border border-surface-line shadow-card shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                                            <CheckCircle2 size={16} />
                                            Upload successful
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                            Valid ID image attached.
                                        </p>
                                        <div className="mt-2.5 flex items-center gap-4">
                                            <label
                                                htmlFor="upload-id-change"
                                                className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
                                            >
                                                Change image
                                            </label>
                                            <input
                                                id="upload-id-change"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Action Buttons - pinned to the bottom so they're always reachable */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-surface-line bg-surface-muted/50 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-control border border-surface-line bg-white text-slate-700 hover:bg-surface-muted font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="customer-form"
                        disabled={uploading}
                        className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm transition-colors"
                    >
                        {customer ? "Update customer" : "Save customer"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CustomerModal;