import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import Footer from "./layout/Footer";
import {logout} from "../../api/auth.js";

export default function AdminLayout() {
    useEffect(() => {
        // Load admin CSS và JS
        const loadAdminAssets = () => {
            // Load admin CSS
            const adminCSS = document.createElement('link');
            adminCSS.rel = 'stylesheet';
            adminCSS.href = '/src/assets/admin/css/ruang-admin.min.css';
            adminCSS.id = 'admin-css';
            document.head.appendChild(adminCSS);

            // Load FontAwesome CSS
            const fontAwesomeCSS = document.createElement('link');
            fontAwesomeCSS.rel = 'stylesheet';
            fontAwesomeCSS.href = '/src/assets/admin/vendor/fontawesome-free/css/all.min.css';
            fontAwesomeCSS.id = 'fontawesome-css';
            document.head.appendChild(fontAwesomeCSS);

            // Load Bootstrap CSS
            const bootstrapCSS = document.createElement('link');
            bootstrapCSS.rel = 'stylesheet';
            bootstrapCSS.href = '/src/assets/admin/vendor/bootstrap/css/bootstrap.min.css';
            bootstrapCSS.id = 'bootstrap-admin-css';
            document.head.appendChild(bootstrapCSS);

            // Load DataTables CSS
            const dataTablesCSS = document.createElement('link');
            dataTablesCSS.rel = 'stylesheet';
            dataTablesCSS.href = '/src/assets/admin/vendor/datatables/dataTables.bootstrap4.min.css';
            dataTablesCSS.id = 'datatables-css';
            document.head.appendChild(dataTablesCSS);

            // Load jQuery
            if (!window.$) {
                const jqueryScript = document.createElement('script');
                jqueryScript.src = '/src/assets/admin/vendor/jquery/jquery.min.js';
                jqueryScript.id = 'jquery-script';
                document.body.appendChild(jqueryScript);
            }

            // Load Bootstrap JS
            const bootstrapJS = document.createElement('script');
            bootstrapJS.src = '/src/assets/admin/vendor/bootstrap/js/bootstrap.bundle.min.js';
            bootstrapJS.id = 'bootstrap-js';
            document.body.appendChild(bootstrapJS);

            // Load jQuery Easing
            const easingJS = document.createElement('script');
            easingJS.src = '/src/assets/admin/vendor/jquery-easing/jquery.easing.min.js';
            easingJS.id = 'easing-js';
            document.body.appendChild(easingJS);

            // Load admin JS
            const adminJS = document.createElement('script');
            adminJS.src = '/src/assets/admin/js/ruang-admin.min.js';
            adminJS.id = 'admin-js';
            document.body.appendChild(adminJS);

            // Load DataTables JS
            const dataTablesJS = document.createElement('script');
            dataTablesJS.src = '/src/assets/admin/vendor/datatables/jquery.dataTables.min.js';
            dataTablesJS.id = 'datatables-js';
            document.body.appendChild(dataTablesJS);

            const dataTablesBootstrapJS = document.createElement('script');
            dataTablesBootstrapJS.src = '/src/assets/admin/vendor/datatables/dataTables.bootstrap4.min.js';
            dataTablesBootstrapJS.id = 'datatables-bootstrap-js';
            document.body.appendChild(dataTablesBootstrapJS);
        };

        loadAdminAssets();

        // Cleanup khi component unmount
        return () => {
            const assetsToRemove = [
                'admin-css', 'fontawesome-css', 'bootstrap-admin-css', 'datatables-css',
                'jquery-script', 'bootstrap-js', 'easing-js', 'admin-js', 
                'datatables-js', 'datatables-bootstrap-js'
            ];
            
            assetsToRemove.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.remove();
                }
            });
        };
    }, []);

    return (
        <div id="page-top">
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopBar />
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Scroll to top */}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>

            {/* Modal Logout */}
            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabelLogout"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabelLogout">Ohh No!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                            <a href="/login" className="btn btn-primary">Logout</a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


