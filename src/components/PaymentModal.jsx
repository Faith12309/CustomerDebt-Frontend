import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                className="bg-white rounded-card shadow-pop border border-surface-line w-full max-w-[420px] p-6"
            >

                <div className="flex items-start justify-between mb-6">

                    <h2
                        id="payment-modal-title"
                        className="text-xl font-bold tracking-tight text-slate-900"
                    >
                        Pay debt
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 -mr-1.5 -mt-1 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="mb-4">

                    <label className="block mb-1.5 text-sm font-medium text-slate-700">
                        Customer
                    </label>

                    <input
                        type="text"
                        value={debt?.customerName || ""}
                        disabled
                        className="w-full h-10 rounded-control border border-surface-line bg-surface-muted px-3 text-sm text-slate-600"
                    />

                </div>

                <div className="mb-4">

                    <label className="block mb-1.5 text-sm font-medium text-slate-700">
                        Remaining balance
                    </label>

                    <input
                        type="text"
                        value={`₱${Number(debt?.remainingBalance || 0).toLocaleString()}`}
                        disabled
                        className="w-full h-10 rounded-control border border-surface-line bg-surface-muted px-3 text-sm font-semibold text-slate-900 tabular-nums"
                    />

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">

                        <label className="block mb-1.5 text-sm font-medium text-slate-700">
                            Payment amount
                        </label>

                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                            placeholder="Enter payment amount"
                            required
                            autoFocus
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-control border border-surface-line text-sm font-medium text-slate-700 hover:bg-surface-muted transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2.5 rounded-control bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
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