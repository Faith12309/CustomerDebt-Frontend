import { useEffect, useState } from "react";
import { Plus, Wallet, AlertTriangle, CheckCircle2, Receipt } from "lucide-react";
import PaymentModal from "../components/PaymentModal";
import { payDebt } from "../services/debtService";
import DebtTable from "../components/DebtTable";
import SaleModal from "../components/SaleModal";
import SearchBar from "../components/SearchBar";
import { getCustomerCreditSales } from "../services/saleService";
import BorrowedProductsModal from "../components/BorrowedProductsModal";
import DashboardCard from "../components/DashboardCard";

import {
    getDebts,
    searchDebt,
    deleteDebt
} from "../services/debtService";

import { getCustomers } from "../services/customerService";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    });

function Debts() {

    const [debts, setDebts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedPaymentDebt, setSelectedPaymentDebt] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [customerSales, setCustomerSales] = useState([]);

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
    async function handleViewBorrowedProducts(debt) {
        try {
            const data = await getCustomerCreditSales(debt.customerId);

            setCustomerSales(data);
            setIsViewOpen(true);
        }
        catch (error) {
            console.error(error);
            alert("Unable to load borrowed products.");
        }
    }

    const overdueCount = debts.filter((d) => d.status === "Overdue").length;
    const paidCount = debts.filter((d) => d.status === "Paid").length;
    const outstandingTotal = debts.reduce(
        (sum, d) => sum + Number(d.remainingBalance || 0),
        0
    );

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-bold text-gray-900">
                Debts
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <DashboardCard
                    title="Total debts"
                    value={debts.length}
                    icon={Receipt}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <DashboardCard
                    title="Overdue"
                    value={overdueCount}
                    icon={AlertTriangle}
                    bgColor="bg-red-100"
                    iconColor="text-red-600"
                />

                <DashboardCard
                    title="Paid"
                    value={paidCount}
                    icon={CheckCircle2}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                <DashboardCard
                    title="Outstanding balance"
                    value={peso(outstandingTotal)}
                    icon={Wallet}
                    bgColor="bg-amber-100"
                    iconColor="text-amber-600"
                />

            </div>

            <div className="flex justify-between items-center gap-4">

                <div className="flex-1 max-w-md">
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search status..."
                    />
                </div>

                <button
                    onClick={() => {

                        setSelectedDebt(null);
                        setIsModalOpen(true);

                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
                >

                    <Plus size={16} />
                    New sale

                </button>

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
                onView={handleViewBorrowedProducts}
            />

            <SaleModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDebt(null);
                }}
                onSuccess={loadDebts}
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
            <BorrowedProductsModal
                isOpen={isViewOpen}
                sales={customerSales}
                onClose={() => {
                    setIsViewOpen(false);
                    setCustomerSales([]);
                }}
            />

        </div>

    );

}

export default Debts;
