import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import CustomerTable from "../components/CustomerTable";
import SearchBar from "../components/SearchBar";
import CustomerModal from "../components/CustomerModal";

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

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Customers
                </h1>

                <button
                    onClick={() => {

                        setSelectedCustomer(null);
                        setIsModalOpen(true);

                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >

                    <Plus size={18} />
                    Add Customer

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

        </div>

    );

}

export default Customers;