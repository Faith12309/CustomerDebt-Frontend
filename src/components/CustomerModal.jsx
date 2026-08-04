import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

function CustomerModal({ isOpen, onClose, onSave, customer }) {
    const [form, setForm] = useState({
        fullName: "",
        address: "",
        contactNumber: "",
        idType: "",
        idNumber: "",
        idImage: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (customer) {
            setForm({
                fullName: customer.fullName || "",
                address: customer.address || "",
                contactNumber: customer.contactNumber || "",
                idType: customer.idType || "",
                idNumber: customer.idNumber || "",
                idImage: customer.idImage || "",
            });
        } else {
            setForm({
                fullName: "",
                address: "",
                contactNumber: "",
                idType: "",
                idNumber: "",
                idImage: "",
            });
        }
    }, [customer, isOpen]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        try {
            setUploading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                "https://localhost:7256/api/Customer/upload-id",
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
        setSelectedFile(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {customer ? "Edit customer" : "Add customer"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Enter customer details and upload a valid government-issued ID.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
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
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Personal information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="e.g. Juan Dela Cruz"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Contact number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    placeholder="09XXXXXXXXX"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Section 2: ID Information & Upload */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Identification and verification
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    ID type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="idType"
                                    value={form.idType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition bg-white"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    ID number
                                </label>
                                <input
                                    type="text"
                                    name="idNumber"
                                    value={form.idNumber}
                                    onChange={handleChange}
                                    placeholder="Enter ID number"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                />
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Upload valid ID
                            </label>

                            {!form.idImage ? (
                                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-center group cursor-pointer">
                                    <input
                                        id="upload-id"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {uploading ? (
                                                <Loader2 size={22} className="animate-spin" />
                                            ) : (
                                                <UploadCloud size={22} />
                                            )}
                                        </div>

                                        <p className="font-semibold text-gray-700 text-sm">
                                            {uploading ? "Uploading ID..." : "Click or drag file to upload"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            JPG, JPEG, or PNG (max size 5MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Uploaded Preview Card */
                                <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-4">
                                    <img
                                        src={form.idImage}
                                        alt="Customer ID"
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                                            <CheckCircle2 size={16} />
                                            Upload successful
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            Valid ID image attached.
                                        </p>
                                        <div className="mt-2.5 flex items-center gap-4">
                                            <label
                                                htmlFor="upload-id-change"
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
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

                {/* Action Buttons — pinned to the bottom so they're always reachable */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="customer-form"
                        disabled={uploading}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-colors"
                    >
                        {customer ? "Update customer" : "Save customer"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CustomerModal;
