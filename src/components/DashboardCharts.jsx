import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { TrendingUp, PieChart } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

ChartJS.defaults.font.family =
    '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';

/* Same status colors as the rest of the system */
const DEBT_COLORS = {
    Paid: "#10B981",
    "Partial Paid": "#F59E0B",
    Unpaid: "#F97316",
    Overdue: "#EF4444",
};

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    });

/* Draws the peso value above each bar */
const barValueLabels = {
    id: "barValueLabels",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = "#0F172A";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        chart.getDatasetMeta(0).data.forEach((bar, i) => {
            const value = chart.data.datasets[0].data[i];
            ctx.fillText(peso(value), bar.x, bar.y - 6);
        });
        ctx.restore();
    },
};

const tooltipStyle = {
    backgroundColor: "#0B1020",
    padding: 10,
    cornerRadius: 8,
    titleFont: { size: 12 },
    bodyFont: { size: 12 },
};

function DashboardCharts({
    dashboard,
    salesSummary
}) {
    const salesData = {
        labels: ["Cash sales", "Credit sales"],
        datasets: [
            {
                label: "Sales",
                data: [
                    salesSummary?.cashSales ?? 0,
                    salesSummary?.creditSales ?? 0
                ],
                backgroundColor: [
                    "#10B981",
                    "#4F46E5"
                ],
                borderRadius: 10,
                borderSkipped: false,
                maxBarThickness: 72,
            }
        ]
    };

    const salesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                ...tooltipStyle,
                callbacks: {
                    label: (ctx) => peso(ctx.parsed.y),
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: "#475569", font: { size: 12, weight: 500 } },
            },
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: "#EEF0F6" },
                ticks: {
                    color: "#94A3B8",
                    font: { size: 11 },
                    callback: (v) => peso(v),
                },
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
                borderRadius: 6,
                hoverOffset: 4,
            }
        ]
    };

    const debtOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
            legend: { display: false },
            tooltip: tooltipStyle,
        },
    };

    const debtTotal = debtValues.reduce((sum, v) => sum + v, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Sales overview */}
            <div className="rounded-card border border-surface-line bg-white p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                        <TrendingUp size={18} className="text-brand-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Sales overview
                        </h2>
                        <p className="text-xs text-slate-500">
                            Cash vs credit transactions
                        </p>
                    </div>
                </div>

                <div className="h-64">
                    <Bar
                        data={salesData}
                        options={salesOptions}
                        plugins={[barValueLabels]}
                    />
                </div>
            </div>

            {/* Debt status */}
            <div className="rounded-card border border-surface-line bg-white p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                        <PieChart size={18} className="text-brand-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Debt status
                        </h2>
                        <p className="text-xs text-slate-500">
                            Breakdown across all customer debts
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Donut with total in the middle */}
                    <div className="relative h-48 w-48 shrink-0">
                        <Doughnut data={debtData} options={debtOptions} />
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold leading-none text-slate-900 tabular-nums">
                                {debtTotal}
                            </span>
                            <span className="mt-1 text-xs text-slate-500">
                                total debts
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-3">
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
                                        <span className="text-slate-600 truncate">
                                            {label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-semibold text-slate-900 tabular-nums">
                                            {value}
                                        </span>
                                        <span className="text-slate-400 text-xs w-9 text-right tabular-nums">
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