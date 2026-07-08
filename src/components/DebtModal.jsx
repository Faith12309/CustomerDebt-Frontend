import { useState, useEffect } from "react";

function DebtModal({
    isOpen,
    onClose,
    onSave,
    debt,
    customers
}) {

    const [form, setForm] = useState({
        customerId: "",
        amount: "",
        dueDate: ""
    });

    useEffect(() => {

        if (debt) {

            setForm({
                customerId: debt.customerId,
                amount: debt.amount,
                dueDate: debt.dueDate
            });

        } else {

            setForm({
                customerId: "",
                amount: "",
                dueDate: ""
            });

        }

    }, [debt]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({
            ...form,
            customerId: Number(form.customerId),
            amount: Number(form.amount)
        });

    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[450px]">

                <h2 className="text-2xl font-bold mb-6">

                    {debt ? "Edit Debt" : "Add Debt"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="block mb-1">
                            Customer
                        </label>

                        <select
                            name="customerId"
                            value={form.customerId}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        >

                            <option value="">
                                Select Customer
                            </option>

                            {customers.map(customer => (

                                <option
                                    key={customer.id}
                                    value={customer.id}
                                >
                                    {customer.fullName}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="mb-4">

                        <label className="block mb-1">
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block mb-1">
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
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

export default DebtModal;