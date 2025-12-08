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
        <h1>Phân Tích Bán Hàng</h1>
      </div>

      {/* Stats Cards */}
      <div className="todo-cards" style={{marginBottom: '30px'}}>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>
            {stats.todayRevenue.toLocaleString()}₫
          </div>
          <div className="label">
            <i className="fas fa-dollar-sign"></i>
            Doanh thu hôm nay
          </div>
          <div className="badge bg-success" style={{marginTop: '10px'}}>
            {stats.growth}
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>{stats.todayOrders}</div>
          <div className="label">
            <i className="fas fa-shopping-cart"></i>
            Đơn hàng hôm nay
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>{stats.todayProducts}</div>
          <div className="label">
            <i className="fas fa-box"></i>
            Sản phẩm đang bán
          </div>
        </div>
        <div className="todo-card">
          <div className="count" style={{fontSize: '32px'}}>4.8</div>
          <div className="label">
            <i className="fas fa-star"></i>
            Đánh giá trung bình
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-section">
        <div className="section-title">Biểu đồ doanh thu 7 ngày qua</div>
        <div className="analytics-content">
          <canvas id="revenueChart" style={{width: '100%', height: '300px'}}>
            {/* Chart placeholder */}
            <div style={{textAlign: 'center', color: '#9ca3af'}}>
              <i className="fas fa-chart-line" style={{fontSize: '48px', marginBottom: '10px'}}></i>
              <p>Dữ liệu biểu đồ sẽ được hiển thị tại đây</p>
            </div>
          </canvas>
        </div>
      </div>

      {/* Top Products */}
      <div className="analytics-section" style={{marginTop: '20px'}}>
        <div className="section-title">Sản phẩm bán chạy</div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đã bán</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Áo khoác denim</td>
                <td>120</td>
                <td>35,880,000₫</td>
              </tr>
              <tr>
                <td>Giày sneaker</td>
                <td>150</td>
                <td>89,850,000₫</td>
              </tr>
              <tr>
                <td>Quần jean slim</td>
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

