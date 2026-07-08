function Header() {

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (

        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">

            <div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Customer Debt Management System
                </h1>

                <p className="text-gray-500 text-sm">
                    {today}
                </p>

            </div>

            <div className="text-right">

                <h2 className="font-semibold text-slate-700">
                    Welcome,
                    <span className="text-blue-600"> {username}</span>
                </h2>

                <p className="text-sm text-gray-500">
                    {role}
                </p>

            </div>

        </header>

    );
}

export default Header;