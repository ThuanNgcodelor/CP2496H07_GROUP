import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryGrid() {
    const categories = [
        { id: 1, name: 'Thời Trang Nam', icon: '👔', link: '/shop?category=men' },
        { id: 2, name: 'Điện Thoại', icon: '📱', link: '/shop?category=phone' },
        { id: 3, name: 'Thiết Bị Điện Tử', icon: '💻', link: '/shop?category=electronics' },
        { id: 4, name: 'Máy Ảnh', icon: '📷', link: '/shop?category=camera' },
        { id: 5, name: 'Đồng Hồ', icon: '⌚', link: '/shop?category=watch' },
        { id: 6, name: 'Giày Dép Nam', icon: '👟', link: '/shop?category=shoes' },
        { id: 7, name: 'Thiết Bị Gia Dụng', icon: '🔌', link: '/shop?category=home' },
        { id: 8, name: 'Thể Thao & Du Lịch', icon: '⚽', link: '/shop?category=sports' },
        { id: 9, name: 'Ô Tô & Xe Máy', icon: '🏍️', link: '/shop?category=vehicles' },
        { id: 10, name: 'Thời Trang Nữ', icon: '👗', link: '/shop?category=women' }
    ];

    return (
        <div style={{ background: 'white', padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <h4 style={{ fontSize: '16px', color: '#757575', marginBottom: '16px', textTransform: 'uppercase' }}>
                    Danh Mục
                </h4>
                <div className="row g-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="col-6 col-md-4 col-lg-2">
                            <Link
                                to={cat.link}
                                style={{
                                    textDecoration: 'none',
                                    display: 'block'
                                }}
                            >
                                <div
                                    style={{
                                        background: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '4px',
                                        padding: '20px 10px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        height: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#ee5a6f';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(238,90,111,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>
                                        {cat.icon}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '13px',
                                            color: '#333',
                                            lineHeight: '1.3'
                                        }}
                                    >
                                        {cat.name}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
