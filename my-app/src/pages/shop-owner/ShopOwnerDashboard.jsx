import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function ShopOwnerDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Trang Chủ</h1>
      </div>

      {/* Danh sách cần làm */}
      <div className="dashboard-section">
        <div className="section-title">Danh sách cần làm</div>
        <div className="todo-cards">
          <div className="todo-card">
            <div className="count">0</div>
            <div className="label">
              <i className="fas fa-clock"></i>
              Chờ Lấy Hàng
            </div>
          </div>
          <div className="todo-card">
            <div className="count">0</div>
            <div className="label">
              <i className="fas fa-check-circle"></i>
              Đã Xử Lý
            </div>
          </div>
          <div className="todo-card">
            <div className="count">0</div>
            <div className="label">
              <i className="fas fa-undo-alt"></i>
              Đơn Trả hàng/Hoàn tiền/Huỷ
            </div>
          </div>
          <div className="todo-card">
            <div className="count">0</div>
            <div className="label">
              <i className="fas fa-lock"></i>
              Sản Phẩm Bị Tạm Khóa
            </div>
          </div>
        </div>
      </div>

      {/* Phân Tích Bán Hàng */}
      <div className="dashboard-section">
        <div className="analytics-section">
          <div className="analytics-header">
            <div className="section-title">Phân Tích Bán Hàng</div>
            <a href="/shop-owner/analytics" className="view-more-link">
              Xem thêm <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="analytics-content">
            <div className="analytics-time">
              Hôm nay 00:00 GMT+7 14:00 (Dữ liệu thay đổi so với hôm qua)
            </div>
            {/* Placeholder for charts */}
          </div>
        </div>
      </div>

      {/* Tin Nổi Bật */}
      <div className="dashboard-section featured-news-section">
        <div className="section-title">Tin Nổi Bật</div>
        <a href="#" className="view-more-link" style={{float: 'right', marginTop: '-25px'}}>
          Xem thêm <i className="fas fa-chevron-right"></i>
        </a>
        <div className="promo-card">
          <div className="promo-content">
            <h3>BỨT PHÁ DOANH THU KHÔNG LO VỀ VỐN</h3>
            <p>
              <i className="fas fa-mobile-alt" style={{marginRight: '8px'}}></i>
              NHÂN LÊN ĐẾN 960.000 ĐỒNG
            </p>
            <div className="promo-highlight">
              Không lo về vốn, không cần thế chấp
            </div>
          </div>
          <div className="promo-icon">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

