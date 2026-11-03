import { Search } from "lucide-react";

function SearchBar({
    value,
    onChange,
    placeholder = "Search..."
}) {

    return (

        <div className="relative w-full md:w-80">

            <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-4 rounded-control border border-surface-line bg-white text-sm text-slate-700 placeholder-slate-400 shadow-card outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
            />

        </div>

    );

}

export default SearchBar;