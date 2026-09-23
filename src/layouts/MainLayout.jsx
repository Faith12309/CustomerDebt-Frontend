import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Menu } from "lucide-react";

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;