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

const normalize = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");

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
        } catch (error) {
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
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSave(customer) {
        try {
            // Kuhaon ang FULL list (dili ang filtered nga search result)
            // para sigurado nga tinuod ang duplicate check.
            const allCustomers = await getCustomers();

            const duplicate = allCustomers.some(
                (c) =>
                    normalize(c.fullName) === normalize(customer.fullName) &&
                    c.id !== selectedCustomer?.id
            );

            if (duplicate) {
                alert("Naa nay customer nga ingon ani ang pangalan.");
                return;
            }

            if (!customer.idImage) {
                alert("Valid ID image is required.");
                return;
            }

            const payload = {
                ...customer,
                fullName: customer.fullName.trim().replace(/\s+/g, " "),
                address: customer.address.trim(),
                idNumber: customer.idNumber.trim(),
            };

            if (selectedCustomer) {
                await updateCustomer(selectedCustomer.id, payload);
            } else {
                await addCustomer(payload);
            }

            await loadCustomers();
            setIsModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                    "Unable to save customer."
            );
        }
    }

    async function handleDelete(customer) {
        const confirmDelete = window.confirm(`Delete ${customer.fullName}?`);
        if (!confirmDelete) return;

        try {
            await deleteCustomer(customer.id);
            await loadCustomers();
        } catch (error) {
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

            {/* Conditional render: mo-mount ug bag-o ang form matag open,
                so mo-reset ang form ug husto ang data sa edit. */}
            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    customer={selectedCustomer}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedCustomer(null);
                    }}
                />
            )}

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