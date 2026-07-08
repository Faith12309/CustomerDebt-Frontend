import { useState, useEffect } from "react";

function CustomerModal({
    isOpen,
    onClose,
    onSave,
    customer
}) {

    const [form, setForm] = useState({
        fullName: "",
        address: "",
        contactNumber: ""
    });

    useEffect(() => {

        if (customer) {

            setForm({
                fullName: customer.fullName,
                address: customer.address,
                contactNumber: customer.contactNumber
            });

        } else {

            setForm({
                fullName: "",
                address: "",
                contactNumber: ""
            });

        }

    }, [customer]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave(form);

    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[450px]">

                <h2 className="text-2xl font-bold mb-6">

                    {customer ? "Edit Customer" : "Add Customer"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="block mb-1">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <label className="block mb-1">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block mb-1">
                            Contact Number
                        </label>

                        <input
                            type="text"
                            name="contactNumber"
                            value={form.contactNumber}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CustomerModal;