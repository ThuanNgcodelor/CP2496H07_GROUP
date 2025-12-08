import { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  approveRequest,
  rejectRequest,
  getPendingRequests,
} from "../../api/role_request";

// Số dòng mỗi trang
const pageSize = 8;

// Chuẩn hoá 1 record từ API về format UI
const normalizeReq = (r) => {
  const requestedRole = r?.requestedRole ?? "";
  const statusRaw = r?.status ?? null;

  return {
    id: r?.id ?? `unknown-${requestedRole}`,
    userId: r?.userId ?? "",
    name: r?.username ?? r?.userId ?? "Unknown",
    role_request: String(requestedRole || "").toUpperCase(),
    status: statusRaw
      ? String(statusRaw).charAt(0).toUpperCase() + String(statusRaw).slice(1)
      : "Pending",
    reason: r?.reason ?? "",
    createdAt: r?.creationTimestamp ?? null,
  };
};

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // id đang Accept/Reject

  // Hàm load dữ liệu
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rolesData = await getPendingRequests();
      
      // Normalize role requests
      const normalizedRoles = rolesData.map(r => normalizeReq(r));
      setRoles(normalizedRoles);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Accept role
  const handleAccept = async (id) => {
    setUpdating(id);
    try {
      await approveRequest(id, 'Approved by admin');
      // Refresh data sau khi approve
      await load();
    } catch (e) {
      console.error("Error approving request:", e);
      setError("Không thể approve request");
    } finally {
      setUpdating(null);
    }
  };
  
  // Reject role
  const handleReject = async (id) => {
    setUpdating(id);
    try {
      await rejectRequest(id, 'Rejected by admin');
      // Refresh data sau khi reject
      await load();
    } catch (e) {
      console.error("Error rejecting request:", e);
      setError("Không thể reject request");
    } finally {
      setUpdating(null);
    }
  };
  // Lọc theo tìm kiếm
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.role_request.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }, [roles, search]);

  // Phân trang client-side
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0">Role Requests</h5>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={load}
            disabled={loading}
            title="Reload"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Đang tải...
              </>
            ) : (
              "↻ Tải lại"
            )}
          </button>
        </div>

        <div className="card-body">
          {/* Error */}
          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <div>{error}</div>
              <button className="btn btn-sm btn-light" onClick={load}>
                Thử lại
              </button>
            </div>
          )}

          {/* Tìm kiếm */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search by name / role / reason..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-control"
            />
          </div>

          {/* Bảng */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Role Request</th>
                  <th>Status</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-5">
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="spinner-border me-2" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : current.length > 0 ? (
                  current.map((r) => (
                    <tr key={r.id}>
                      <td className="text-start">
                        <div className="fw-semibold">{r.name}</div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {r.role_request}
                        </span>
                      </td>
                      <td>
                        {r.status ? (
                          <span
                            className={
                              r.status === "Accepted"
                                ? "badge bg-success"
                                : r.status === "Rejected"
                                ? "badge bg-danger"
                                : "badge bg-secondary"
                            }
                          >
                            {r.status}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Pending</span>
                        )}
                      </td>
                      <td>
                        <div
                          className="btn-group btn-group-sm"
                          role="group"
                          aria-label="Actions"
                        >
                          <button
                            className="btn btn-outline-success"
                            disabled={
                              updating === r.id || r.status === "Accepted"
                            }
                            onClick={() => handleAccept(r.id)}
                          >
                            {updating === r.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              "Accept"
                            )}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            disabled={
                              updating === r.id || r.status === "Rejected"
                            }
                            onClick={() => handleReject(r.id)}
                          >
                            {updating === r.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              "Reject"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-muted py-4">
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {!loading && filtered.length > 0 && (
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Page {safePage} of {totalPages}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    safePage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
