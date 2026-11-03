import { Clock3, Receipt } from "lucide-react";

const peso = (value) =>
    Number(value ?? 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_STYLES = [
    "bg-brand-100 text-brand-700",
    "bg-cyan-100 text-cyan-700",
    "bg-teal-100 text-teal-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
];

const getAvatarStyle = (name) => {
    name = name || "Walk-in Customer";

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
};

export default function RecentSales({ sales }) {
    return (
        <div className="bg-white rounded-card shadow-card border border-surface-line p-6">

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-900">
                    Recent sales
                </h2>
                <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center">
                    <Clock3 size={18} className="text-brand-600" />
                </div>
            </div>

            {(sales ?? []).length === 0 ? (
                <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-3">
                        <Receipt size={20} className="text-brand-600" />
                    </div>
                    <p className="text-slate-500 text-sm">
                        No recent sales.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-surface-line">
                    {(sales ?? []).map((sale) => (
                        <div
                            key={sale.id}
                            className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarStyle(
                                        sale.customerName
                                    )}`}
                                >
                                    {getInitials(sale.customerName || "Walk-in Customer")}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">
                                        {sale.customerName || "Walk-in Customer"}
                                    </p>
                                    <span
                                        className={`mt-0.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${sale.type === "Credit"
                                            ? "bg-brand-50 text-brand-700"
                                            : "bg-emerald-50 text-emerald-700"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${sale.type === "Credit"
                                                ? "bg-brand-600"
                                                : "bg-status-paid"
                                                }`}
                                        />
                                        {sale.type} sale
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-semibold text-slate-900 tabular-nums">
                                    {peso(sale.amount)}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {new Date(sale.date).toLocaleString("en-PH", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}