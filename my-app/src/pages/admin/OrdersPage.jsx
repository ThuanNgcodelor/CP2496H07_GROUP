// src/pages/admin/OrdersPage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getAllOrders, updateOrderStatus } from "../../api/order";
import { getAllUser } from "../../api/user.js";
import Modal from "bootstrap/js/dist/modal";
import Swal from "sweetalert2";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Bootstrap modal
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: "static",
      });
    }
  }, []);

  // Toast helper
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

  // Utils
  const formatMoney = (n) =>
    (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
    " đ";
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString("vi-VN") : "-";
  const isPending = (s) => String(s || "").toUpperCase() === "PENDING";
  const statusRank = (s) => (isPending(s) ? 0 : 1);
  const toTime = (iso) => (iso ? new Date(iso).getTime() : 0);

  const normalizeOrder = (o) => ({
    id: o?.id ?? "-",
    customer: o?.userId ? `${o.userId}` : "-",
    createdAt: o?.creationTimestamp ?? null,
    updatedAt: o?.updateTimestamp ?? null,
    total: o?.totalPrice ?? 0,
    status: o?.orderStatus ?? "PENDING",
    notes: o?.notes ?? null,
    shippingAddress: o?.shippingAddress ?? null,
    paymentMethod: o?.paymentMethod ?? null,
    items: Array.isArray(o?.orderItems) ? o.orderItems : [],
    raw: o,
  });

  // Refetch helper
  const loadOrders = useCallback(async () => {
    try {
      const usersData = await getAllUser();
      setUsers(usersData);
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : data
        ? [data]
        : [];
      const normalized = list.filter(Boolean).map(normalizeOrder);
      setOrders(normalized);
      return normalized;
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || "Failed to load orders"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        String(o.id).toLowerCase().includes(q) ||
        String(o.customer).toLowerCase().includes(q) ||
        String(o.status).toLowerCase().includes(q)
    );
  }, [orders, keyword]);

  // Sort: PENDING first, then newest
  const visible = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const r = statusRank(a.status) - statusRank(b.status);
      if (r !== 0) return r;
      return toTime(b.createdAt) - toTime(a.createdAt);
    });
  }, [filtered]);

  const badgeClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "PENDING" || s === "PROCESSING")
      return "badge bg-warning text-dark";
    if (s === "SHIPPED") return "badge bg-info";
    if (s === "COMPLETED" || s === "DELIVERED") return "badge bg-success";
    if (s === "CANCELLED" || s === "FAILED") return "badge bg-danger";
    return "badge bg-secondary";
  };

  // Modal helpers
  const openModal = (o) => {
    setActive(o);
    modalInstanceRef.current?.show();
  };
  const closeModal = () => {
    modalInstanceRef.current?.hide();
    setActive(null);
  };
  const handleName = (id) => {
    const name = users.find((u) => String(u.id) === String(id))?.username || id;
    return name;
  };

  // Approve with SweetAlert2 confirmation + feedback
  const onApprove = async (o) => {
    if (!o) return;

    // Confirm dialog
    const confirm = await Swal.fire({
      title: "Approve this order?",
      html: `<div class="text-start">
                <div><strong>Order ID:</strong> ${o.id}</div>
                <div><strong>Customer:</strong> ${handleName(o.customer)}</div>
                <div><strong>Total:</strong> ${formatMoney(o.total)}</div>
             </div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0d6efd",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      setUpdatingId(o.id);
      const res = await updateOrderStatus(o.id);

      // Success toast
      toast.fire({
        icon: "success",
        title: "Order approved",
      });

      // 1) Optimistic update if API returns updated order
      const maybe = res?.id ? res : res?.data?.id ? res.data : null;
      if (maybe) {
        const normalized = normalizeOrder(maybe);
        setOrders((prev) =>
          prev.map((x) =>
            String(x.id) === String(normalized.id) ? normalized : x
          )
        );
        // sync modal if open
        setActive((prev) =>
          prev && String(prev.id) === String(normalized.id) ? normalized : prev
        );
      } else {
        // 2) Fallback: refetch and sync modal
        const fresh = await loadOrders();
        const updated = fresh.find((x) => String(x.id) === String(o.id));
        if (updated) setActive((prev) => (prev ? updated : prev));
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Approve failed",
        text: e?.response?.data?.message || e.message || "Something went wrong",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="col-lg-12 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Orders Management</h1>
        <input
          className="form-control"
          style={{ maxWidth: 360 }}
          placeholder="Search by order ID / customer / status"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 d-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading…</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Customer</th>
                    <th>Created At</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No orders
                      </td>
                    </tr>
                  ) : (
                    visible.map((o) => (
                      <tr key={o.id}>
                        <td>{handleName(o.customer)}</td>
                        <td>{formatDate(o.createdAt)}</td>
                        <td>{formatMoney(o.total)}</td>
                        <td>
                          <span className={badgeClass(o.status)}>
                            {o.status}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => openModal(o)}
                          >
                            Details
                          </button>
                          {isPending(o.status) && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => onApprove(o)}
                              disabled={updatingId === o.id}
                              title={
                                updatingId === o.id
                                  ? "Processing..."
                                  : "Approve order"
                              }
                            >
                              {updatingId === o.id
                                ? "Approving…"
                                : "Approve order"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Order Details {active ? `#${active.id}` : ""}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {!active ? null : (
                <>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="small text-muted">Customer</div>
                      <div>{handleName(active.customer)}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Status</div>
                      <div>
                        <span className={badgeClass(active.status)}>
                          {active.status}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Created At</div>
                      <div>{formatDate(active.createdAt)}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Updated At</div>
                      <div>{formatDate(active.updatedAt)}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Total</div>
                      <div>{formatMoney(active.total)}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Payment Method</div>
                      <div>{active.paymentMethod || "-"}</div>
                    </div>
                    <div className="col-12">
                      <div className="small text-muted">Shipping Address</div>
                      <div>{active.shippingAddress || "-"}</div>
                    </div>
                    {active.notes ? (
                      <div className="col-12">
                        <div className="small text-muted">Notes</div>
                        <div>{active.notes}</div>
                      </div>
                    ) : null}
                  </div>

                  <hr className="my-3" />
                  <h6 className="mb-2">Items</h6>
                  {active.items?.length ? (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {active.items.map((it, idx) => {
                            const name =
                              it?.productName ||
                              it?.name ||
                              it?.productId ||
                              `Item ${idx + 1}`;
                            const qty = it?.quantity ?? it?.qty ?? 1;
                            const price = it?.price ?? it?.unitPrice ?? 0;
                            const subtotal = (qty || 0) * (price || 0);
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{String(name)}</td>
                                <td>{qty}</td>
                                <td>{formatMoney(price)}</td>
                                <td>{formatMoney(subtotal)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted">No items</div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              {active && isPending(active.status) && (
                <button
                  className="btn btn-primary"
                  onClick={() => onApprove(active)}
                  disabled={updatingId === active.id}
                >
                  {updatingId === active.id ? "Approving…" : "Approve order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
