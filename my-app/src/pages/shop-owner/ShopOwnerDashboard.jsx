import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function ShopOwnerDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Homepage</h1>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* To-Do List */}
          <div className="dashboard-section">
            <div className="section-title">To-Do List</div>
            <div className="todo-cards">
              <div className="todo-card">
                <div className="count">0</div>
                <div className="label">
                  <i className="fas fa-clock"></i>
                  Waiting for Pickup
                </div>
              </div>
              <div className="todo-card">
                <div className="count">0</div>
                <div className="label">
                  <i className="fas fa-check-circle"></i>
                  Processed
                </div>
              </div>
              <div className="todo-card">
                <div className="count">0</div>
                <div className="label">
                  <i className="fas fa-undo-alt"></i>
                  Returns/Refunds/Cancelled
                </div>
              </div>
              <div className="todo-card">
                <div className="count">0</div>
                <div className="label">
                  <i className="fas fa-lock"></i>
                  Temporarily Locked Products
                </div>
              </div>
            </div>
          </div>

          {/* Sales Analytics */}
          <div className="dashboard-section" style={{ marginTop: '24px' }}>
            <div className="analytics-section">
              <div className="analytics-header">
                <div className="section-title">Sales Analytics</div>
                <Link to="/shop-owner/analytics" className="view-more-link">
                  See more <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="analytics-content">
                <div className="analytics-time">
                  Today 00:00 GMT+7 14:00 (Data changed compared to yesterday)
                </div>
                <div className="analytics-placeholder">
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Featured News */}
          <div className="dashboard-section featured-news-section">
            <div className="analytics-header">
              <div className="section-title">Featured News</div>
              <a href="#" className="view-more-link">
                See more <i className="fas fa-chevron-right"></i>
              </a>
            </div>
            <div className="promo-card">
              <div className="promo-content">
                <h3>BREAKTHROUGH REVENUE WITHOUT WORRYING ABOUT CAPITAL</h3>
                <p>
                  <i className="fas fa-mobile-alt" style={{marginRight: '8px'}}></i>
                  MULTIPLY UP TO 960,000 VND
                </p>
                <div className="promo-highlight">
                  No worries about capital, no need for collateral
                </div>
              </div>
              <div className="promo-icon">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
            <div className="news-placeholder">
              <div className="placeholder-line"></div>
              <div className="placeholder-line"></div>
              <div className="placeholder-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
