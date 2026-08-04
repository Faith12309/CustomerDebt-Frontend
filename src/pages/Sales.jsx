import { useEffect, useState } from "react";
import { Search, Eye, Receipt, Wallet, HandCoins, Banknote } from "lucide-react";

import {
    getSales,
    getSaleById
} from "../services/saleService";

import ViewSaleModal from "../components/ViewSaleModal";
import DashboardCard from "../components/DashboardCard";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    });

const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

function Sales() {

    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedSale, setSelectedSale] = useState(null);

    const [openView, setOpenView] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    async function loadSales() {

        try {

            const data = await getSales();

            setSales(data);
            setFilteredSales(data);

        }
        catch {

            alert("Failed to load sales.");

        }

    }

    useEffect(() => {

        const result = sales.filter(s =>

            s.customerName
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

        setFilteredSales(result);

    }, [search, sales]);

    async function handleView(sale) {
        try {

            const data = await getSaleById(sale.saleId);

            setSelectedSale(data);

            setOpenView(true);

        }
        catch {

            alert("Failed to load sale details.");

        }
    }

    const totalSalesValue = sales.reduce(
        (sum, s) => sum + Number(s.totalAmount || 0),
        0
    );
    const creditCount = sales.filter((s) => s.isCredit).length;
    const cashCount = sales.length - creditCount;

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Sales
                </h1>

                <p className="text-gray-500 mt-2">
                    View all sales transactions.
                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <DashboardCard
                    title="Total transactions"
                    value={sales.length}
                    icon={Receipt}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <DashboardCard
                    title="Total sales"
                    value={peso(totalSalesValue)}
                    icon={Wallet}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                <DashboardCard
                    title="Credit sales"
                    value={creditCount}
                    icon={HandCoins}
                    bgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                />

                <DashboardCard
                    title="Cash sales"
                    value={cashCount}
                    icon={Banknote}
                    bgColor="bg-cyan-100"
                    iconColor="text-cyan-600"
                />

            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">

                <div className="p-5 border-b border-gray-100">

                    <div className="relative w-80">

                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                        />

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-gray-50 border-b border-gray-200">

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Date
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Customer
                                </th>

                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Total
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Type
                                </th>

                                <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredSales.length > 0 ? (

                                filteredSales.map((sale, index) => (

                                    <tr
                                        key={sale.saleId}
                                        className={`hover:bg-blue-50/60 transition-colors ${index !== filteredSales.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                            }`}
                                    >

                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(sale.dateSold)}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {sale.customerName}
                                        </td>

                                        <td className="px-6 py-4 text-right text-gray-900 tabular-nums">
                                            {peso(sale.totalAmount)}
                                        </td>

                                        <td className="px-6 py-4">

                                            {sale.isCredit ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Credit
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Cash
                                                </span>
                                            )}

                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleView(sale)}
                                                    title="View sale details"
                                                    aria-label={`View sale for ${sale.customerName}`}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="5" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <Receipt size={22} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-medium">
                                                No sales found
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Try a different search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            <ViewSaleModal

                isOpen={openView}

                onClose={() => setOpenView(false)}

                sale={selectedSale}

            />

        </div>

    );

}

export default Sales;
