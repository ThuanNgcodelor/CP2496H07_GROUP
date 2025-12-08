import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ShopOwnerSidebar from "./layout/ShopOwnerSidebar";
import ShopOwnerHeader from "./layout/ShopOwnerHeader";
import './ShopOwnerLayout.css';

export default function ShopOwnerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Load Bootstrap và các assets cần thiết
        const loadAssets = () => {
            // Check if Bootstrap CSS is already loaded
            if (!document.getElementById('bootstrap-shop-owner-css')) {
                const bootstrapCSS = document.createElement('link');
                bootstrapCSS.rel = 'stylesheet';
                bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
                bootstrapCSS.id = 'bootstrap-shop-owner-css';
                document.head.appendChild(bootstrapCSS);
            }

            // Load FontAwesome
            if (!document.getElementById('fontawesome-css')) {
                const fontAwesomeCSS = document.createElement('link');
                fontAwesomeCSS.rel = 'stylesheet';
                fontAwesomeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                fontAwesomeCSS.id = 'fontawesome-css';
                document.head.appendChild(fontAwesomeCSS);
            }
        };

        loadAssets();

        return () => {
            // Cleanup if needed
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="shop-owner-layout">
            <ShopOwnerHeader onMenuClick={toggleSidebar} />
            <div className="container-fluid">
                <div className="row">
                    <ShopOwnerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <main className="col-md-10 main-content">
                        <Outlet />
                    </main>
                </div>
            </div>
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
}

