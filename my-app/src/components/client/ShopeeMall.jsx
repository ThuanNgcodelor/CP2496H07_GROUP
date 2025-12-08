import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopeeMall() {
  const brands = [
    { id: 1, name: "L'Oréal", offer: 'Up to 50% off', logo: '💄' },
    { id: 2, name: 'Tresemmé', offer: 'Buy 1 Get 1', logo: '🧴' },
    { id: 3, name: 'Unilever', offer: 'Buy 1 Get 6', logo: '🧼' },
    { id: 4, name: 'CeraVe', offer: 'Buy 1 Get 2', logo: '🧴' },
    { id: 5, name: 'La Roche-Posay', offer: 'Gift with every order', logo: '💊' },
    { id: 6, name: 'Deli', offer: 'Deli super sale', logo: '📦' }
  ];

  return (
    <div style={{ background: 'white', padding: '24px 0', marginTop: '8px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 style={{ fontSize: '18px', color: '#ee4d2d', fontWeight: 600, marginBottom: '8px' }}>
              SHOPEE MALL
            </h4>
            <div className="d-flex gap-3" style={{ fontSize: '12px', color: '#666' }}>
              <span>• 15 Days Free Return</span>
              <span>• 100% Genuine Products</span>
              <span>• Free Shipping</span>
            </div>
          </div>
          <Link to="/shop" style={{ color: '#ee4d2d', textDecoration: 'none', fontSize: '14px' }}>
            View All →
          </Link>
        </div>
        
        <div className="row g-3">
          {/* Left Banner */}
          <div className="col-12 col-lg-3">
            <div
              style={{
                height: '100%',
                minHeight: '200px',
                background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b6b 100%)',
                borderRadius: '4px',
                padding: '24px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <i className="fa fa-star" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
              <h5 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Shopee HUNT SUPER HOT DEALS
              </h5>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>UP TO 50% OFF</p>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>VOUCHER SHOPEE</p>
            </div>
          </div>
          
          {/* Brand Cards */}
          <div className="col-12 col-lg-9">
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/shop?brand=${brand.name}`}
                  style={{
                    minWidth: 'clamp(120px, 15vw, 150px)',
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    padding: '16px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ee4d2d';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(238,77,45,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    {brand.logo}
                  </div>
                  <div style={{ fontSize: '14px', color: '#333', fontWeight: 500, marginBottom: '4px' }}>
                    {brand.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ee4d2d' }}>
                    {brand.offer}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

