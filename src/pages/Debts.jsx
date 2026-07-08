import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PaymentModal from "../components/PaymentModal";
import { payDebt } from "../services/debtService";
import DebtTable from "../components/DebtTable";
import DebtModal from "../components/DebtModal";
import SearchBar from "../components/SearchBar";

import {
    getDebts,
    addDebt,
    updateDebt,
    searchDebt,
    deleteDebt
} from "../services/debtService";

import { getCustomers } from "../services/customerService";

function Debts() {

    const [debts, setDebts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedPaymentDebt, setSelectedPaymentDebt] = useState(null);

    async function loadDebts() {

        try {

            const data = await getDebts();
            setDebts(data);

        }
        catch (error) {

            console.error(error);

        }

    }

    async function loadCustomers() {

        try {

            const data = await getCustomers();
            setCustomers(data);

        }
        catch (error) {

            console.error(error);

        }

    }
    async function handlePay(paymentAmount) {

        try {

            await payDebt(
                selectedPaymentDebt.id,
                Number(paymentAmount)
            );

            setIsPaymentOpen(false);
            setSelectedPaymentDebt(null);

            await loadDebts();

        }
        catch (error) {

            console.error(error);

            if (error.response) {

                alert(error.response.data);

            }
            else {

                alert("Unable to process payment.");

            }

        }

    }
    useEffect(() => {

        loadDebts();
        loadCustomers();

    }, []);

    async function handleSave(debt) {

        try {

            if (selectedDebt) {

                await updateDebt(selectedDebt.id, debt);

            }
            else {

                await addDebt(debt);

            }

            setIsModalOpen(false);
            setSelectedDebt(null);

            loadDebts();

        }
        catch (error) {

            console.error(error);

            alert("Unable to save debt.");

        }

    }

    async function handleDelete(debt) {

        if (!window.confirm("Delete this debt?")) return;

        try {

            await deleteDebt(debt.id);

            loadDebts();

        }
        catch (error) {

            console.error(error);

            alert("Unable to delete debt.");

        }

    }

    async function handleSearch(e) {

        const keyword = e.target.value;

        setSearch(keyword);

        if (keyword.trim() === "") {

            loadDebts();
            return;

        }

        try {

            const data = await searchDebt(keyword);

            setDebts(data);

        }
        catch (error) {

            console.error(error);

        }

    }

    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Debts
                </h1>

                <button
                    onClick={() => {

                        setSelectedDebt(null);
                        setIsModalOpen(true);

                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >

                    <Plus size={18} />

                    Add Debt

                </button>

            </div>

            <div className="mb-6">

                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search status..."
                />

            </div>

            <DebtTable
                debts={debts}
                onEdit={(debt) => {

                    setSelectedDebt(debt);
                    setIsModalOpen(true);

                }}
                onDelete={handleDelete}
                onPay={(debt) => {

                    setSelectedPaymentDebt(debt);
                    setIsPaymentOpen(true);

                }}
            />

            <DebtModal
                isOpen={isModalOpen}
                debt={selectedDebt}
                customers={customers}
                onSave={handleSave}
                onClose={() => {

                    setIsModalOpen(false);
                    setSelectedDebt(null);

                }}
            />
            <PaymentModal
                isOpen={isPaymentOpen}
                debt={selectedPaymentDebt}
                onPay={handlePay}
                onClose={() => {

                    setIsPaymentOpen(false);
                    setSelectedPaymentDebt(null);

                }}
            />
        </div>

    );

}

export default Debts;