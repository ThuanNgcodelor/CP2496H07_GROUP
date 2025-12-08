import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../../../api/auth.js";
import { getUser } from "../../../api/user.js";
import Address from "./Address.jsx";
import AccountInfo from "./AccountInfo.jsx";
import RoleRequestForm from "./RoleRequestForm.jsx";
import OrderList from "./OrderList.jsx";
import NotificationPage from "./NotificationPage.jsx";
import Loading from "../Loading.jsx";

export default function User() {
    const [, setUserInfo] = useState(null);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        } else {
            const role = getUserRole();
            setUserInfo(role);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const response = await getUser();
                setUserData(response);
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const path = location.pathname.split("/")[2];
        if (path) {
            setActiveTab(path);
        } else {
            setActiveTab("dashboard");
        }
    }, [location.pathname]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div style={{ background: '#F5F5F5', minHeight: '100vh', padding: '20px 0', width: '100%' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row g-3">
                    {/* Left Sidebar - Shopee Style */}
                    <div className="col-12 col-lg-3">
                        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
                            {/* User Profile */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            background: '#E8ECEF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <i className="fa fa-user" style={{ fontSize: '20px', color: '#666' }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#222', marginBottom: '4px' }}>
                                            {userData?.username || 'User'}
                                        </div>
                                        <Link
                                            to="/information/account-info"
                                            onClick={() => handleTabClick('account-info')}
                                            style={{
                                                fontSize: '12px',
                                                color: '#ee4d2d',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Edit Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Banner */}
                            <div style={{ padding: '16px', background: '#fff5f0', borderBottom: '1px solid #f0f0f0' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: '#ee4d2d',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '12px'
                                    }}>
                                        12.12
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', color: '#ee4d2d', fontWeight: 500 }}>
                                            12.12 Super Birthday Sale
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#999' }}>New</div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <div>
                                <button
                                    onClick={() => handleTabClick("notifications")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "notifications" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "notifications" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-bell" style={{ width: '20px', textAlign: 'center' }}></i>
                                    Notifications
                                </button>

                                <button
                                    onClick={() => handleTabClick("dashboard")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "dashboard" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "dashboard" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                                    My Account
                                </button>

                                {/* Sub-menu for Account */}
                                {activeTab === "dashboard" && (
                                    <div style={{ paddingLeft: '48px', background: '#fafafa' }}>
                                        <button
                                            onClick={() => handleTabClick("account-info")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "account-info" ? '#ee4d2d' : '#666',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => handleTabClick("address")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "address" ? '#ee4d2d' : '#666',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            Address
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleTabClick("orders")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "orders" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "orders" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-file-text" style={{ width: '20px', textAlign: 'center' }}></i>
                                    My Orders
                                </button>

                                <button
                                    onClick={() => handleTabClick("role-request")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "role-request" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "role-request" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-user-tie" style={{ width: '20px', textAlign: 'center' }}></i>
                                    Role Request
                                </button>

                                <button
                                    onClick={() => handleTabClick("vouchers")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "vouchers" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "vouchers" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-ticket" style={{ width: '20px', textAlign: 'center' }}></i>
                                    Voucher Wallet
                                </button>

                                <button
                                    onClick={() => handleTabClick("coins")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "coins" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "coins" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-coins" style={{ width: '20px', textAlign: 'center', color: '#ffc107' }}></i>
                                    Shopee Coins
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-12 col-lg-9">
                        {activeTab === "orders" ? (
                            <OrderList />
                        ) : (
                            <div style={{ background: 'white', borderRadius: '4px', minHeight: '400px' }}>
                                {/* Dashboard Tab */}
                                {activeTab === "dashboard" && (
                                    <div className="p-4">
                                        <h5 style={{ color: '#222', marginBottom: '16px', fontSize: '18px' }}>My Account</h5>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                            Hello, <strong>{userData?.username}</strong>!
                                        </p>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                            From your account management page, you can view recent orders, manage shipping addresses, and edit personal information.
                                        </p>
                                    </div>
                                )}

                                {/* Address Tab */}
                                {activeTab === "address" && (
                                    <div className="p-4">
                                        <Address />
                                    </div>
                                )}

                                {/* Account Info Tab */}
                                {activeTab === "account-info" && (
                                    <div className="p-4">
                                        <AccountInfo />
                                    </div>
                                )}

                                {/* Role Request Tab */}
                                {activeTab === "role-request" && (
                                    <div className="p-4">
                                        <RoleRequestForm />
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="p-4">
                                        <NotificationPage />
                                    </div>
                                )}

                                {/* Vouchers Tab */}
                                {activeTab === "vouchers" && (
                                    <div className="p-4">
                                        <div className="text-center py-5">
                                            <i className="fa fa-ticket" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
                                            <p style={{ color: '#999', fontSize: '14px' }}>No vouchers yet</p>
                                        </div>
                                    </div>
                                )}

                                {/* Coins Tab */}
                                {activeTab === "coins" && (
                                    <div className="p-4">
                                        <div className="text-center py-5">
                                            <i className="fa fa-coins" style={{ fontSize: '48px', color: '#ffc107', marginBottom: '16px' }}></i>
                                            <p style={{ color: '#999', fontSize: '14px' }}>You don't have any Shopee Coins</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
