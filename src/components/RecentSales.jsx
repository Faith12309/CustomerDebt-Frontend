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
    "bg-blue-50 text-blue-700",
    "bg-violet-50 text-violet-700",
    "bg-teal-50 text-teal-700",
    "bg-amber-50 text-amber-700",
    "bg-rose-50 text-rose-700",
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">
                    Recent sales
                </h2>
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock3 size={16} className="text-blue-600" />
                </div>
            </div>

            {(sales ?? []).length === 0 ? (
                <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <Receipt size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        No recent sales.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                {(sales ?? []).map((sale) => (
                        <div
                            key={sale.id}
                            className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarStyle(
                                        sale.customerName
                                    )}`}
                                >
                                    {getInitials(sale.customerName || "Walk-in Customer")}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                        {sale.customerName || "Walk-in Customer"}
                                    </p>
                                    <span
                                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${sale.type === "Credit"
                                                ? "bg-yellow-50 text-yellow-700"
                                                : "bg-green-50 text-green-700"
                                            }`}
                                    >
                                        {sale.type} sale
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-semibold text-gray-900 tabular-nums">
                                    {peso(sale.amount)}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
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
