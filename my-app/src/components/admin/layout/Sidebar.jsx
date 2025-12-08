import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoLight from '../../../assets/images/logo.png';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isCollapseActive = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <ul className="navbar-nav sidebar accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin">
        <img className="logo-main" src={logoLight} width="153" height="30" alt="Logo" />
      </Link>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item">
        <Link
          className={`nav-link ${isActive("/admin") ? "active" : ""}`}
          to="/admin"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-tachometer-alt" style={{ color: '#1D3557' }}></i>
          <span>Dashboard</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      <div className="sidebar-heading" style={{ color: '#1D3557' }}>Manager</div>

      <li className={`nav-item ${isCollapseActive(["/admin/tables"]) ? "active" : ""}`}>
        <Link
          className={`nav-link collapsed ${isActive("/admin/orders") ? "active" : ""}`}
          to="/admin/orders"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-box" style={{ color: '#1D3557' }}></i>
          <span>Orders</span>
        </Link>
        <Link
          className={`nav-link collapsed ${isActive("/admin/tables/datatables") ? "active" : ""}`}
          to="/admin/tables/datatables"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-users" style={{ color: '#1D3557' }}></i>
          <span>Users</span>
        </Link>
        <Link
          className={`nav-link collapsed ${isActive("/admin/categories") ? "active" : ""}`}
          to="/admin/categories"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-th-large" style={{ color: '#1D3557' }}></i>
          <span>Categories</span>
        </Link>
        <Link
          className={`nav-link collapsed ${isActive("/admin/role-request") ? "active" : ""}`}
          to="/admin/role-request"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-clipboard-list" style={{ color: '#1D3557' }}></i>
          <span>Role Requests</span>
        </Link>
        <Link
          className={`nav-link collapsed ${isActive("/admin/products") ? "active" : ""}`}
          to="/admin/products"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-cogs" style={{ color: '#1D3557' }}></i>
          <span>Products</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      <div className="sidebar-heading" style={{ color: '#1D3557' }}>Utilities</div>
      <li className="nav-item">
        <Link
          className="nav-link"
          to="/admin/charts"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-chart-line" style={{ color: '#1D3557' }}></i>
          <span>Charts</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          to="/admin/logout"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-sign-out-alt" style={{ color: '#1D3557' }}></i>
          <span>Logout</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />
    </ul>
  );
};

export default Sidebar;