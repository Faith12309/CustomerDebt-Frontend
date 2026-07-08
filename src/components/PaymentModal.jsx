import { useState, useEffect } from "react";

function PaymentModal({
    isOpen,
    onClose,
    onPay,
    debt
}) {

    const [paymentAmount, setPaymentAmount] = useState("");

    useEffect(() => {

        if (isOpen) {
            setPaymentAmount("");
        }

    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        onPay(paymentAmount);

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[420px]">

                <h2 className="text-2xl font-bold mb-6">
                    Pay Debt
                </h2>

                <div className="mb-4">

                    <label className="block mb-1">
                        Customer
                    </label>

                    <input
                        type="text"
                        value={debt?.customerName || ""}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />

                </div>

                <div className="mb-4">

                    <label className="block mb-1">
                        Remaining Balance
                    </label>

                    <input
                        type="text"
                        value={`₱${Number(debt?.remainingBalance || 0).toLocaleString()}`}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">

                        <label className="block mb-1">
                            Payment Amount
                        </label>

                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter payment amount"
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
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                            Pay
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default PaymentModal;