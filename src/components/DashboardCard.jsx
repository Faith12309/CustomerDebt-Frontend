function DashboardCard({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 leading-snug">
                        {title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        {value}
                    </p>
                </div>
                <div className={`${bgColor} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`${iconColor} w-5 h-5`} />
                </div>
            </div>
        </div>
    );
}
export default DashboardCard;
