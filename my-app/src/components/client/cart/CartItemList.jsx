import React from "react";
import { Link } from "react-router-dom";
import imgFallback from "../../../assets/images/shop/6.png";

export function CartItemList({
  items,
  imageUrls,
  productNames,
  selected,
  updatingQuantities,
  onToggle,
  onToggleAll,
  onRemove,
  onQuantityChange,
  formatCurrency,
  allChecked,
  onBackToShop
}) {
  return (
    <>
      <style>{`
        .cart-table-wrap { overflow-x: hidden; }
        .cart-table table { width: 100% !important; table-layout: fixed; }
        .cart-table table th, .cart-table table td { word-wrap: break-word; overflow-wrap: break-word; }
        .cart-table table thead tr { background: #f9f9f9; }
        .cart-table table thead th { font-weight: 600; color: #444; border-bottom: 1px solid #f0f0f0; }
        .cart-table table th:nth-child(1), .cart-table table td:nth-child(1) { width: 50px; }
        .cart-table table th:nth-child(2), .cart-table table td:nth-child(2) { width: 80px; }
        .cart-table table th:nth-child(3), .cart-table table td:nth-child(3) { width: 200px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-table table th:nth-child(4), .cart-table table td:nth-child(4) { width: 100px; }
        .cart-table table th:nth-child(5), .cart-table table td:nth-child(5) { width: 100px; }
        .cart-table table th:nth-child(6), .cart-table table td:nth-child(6) { width: 120px; }
        .cart-table table th:nth-child(7), .cart-table table td:nth-child(7) { width: 50px; }
        .cart-table table tbody tr { border-bottom: 1px solid #f5f5f5; }
        .cart-table table tbody tr:last-child { border-bottom: none; }
        .cart-table table input[type="checkbox"] { width: 18px; height: 18px; }
        .cart-table .product-remove button { color: #ee4d2d; }
        .cart-table .product-remove button:hover { color: #d63f21; }
        .qty-btn { width: 34px; height: 34px; }
      `}</style>

      <div className="col-lg-12">
        <div className="cart-table-wrap">
          <div className="cart-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={allChecked}
                      onChange={(e) => onToggleAll(e.target.checked)}
                    />
                  </th>
                  <th className="width-thumbnail"></th>
                  <th className="width-name">Product</th>
                  <th className="width-price">Price</th>
                  <th className="width-quantity">Quantity</th>
                  <th className="width-subtotal">Subtotal</th>
                  <th className="width-remove"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const pid = item.productId ?? item.id;
                  const uniqueKey = `${pid}:${item.sizeId || 'no-size'}`;
                  const img = imageUrls[pid] ?? imgFallback;
                  return (
                    <tr key={uniqueKey}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(uniqueKey)}
                          onChange={(e) => onToggle(uniqueKey, e.target.checked)}
                          aria-label={`Select product ${pid}`}
                        />
                      </td>
                      <td className="product-thumbnail">
                        <Link to={`/products/${pid}`}>
                          <img
                            className="w-100"
                            src={img || imgFallback}
                            alt={productNames[pid] || item.productName || "Product"}
                            width="85"
                            height="85"
                            onError={(e) => (e.currentTarget.src = imgFallback)}
                          />
                        </Link>
                      </td>
                      <td className="product-name">
                        <div className="product-details-quality">
                          <div className="pro-qty">
                            {productNames[pid] || item.productName || pid}
                            {item.sizeName && (
                              <span className="text-muted" style={{ display: 'block', fontSize: '0.9em', marginTop: '4px' }}>
                                Size: {item.sizeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="product-price">
                        <span className="amount">{formatCurrency(item.unitPrice)}</span>
                      </td>
                      <td className="cart-quality">
                        <div className="product-details-quality">
                          <div className="pro-qty" style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            width: 'fit-content'
                          }}>
                            <button
                              disabled={updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`)}
                              style={{
                                background: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? '#e9ecef' : '#f6f6f6',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? '#6c757d' : '#333',
                                borderRight: '1px solid #ddd',
                                transition: 'background-color 0.2s',
                                opacity: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? 0.6 : 1
                              }}
                              onMouseEnter={(e) => {
                                if (!updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`)) {
                                  e.target.style.background = '#e9ecef';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`)) {
                                  e.target.style.background = '#f8f9fa';
                                }
                              }}
                              onClick={() => onQuantityChange(item, Math.max(1, item.quantity - 1))}
                            >
                              {updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? '⏳' : '-'}
                            </button>
                            <input
                              type="number"
                              title="Quantity"
                              value={item.quantity}
                              min="1"
                              max={item.stock !== undefined ? item.stock : undefined}
                              disabled={updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`)}
                              style={{
                                border: 'none',
                                padding: '8px',
                                textAlign: 'center',
                                width: '60px',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? '#f8f9fa' : 'white',
                                opacity: updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? 0.6 : 1
                              }}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                const maxStock = item.stock !== undefined ? item.stock : Infinity;
                                const validQuantity = Math.min(newQuantity, maxStock);
                                onQuantityChange(item, validQuantity);
                              }}
                            />
                            <button
                              disabled={updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock)}
                              style={{
                                background: (updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock)) ? '#e9ecef' : '#f8f9fa',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: (updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock)) ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: (updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock)) ? '#6c757d' : '#333',
                                borderLeft: '1px solid #ddd',
                                transition: 'background-color 0.2s',
                                opacity: (updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock)) ? 0.6 : 1
                              }}
                              onMouseEnter={(e) => {
                                const isDisabled = updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock);
                                if (!isDisabled) {
                                  e.target.style.background = '#e9ecef';
                                }
                              }}
                              onMouseLeave={(e) => {
                                const isDisabled = updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) || (item.stock !== undefined && item.quantity >= item.stock);
                                if (!isDisabled) {
                                  e.target.style.background = '#f8f9fa';
                                }
                              }}
                              onClick={() => onQuantityChange(item, item.quantity + 1)}
                            >
                              {updatingQuantities.has(`${item.productId || item.id}:${item.sizeId || 'no-size'}`) ? '⏳' : '+'}
                            </button>
                          </div>
                          {item.stock !== undefined && (
                            <small className="text-muted d-block mt-1">
                              Stock: {item.stock}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="product-total">
                        <span>{formatCurrency(item.totalPrice)}</span>
                      </td>
                      <td className="product-remove">
                        <button
                          type="button"
                          onClick={() => onRemove(item.id, pid)}
                          aria-label="Remove item"
                          className="btn btn-link p-0"
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cart-shiping-update-wrapper">
          <div className="cart-shiping-btn continure-btn">
            <Link className="btn btn-link" to="/shop" onClick={onBackToShop}>
              <i className="fa fa-angle-left"></i> Back To Shop
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

