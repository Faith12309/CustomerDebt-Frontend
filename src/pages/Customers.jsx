import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import CustomerTable from "../components/CustomerTable";
import SearchBar from "../components/SearchBar";
import CustomerModal from "../components/CustomerModal";
import ViewCustomerModal from "../components/ViewCustomerModal";

import {
    getCustomers,
    searchCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/customerService";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    async function loadCustomers() {

        try {

            const data = await getCustomers();
            setCustomers(data);

        }
        catch (error) {

            console.error(error);

        }

    }

    async function handleSearch(e) {

        const keyword = e.target.value;

        setSearch(keyword);

        if (keyword.trim() === "") {

            await loadCustomers();
            return;

        }

        try {

            const data = await searchCustomer(keyword);
            setCustomers(data);

        }
        catch (error) {

            console.error(error);

        }

    }

    async function handleSave(customer) {

        console.log("Selected Customer:", selectedCustomer);
        console.log("Customer Form:", customer);

        try {

            if (selectedCustomer) {

                await updateCustomer(selectedCustomer.id, customer);

            }
            else {

                await addCustomer(customer);

            }

            await loadCustomers();

            setIsModalOpen(false);
            setSelectedCustomer(null);

        }
        catch (error) {

            console.error(error);
            alert("Unable to save customer.");

        }

    }

    async function handleDelete(customer) {

        const confirmDelete = window.confirm(
            `Delete ${customer.fullName}?`
        );

        if (!confirmDelete) return;

        try {

            await deleteCustomer(customer.id);

            await loadCustomers();

        }
        catch (error) {

            console.error(error);
            alert("Unable to delete customer.");

        }

    }
    useEffect(() => {

        loadCustomers();

    }, []);

    return (

        <div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

                <div>
                    <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                        Customers
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {customers.length} {customers.length === 1 ? "customer" : "customers"}
                    </p>
                </div>

                <button
                    onClick={() => {

                        setSelectedCustomer(null);
                        setIsModalOpen(true);

                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-control text-sm font-semibold flex items-center gap-2 transition-colors"
                >

                    <Plus size={18} />
                    Add customer

                </button>

            </div>

            <div className="mb-6">

                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search customer..."
                />

            </div>

            <CustomerTable
                customers={customers}

                onView={(customer) => {

                    setSelectedCustomer(customer);
                    setIsViewOpen(true);

                }}

                onEdit={(customer) => {

                    setSelectedCustomer(customer);
                    setIsModalOpen(true);

                }}

                onDelete={handleDelete}
            />

            <CustomerModal
                isOpen={isModalOpen}
                customer={selectedCustomer}
                onSave={handleSave}
                onClose={() => {

                    setIsModalOpen(false);
                    setSelectedCustomer(null);

                }}
            />

            <ViewCustomerModal
                isOpen={isViewOpen}
                customer={selectedCustomer}
                onClose={() => {

                    setIsViewOpen(false);
                    setSelectedCustomer(null);

                }}
            />


        </div>

    );

}

export default Customers;