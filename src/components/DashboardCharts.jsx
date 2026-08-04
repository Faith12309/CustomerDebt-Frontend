import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { TrendingUp, PieChart } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const DEBT_COLORS = {
    Paid: "#22C55E",
    "Partial Paid": "#EAB308",
    Unpaid: "#EF4444",
    Overdue: "#A855F7",
};

function DashboardCharts({
    dashboard,
    salesSummary
}) {
    const salesData = {
        labels: ["Cash Sales", "Credit Sales"],
        datasets: [
            {
                label: "Sales",
                data: [
                    salesSummary?.cashSales ?? 0,
                    salesSummary?.creditSales ?? 0
                ],
                backgroundColor: [
                    "#10B981",
                    "#3B82F6"
                ],
                borderRadius: 8,
                maxBarThickness: 72,
            }
        ]
    };

    const salesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#111827",
                padding: 10,
                cornerRadius: 8,
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#6B7280", font: { size: 12 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: "#F3F4F6" },
                ticks: { color: "#9CA3AF", font: { size: 11 } },
            },
        },
    };

    const debtLabels = ["Paid", "Partial Paid", "Unpaid", "Overdue"];
    const debtValues = [
        dashboard?.paidDebts ?? 0,
        dashboard?.partialPaidDebts ?? 0,
        dashboard?.unpaidDebts ?? 0,
        dashboard?.overdueDebts ?? 0,
    ];

    const debtData = {
        labels: debtLabels,
        datasets: [
            {
                data: debtValues,
                backgroundColor: debtLabels.map((label) => DEBT_COLORS[label]),
                borderWidth: 3,
                borderColor: "#ffffff",
            }
        ]
    };

    const debtOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#111827",
                padding: 10,
                cornerRadius: 8,
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
            },
        },
    };

    const debtTotal = debtValues.reduce((sum, v) => sum + v, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Sales overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Sales overview
                        </h2>
                        <p className="text-xs text-gray-400">
                            Cash vs credit transactions
                        </p>
                    </div>
                </div>

                <div className="h-64">
                    <Bar data={salesData} options={salesOptions} />
                </div>
            </div>

            {/* Debt status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <PieChart size={16} className="text-purple-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Debt status
                        </h2>
                        <p className="text-xs text-gray-400">
                            Breakdown across all customer debts
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-48 w-48 shrink-0">
                        <Pie data={debtData} options={debtOptions} />
                    </div>

                    <div className="flex-1 w-full space-y-2.5">
                        {debtLabels.map((label, index) => {
                            const value = debtValues[index];
                            const pct = debtTotal
                                ? Math.round((value / debtTotal) * 100)
                                : 0;

                            return (
                                <div
                                    key={label}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: DEBT_COLORS[label] }}
                                        />
                                        <span className="text-gray-600 truncate">
                                            {label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-semibold text-gray-900">
                                            {value}
                                        </span>
                                        <span className="text-gray-400 text-xs w-9 text-right">
                                            {pct}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DashboardCharts;
