import { useEffect, useState } from "react";
import { Search, Eye, Receipt, Wallet, HandCoins, Banknote } from "lucide-react";

import {
    getSales,
    getSaleById
} from "../services/saleService";

import ViewSaleModal from "../components/ViewSaleModal";

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

const TONES = {
    brand: "bg-brand-50 text-brand-600",
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-600",
};

function StatCard({ icon: Icon, label, value, tone = "brand" }) {
    return (
        <div className="rounded-card border border-surface-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
                <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${TONES[tone]}`}
                >
                    <Icon size={20} />
                </span>
                <p className="truncate text-[13px] font-medium text-slate-500">{label}</p>
            </div>
            <p className="mt-4 truncate text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {value}
            </p>
        </div>
    );
}

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

                <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                    Sales
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    View all sales transactions.
                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    label="Total transactions"
                    value={sales.length}
                    icon={Receipt}
                    tone="slate"
                />

                <StatCard
                    label="Total sales"
                    value={peso(totalSalesValue)}
                    icon={Wallet}
                    tone="brand"
                />

                <StatCard
                    label="Credit sales"
                    value={creditCount}
                    icon={HandCoins}
                    tone="brand"
                />

                <StatCard
                    label="Cash sales"
                    value={cashCount}
                    icon={Banknote}
                    tone="green"
                />

            </div>

            <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">

                <div className="p-5 border-b border-surface-line">

                    <div className="relative w-full sm:w-80">

                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />

                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="h-10 w-full rounded-control border border-surface-line bg-surface-muted pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                        />

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-surface-muted/60 border-b border-surface-line">

                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Date
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Customer
                                </th>

                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">
                                    Total
                                </th>

                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Type
                                </th>

                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredSales.length > 0 ? (

                                filteredSales.map((sale, index) => (

                                    <tr
                                        key={sale.saleId}
                                        className={`hover:bg-surface-muted/70 transition-colors ${index !== filteredSales.length - 1
                                            ? "border-b border-surface-line"
                                            : ""
                                            }`}
                                    >

                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(sale.dateSold)}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {sale.customerName}
                                        </td>

                                        <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                                            {peso(sale.totalAmount)}
                                        </td>

                                        <td className="px-6 py-4">

                                            {sale.isCredit ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                                                    Credit
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-status-paid" />
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
                                                    className="p-2 rounded-control text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
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
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                                <Receipt size={22} className="text-brand-600" />
                                            </div>
                                            <p className="text-slate-800 font-semibold">
                                                No sales found
                                            </p>
                                            <p className="text-slate-500 text-sm mt-1">
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