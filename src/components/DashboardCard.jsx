function DashboardCard({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

                <div>
                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>
                </div>

                <div className={`${bgColor} p-4 rounded-xl`}>
                    <Icon className={`${iconColor} w-8 h-8`} />
                </div>

            </div>

        </div>
    );
}

export default DashboardCard;