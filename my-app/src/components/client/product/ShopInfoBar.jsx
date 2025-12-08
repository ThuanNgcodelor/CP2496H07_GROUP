import React from "react";

export default function ShopInfoBar({
  shopOwner,
  onChat,
  onViewShop,
}) {
  console.log('ShopInfoBar received shopOwner:', shopOwner);
  
  if (!shopOwner) {
    console.log('ShopInfoBar: No shopOwner data');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    return years > 0 ? `${years} years ago` : 'Recently joined';
  };

  const formatCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };
  return (
    <div className="border rounded-3 p-3 mb-3 bg-white">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          {shopOwner.imageUrl ? (
            <img
              src={`/v1/file-storage/get/${shopOwner.imageUrl}`}
              alt={shopOwner.shopName}
              style={{ 
                width: 64, 
                height: 64, 
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #ee4d2d"
              }}
              onError={(e) => {
                e.currentTarget.src = "/vite.svg";
              }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: 64, 
                height: 64, 
                background: "#ee4d2d",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}
            >
              {shopOwner.shopName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="fw-bold">
              {shopOwner.shopName}
              {shopOwner.verified && (
                <i className="fas fa-check-circle text-primary ms-2" title="Verified Shop"></i>
              )}
            </div>
            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
              Online 3 minutes ago
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-danger" onClick={onChat}>
            <i className="fa fa-comments me-1" /> Chat Now
          </button>
          <button className="btn btn-danger" onClick={onViewShop}>
            <i className="fa fa-store me-1" /> View Shop
          </button>
        </div>
      </div>

      <hr className="my-3" />

      <div className="row text-center g-2">
        <div className="col-6 col-md-2">
          <div className="text-muted">Ratings</div>
          <div className="text-danger fw-bold">{formatCount(shopOwner.totalRatings)}</div>
        </div>
        <div className="col-6 col-md-2">
          <div className="text-muted">Response Rate</div>
          <div className="text-danger fw-bold">
            {shopOwner.totalRatings > 100 ? '96%' : '100%'}
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="text-muted">Products</div>
          <div className="text-danger fw-bold">28</div>
        </div>
        <div className="col-6 col-md-2">
          <div className="text-muted">Response Time</div>
          <div className="text-danger fw-bold">within minutes</div>
        </div>
        <div className="col-6 col-md-2">
          <div className="text-muted">Joined</div>
          <div className="text-danger fw-bold">{formatDate(shopOwner.createdAt)}</div>
        </div>
        <div className="col-6 col-md-2">
          <div className="text-muted">Followers</div>
          <div className="text-danger fw-bold">{formatCount(shopOwner.followersCount)}</div>
        </div>
      </div>
    </div>
  );
}


