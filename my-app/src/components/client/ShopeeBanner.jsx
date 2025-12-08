import React, { useState, useEffect } from 'react';

export default function ShopeeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      id: 1,
      title: '12:12 5 DAYS LEFT',
      subtitle: 'INTERNATIONAL WAREHOUSE FAST DELIVERY',
      bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee4d2d 100%)',
      textColor: 'white'
    },
    {
      id: 2,
      title: 'FREESHIP XTRA',
      subtitle: 'Orders from 0₫ - Max 30k',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      textColor: 'white'
    },
    {
      id: 3,
      title: 'DISCOUNT CODE',
      subtitle: 'Voucher 25% off',
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: 'white'
    }
  ];

  useEffect(() => {
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
                height: 'clamp(200px, 30vw, 300px)',
                minHeight: '200px',
                borderRadius: '4px',
                background: banners[currentIndex].bg,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: banners[currentIndex].textColor
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: 700, marginBottom: '12px' }}>
                  {banners[currentIndex].title}
                </h1>
                <p style={{ fontSize: 'clamp(16px, 3vw, 24px)', marginBottom: '24px' }}>
                  {banners[currentIndex].subtitle}
                </p>
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
                  height: 'clamp(100px, 20vw, 143px)',
                  minHeight: '100px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  padding: '8px',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                12:12 1 TAP DOWNLOAD APP 1,000,000
              </div>
              <div
                style={{
                  height: 'clamp(100px, 20vw, 143px)',
                  minHeight: '100px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  padding: '8px',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                12:12 UP TO 50% OFF ON APP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

