import React from 'react';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function AnalyticsPage() {
  const stats = {
    todayRevenue: 2850000,
    todayOrders: 15,
    todayProducts: 42,
    growth: '+12.5%'
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sales Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="todo-cards" style={{marginBottom: '30px'}}>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>
            {stats.todayRevenue.toLocaleString()}₫
          </div>
          <div className="label">
            <i className="fas fa-dollar-sign"></i>
            Today's Revenue
          </div>
          <div className="badge bg-success" style={{marginTop: '10px'}}>
            {stats.growth}
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>{stats.todayOrders}</div>
          <div className="label">
            <i className="fas fa-shopping-cart"></i>
            Today's Orders
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>{stats.todayProducts}</div>
          <div className="label">
            <i className="fas fa-box"></i>
            Products on Sale
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>4.8</div>
          <div className="label">
            <i className="fas fa-star"></i>
            Average Rating
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-section">
        <div className="section-title">Revenue Chart - Last 7 Days</div>
        <div className="analytics-content">
          <canvas id="revenueChart" style={{width: '100%', height: '300px'}}>
            {/* Chart placeholder */}
            <div style={{textAlign: 'center', color: '#9ca3af', padding: '40px'}}>
              <i className="fas fa-chart-line" style={{fontSize: '48px', marginBottom: '10px'}}></i>
              <p>Chart data will be displayed here</p>
            </div>
          </canvas>
        </div>
      </div>

      {/* Top Products */}
      <div className="analytics-section" style={{marginTop: '20px'}}>
        <div className="section-title">Best Selling Products</div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Denim Jacket</td>
                <td>120</td>
                <td>35,880,000₫</td>
              </tr>
              <tr>
                <td>Sneaker Shoes</td>
                <td>150</td>
                <td>89,850,000₫</td>
              </tr>
              <tr>
                <td>Slim Jeans</td>
                <td>80</td>
                <td>31,920,000₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
