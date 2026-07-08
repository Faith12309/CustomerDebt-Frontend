import { Search } from "lucide-react";

function SearchBar({
    value,
    onChange,
    placeholder = "Search..."
}) {

    return (

        <div className="relative w-full md:w-80">

            <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    );

}

export default SearchBar;