import { useEffect, useState } from "react";
import { Wallet, PiggyBank, CheckCircle2, AlertTriangle, FileText, Download } from "lucide-react";
import { getDebts } from "../services/debtService";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

/* Same status colors as the rest of the system */
const STATUS_STYLES = {
    Paid: { chip: "bg-emerald-50 text-emerald-700", dot: "bg-status-paid" },
    "Partial Paid": { chip: "bg-amber-50 text-amber-700", dot: "bg-status-partial" },
    Unpaid: { chip: "bg-orange-50 text-orange-700", dot: "bg-status-unpaid" },
    Overdue: { chip: "bg-red-50 text-red-700", dot: "bg-status-overdue" },
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || {
        chip: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}

const TONES = {
    brand: "bg-brand-50 text-brand-600",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
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

function Reports() {
    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState("All");

    async function loadReports() {
        try {
            const data = await getDebts();
            setReports(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadReports();
    }, []);

    // Filter Reports
    const filteredReports =
        reportType === "All"
            ? reports
            : reports.filter((report) => report.status === reportType);

    // Totals
    const totalAmount = filteredReports.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalRemaining = filteredReports.reduce(
        (sum, item) => sum + Number(item.remainingBalance),
        0
    );

    const paidCount = filteredReports.filter(
        (report) => report.status === "Paid"
    ).length;

    const overdueCount = filteredReports.filter(
        (report) => report.status === "Overdue"
    ).length;

    // Export to PDF
    function handleExport() {
        if (filteredReports.length === 0) {
            alert("No data to export.");
            return;
        }

        Promise.all([
            import("jspdf"),
            import("jspdf-autotable"),
        ]).then(([jsPDFModule, autoTableModule]) => {
            const { jsPDF } = jsPDFModule;
            const autoTable = autoTableModule.default;

            const doc = new jsPDF();

            const filterLabel =
                reportType === "All" ? "All Reports" : reportType;

            // Title
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Cleofer Store - Debt Report", 14, 18);

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Report Type: ${filterLabel}`, 14, 26);
            doc.text(
                `Generated: ${new Date().toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}`,
                14,
                32
            );

            // Table data
            const tableColumn = ["Customer", "Amount", "Remaining", "Status", "Due Date"];
            const tableRows = filteredReports.map((report) => {
                const due = new Date(report.dueDate);
                const dueDate = Number.isNaN(due.getTime())
                    ? report.dueDate
                    : due.toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });

                return [
                    report.customerName ?? "",
                    `PHP ${Number(report.amount ?? 0).toFixed(2)}`,
                    `PHP ${Number(report.remainingBalance ?? 0).toFixed(2)}`,
                    report.status ?? "",
                    dueDate,
                ];
            });

            // Use autoTable correctly
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [15, 98, 214],
                    textColor: 255,
                    fontStyle: "bold",
                },
                alternateRowStyles: {
                    fillColor: [246, 247, 251],
                },
                columnStyles: {
                    1: { halign: "right" },
                    2: { halign: "right" },
                },
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: "center" }
                );
            }

            // Download
            const fileName = `debt-report-${filterLabel
                .toLowerCase()
                .replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;

            doc.save(fileName);
        });
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">Reports</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Review debt performance and payment history across your customers.
                </p>
            </div>

            {/* Report Type + Export */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                    Report type
                </label>

                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="h-10 rounded-control border border-surface-line bg-white px-4 text-sm text-slate-800 shadow-card outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                >
                    <option value="All">All reports</option>
                    <option value="Paid">Paid debts</option>
                    <option value="Unpaid">Unpaid debts</option>
                    <option value="Partial Paid">Partial paid</option>
                    <option value="Overdue">Overdue debts</option>
                </select>

                <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
                >
                    <Download size={16} />
                    Export PDF
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total debt amount"
                    value={peso(totalAmount)}
                    icon={Wallet}
                    tone="brand"
                />
                <StatCard
                    label="Total remaining balance"
                    value={peso(totalRemaining)}
                    icon={PiggyBank}
                    tone="amber"
                />
                <StatCard
                    label="Paid debts"
                    value={paidCount}
                    icon={CheckCircle2}
                    tone="green"
                />
                <StatCard
                    label="Overdue debts"
                    value={overdueCount}
                    icon={AlertTriangle}
                    tone="red"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-muted/60 border-b border-surface-line">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Customer
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">
                                    Amount
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">
                                    Remaining
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Due date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                                <FileText size={22} className="text-brand-600" />
                                            </div>
                                            <p className="text-slate-800 font-semibold">
                                                No records found
                                            </p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Try a different report type.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report, index) => (
                                    <tr
                                        key={report.id}
                                        className={`hover:bg-surface-muted/70 transition-colors ${index !== filteredReports.length - 1
                                            ? "border-b border-surface-line"
                                            : ""
                                            }`}
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {report.customerName}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 tabular-nums">
                                            {peso(report.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                                            {peso(report.remainingBalance)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(report.dueDate)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Reports;