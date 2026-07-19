import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Debts from "../pages/Debts";
import Reports from "../pages/Reports";
import Products from "../pages/Products";


import MainLayout from "../layouts/MainLayout";

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

            </Route>

        </Routes>
    );
}

export default AppRoutes;