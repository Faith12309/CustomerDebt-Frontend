import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Debts from "../pages/Debts";
import Reports from "../pages/Reports";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Users from "../pages/Users";

import MainLayout from "../layouts/MainLayout";

// Admin-only route guard
function AdminRoute({ children }) {
    const role = localStorage.getItem("role");

    if (role !== "Admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* Main Layout */}
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/sales" element={<Sales />} />

                {/* Admin only - Staff cannot access even by typing URL */}
                <Route
                    path="/users"
                    element={
                        <AdminRoute>
                            <Users />
                        </AdminRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default AppRoutes;