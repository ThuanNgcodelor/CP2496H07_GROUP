import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/client/Header.jsx';
import { getShopOwnerByUserId } from '../../api/user';
import { getProducts } from '../../api/shopOwner';

export default function ShopDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');

  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true);
        console.log('Loading shop data for userId:', userId);
        const shopData = await getShopOwnerByUserId(userId);
        console.log('Shop data received:', shopData);
        setShopInfo(shopData);
      } catch (error) {
        console.error('Error loading shop:', error);
        alert('Failed to load shop information: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadShopData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="wrapper">
        <Header />
        <div className="container py-5 text-center">
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ee4d2d' }}></i>
          <p className="mt-3">Loading shop information...</p>
        </div>
      </div>
    );
  }

  if (!shopInfo) {
    return (
      <div className="wrapper">
        <Header />
        <div className="container py-5 text-center">
          <h3>Shop not found</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="wrapper">
      <Header />
      <main className="main-content bg-light">
        <div className="container py-4">
          {/* Shop Header */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center gap-3">
                    {shopInfo.imageUrl ? (
                      <img
                        src={`/v1/file-storage/get/${shopInfo.imageUrl}`}
                        alt={shopInfo.shopName}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '3px solid #ee4d2d'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/vite.svg';
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: '#ee4d2d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {shopInfo.shopName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="mb-1">
                        {shopInfo.shopName}
                        {shopInfo.verified && (
                          <i className="fas fa-check-circle text-primary ms-2" title="Verified"></i>
                        )}
                      </h3>
                      <div className="text-muted">
                        <i className="fas fa-clock me-1"></i> Online 3 minutes ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button className="btn btn-danger me-2">
                    <i className="fas fa-plus me-1"></i> Follow
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="fas fa-comment me-1"></i> Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Stats */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 col-md-2 mb-3 mb-md-0">
                  <div className="text-muted small">Products</div>
                  <div className="fw-bold text-danger">28</div>
                </div>
                <div className="col-6 col-md-2 mb-3 mb-md-0">
                  <div className="text-muted small">Following</div>
                  <div className="fw-bold text-danger">{shopInfo.followingCount || 0}</div>
                </div>
                <div className="col-6 col-md-2 mb-3 mb-md-0">
                  <div className="text-muted small">Ratings</div>
                  <div className="fw-bold text-danger">
                    {shopInfo.totalRatings ? `${(shopInfo.totalRatings / 1000).toFixed(1)}k` : '0'}
                    {shopInfo.totalRatings > 0 && (
                      <span className="text-warning ms-1">
                        ★ {(Math.random() * 0.9 + 4.1).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-6 col-md-2 mb-3 mb-md-0">
                  <div className="text-muted small">Chat Response Rate</div>
                  <div className="fw-bold text-danger">
                    {shopInfo.totalRatings > 100 ? '96%' : '100%'}
                    <span className="text-success small ms-1">(Within Hours)</span>
                  </div>
                </div>
                <div className="col-6 col-md-2 mb-3 mb-md-0">
                  <div className="text-muted small">Followers</div>
                  <div className="fw-bold text-danger">
                    {shopInfo.followersCount ? `${(shopInfo.followersCount / 1000).toFixed(1)}k` : '0'}
                  </div>
                </div>
                <div className="col-6 col-md-2">
                  <div className="text-muted small">Joined</div>
                  <div className="fw-bold text-danger">{formatDate(shopInfo.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'intro' ? 'active text-danger' : 'text-dark'}`}
                    onClick={() => setActiveTab('intro')}
                    style={{ border: 'none', background: 'none' }}
                  >
                    Introduction
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'products' ? 'active text-danger' : 'text-dark'}`}
                    onClick={() => setActiveTab('products')}
                    style={{ border: 'none', background: 'none' }}
                  >
                    Products
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'games' ? 'active text-danger' : 'text-dark'}`}
                    onClick={() => setActiveTab('games')}
                    style={{ border: 'none', background: 'none' }}
                  >
                    Games
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'intro' && (
                <div>
                  <h5 className="text-danger mb-3">About the Shop</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <strong>Shop Name:</strong> {shopInfo.shopName}
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Owner:</strong> {shopInfo.ownerName || 'N/A'}
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Email:</strong> {shopInfo.email || 'N/A'}
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong>Address:</strong> {shopInfo.address || 'Not updated'}
                    </div>
                    <div className="col-12 mb-3">
                      <strong>Status:</strong>{' '}
                      {shopInfo.verified ? (
                        <span className="badge bg-success">
                          <i className="fas fa-check-circle me-1"></i>
                          Verified
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Not Verified</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'products' && (
                <div className="text-center py-5">
                  <p className="text-muted">Product list is under development...</p>
                </div>
              )}
              {activeTab === 'games' && (
                <div className="text-center py-5">
                  <p className="text-muted">Feature is under development...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

