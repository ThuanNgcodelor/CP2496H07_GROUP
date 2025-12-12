import React from "react";

const formatVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "₫";

export function CheckoutSection({
  addresses,
  selectedAddressId,
  addressLoading,
  selectedItems,
  selectedQuantity,
  selectedSubtotal,
  shippingFee,
  calculatingShippingFee,
  selected,
  allChecked,
  orderLoading,
  onToggleAll,
  onOpenAddressModal,
  onRefreshAddresses,
  onCheckout,
  navigate,
  paymentMethod,
  onPaymentMethodChange
}) {
  const totalWithShipping = selectedSubtotal + (shippingFee || 0);
  return (
    <div className="row">
      <style>{`
        .checkout-card {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .checkout-card h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
          color: #444;
        }
        .summary-row + .summary-row {
          border-top: 1px dashed #eee;
        }
        .summary-value {
          font-weight: 600;
          color: #222;
        }
        .btn-ghost {
          border: 1px solid #d9d9d9;
          color: #555;
          background: #fff;
          padding: 10px 14px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .btn-ghost:hover:not(:disabled) {
          border-color: #ee4d2d;
          color: #ee4d2d;
        }
        .btn-primary-strong {
          background: linear-gradient(135deg, #ee4d2d, #f57245);
          color: #fff;
          border: none;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 600;
          width: 100%;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .btn-primary-strong:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .btn-primary-strong:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff5f0;
          color: #ee4d2d;
          border: 1px solid #ffd8cc;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
        }
        .payment-box {
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          padding: 12px;
          margin-top: 12px;
          background: #fafafa;
        }
        .payment-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 8px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .payment-option:hover {
          border-color: #ee4d2d;
          background: #fff7f3;
        }
        .payment-option.selected {
          border-color: #ee4d2d;
          background: #fff5f0;
        }
        .payment-option small {
          color: #777;
        }
      `}</style>
      <div className="address-selection col-md-12 col-lg-6 mb-3">
        <h5>
          Delivery Address{" "}
          {addressLoading && (
            <small className="text-muted">(Loading...)</small>
          )}
        </h5>

        {addressLoading ? (
          <div className="selected-address p-3 border rounded bg-light">
            <p className="text-muted mb-0">Loading addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <>
            <div className="selected-address p-3 border rounded">
              {selectedAddressId ? (
                (() => {
                  const selectedAddr = addresses.find(
                    (a) => a.id === selectedAddressId
                  );
                  return selectedAddr ? (
                    <div>
                      <strong>{selectedAddr.recipientName}</strong>
                      <p className="mb-1">{selectedAddr.streetAddress}</p>
                      <p className="mb-1">{selectedAddr.province}</p>
                      <p className="mb-0">
                        Phone: {selectedAddr.recipientPhone}
                      </p>
                      {selectedAddr.isDefault && (
                        <span className="badge bg-primary">Default</span>
                      )}
                    </div>
                  ) : null;
                })()
              ) : (
                <p className="text-muted">No address selected</p>
              )}
            </div>
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                type="button"
                onClick={onOpenAddressModal}
                style={{
                  borderRadius: "6px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  color: "#111",
                }}
              >
                <i className="fa fa-angle-left me-2"></i>
                {selectedAddressId ? "Change Address" : "Select Address"}
              </button>
              <button
                className="btn btn-light btn-sm d-inline-flex align-items-center justify-content-center"
                type="button"
                onClick={onRefreshAddresses}
                disabled={addressLoading}
                title="Refresh addresses"
                style={{
                  borderRadius: "6px",
                  border: "1px solid #dcdcdc",
                  width: "42px",
                  height: "38px",
                }}
              >
                <i
                  className={`fa fa-refresh ${
                    addressLoading ? "fa-spin" : ""
                  }`}
                  style={{ color: "#666" }}
                ></i>
              </button>
            </div>
          </>
        ) : (
          <div className="selected-address p-3 border rounded bg-light">
            <p className="text-muted mb-2">
              No addresses found. Please add an address to continue.
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => navigate("/information/address")}
              >
                Add Address
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={onRefreshAddresses}
                disabled={addressLoading}
                title="Refresh addresses"
              >
                <i
                  className={`fa fa-refresh ${
                    addressLoading ? "fa-spin" : ""
                  }`}
                ></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="col-md-12 col-lg-6">
        <div className="checkout-card p-4 mt-10 mt-lg-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Order Summary</h5>
          </div>

          <div className="payment-box">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0">Payment Method</h6>
            </div>
            <div
              className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
              onClick={() => onPaymentMethodChange("COD")}
            >
              <input
                type="radio"
                name="payment-method"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => onPaymentMethodChange("COD")}
              />
              <div>
                <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                <small>Pay when you receive the package (supported).</small>
              </div>
            </div>
            <div
              className={`payment-option ${paymentMethod === "VNPAY" ? "selected" : ""}`}
              onClick={() => onPaymentMethodChange("VNPAY")}
            >
              <input
                type="radio"
                name="payment-method"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={() => onPaymentMethodChange("VNPAY")}
              />
              <div>
                <div style={{ fontWeight: 600 }}>VNPay (Sandbox)</div>
                <small>Redirect to VNPay sandbox for card/ATM payment.</small>
              </div>
            </div>
          </div>

          <div className="summary-row">
            <span>Cart Subtotal</span>
            <span className="summary-value">{formatVND(selectedSubtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Selected Quantity</span>
            <span className="summary-value">{selectedQuantity}</span>
          </div>
          <div className="summary-row">
            <span>Shipping Fee</span>
            <span className="summary-value">
              {calculatingShippingFee ? (
                <small className="text-muted">Calculating...</small>
              ) : shippingFee !== null ? (
                formatVND(shippingFee)
              ) : selectedAddressId && selectedItems.length > 0 ? (
                <small className="text-muted">Unable to calculate</small>
              ) : (
                <small className="text-muted">Select address & items</small>
              )}
            </span>
          </div>

          <div className="mt-3">
            {shippingFee !== null ? (
              <>
                <div className="summary-row">
                  <span style={{ color: "#666" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatVND(selectedSubtotal)}</span>
                </div>
                <div className="summary-row">
                  <span style={{ color: "#666" }}>Shipping</span>
                  <span style={{ fontWeight: 600 }}>{formatVND(shippingFee)}</span>
                </div>
                <div className="summary-row" style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ color: "#ee4d2d", fontWeight: 700, fontSize: 18 }}>
                    {formatVND(totalWithShipping)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="summary-row">
                  <span style={{ fontWeight: 700 }}>Subtotal</span>
                  <span style={{ color: "#ee4d2d", fontWeight: 700 }}>{formatVND(selectedSubtotal)}</span>
                </div>
                <small className="text-muted d-block mt-2">
                  {selectedAddressId && selectedItems.length > 0
                    ? "Shipping fee calculation failed. Will be calculated after order creation."
                    : "Select address and items to calculate shipping fee"}
                </small>
              </>
            )}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn-ghost flex-fill"
              type="button"
              onClick={() => onToggleAll(true)}
              disabled={allChecked}
            >
              Select all
            </button>
            <button
              className="btn-ghost flex-fill"
              type="button"
              onClick={() => onToggleAll(false)}
              disabled={selected.size === 0}
            >
              Clear selection
            </button>
          </div>

          <div className="mt-3">
            <button
              className="btn-primary-strong"
              type="button"
              onClick={onCheckout}
              disabled={orderLoading || selected.size === 0}
              title={
                selected.size === 0
                  ? "Please select at least one item"
                  : !selectedAddressId
                  ? "Please select a delivery address"
                  : ""
              }
            >
              {orderLoading ? "Creating Order..." : "Proceed to Checkout"}
            </button>
            {selected.size === 0 && (
              <small className="text-muted d-block mt-2 text-center">
                Selected items will be sent to checkout.
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

