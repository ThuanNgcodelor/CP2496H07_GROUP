import React from 'react';

export default function BannerCarousel() {
    const banners = [
        {
            id: 1,
            title: 'KHUYẾN MÃI KHỦNG',
            subtitle: 'Giảm giá lên đến 50%',
            bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            textColor: 'white'
        },
        {
            id: 2,
            title: 'FREESHIP XTRa',
            subtitle: 'Đơn từ 0đ - Tối đa 30k',
            bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            textColor: 'white'
        },
        {
            id: 3,
            title: 'MÃ GIẢM GIÁ',
            subtitle: 'Voucher giảm 25%',
            bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            textColor: 'white'
        }
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div style={{ background: '#F5F5F5', padding: '16px 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row g-3">
                    {/* Main Banner */}
                    <div className="col-12 col-lg-8">
                        <div
                            style={{
                                height: '300px',
                                borderRadius: '8px',
                                background: banners[currentIndex].bg,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="d-flex flex-column justify-content-center h-100 px-5">
                                <h1
                                    style={{
                                        fontSize: '42px',
                                        fontWeight: 700,
                                        color: banners[currentIndex].textColor,
                                        marginBottom: '12px',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {banners[currentIndex].title}
                                </h1>
                                <p
                                    style={{
                                        fontSize: '24px',
                                        color: banners[currentIndex].textColor,
                                        marginBottom: '24px',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {banners[currentIndex].subtitle}
                                </p>
                                <div>
                                    <button
                                        style={{
                                            background: 'white',
                                            color: '#ee5a6f',
                                            border: 'none',
                                            padding: '12px 32px',
                                            borderRadius: '4px',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        MUA NGAY
                                    </button>
                                </div>
                            </div>

                            {/* Dots */}
                            <div
                                className="d-flex gap-2 justify-content-center"
                                style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}
                            >
                                {banners.map((_, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        style={{
                                            width: currentIndex === idx ? '24px' : '8px',
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Banners */}
                    <div className="col-12 col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            <div
                                style={{
                                    height: '143px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                FLASH SALE 12.12
                            </div>
                            <div
                                style={{
                                    height: '143px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                MÃ GIẢM GIÁ 50%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
