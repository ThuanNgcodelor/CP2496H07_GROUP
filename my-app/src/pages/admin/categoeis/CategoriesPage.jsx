import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import categoryApi from "../../../api/categoryApi";
import CategoryForm from "./CategoryForm";
import CategorySearch from "./CategorySearch";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formInitial, setFormInitial] = useState({ name: "", description: "" });
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [dark, setDark] = useState(false); 

  // load
  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await categoryApi.getAll();
      setCategories(data ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  // CRUD
  const handleSubmit = async (form, id) => {
    setSaving(true);
    setErr("");
    try {
      if (id) await categoryApi.update({ id, name: form.name, description: form.description });
      else await categoryApi.create({ name: form.name, description: form.description });
      await load();
      setEditingId(null);
      setFormInitial({ name: "", description: "" });
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormInitial({ name: cat.name, description: cat.description ?? "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    setErr("");
    try {
      await categoryApi.remove(id);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed");
    }
  };

  // search + sort + pagination
  const filtered = useMemo(() => {
    let result = categories;
    if (q.trim()) {
      const k = q.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(k) ||
          (c.description || "").toLowerCase().includes(k)
      );
    }
    // sort theo tên
    result = [...result].sort((a, b) => {
      const na = (a.name || "").toLowerCase();
      const nb = (b.name || "").toLowerCase();
      if (na < nb) return sortOrder === "asc" ? -1 : 1;
      if (na > nb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [categories, q, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className={dark ? "bg-dark text-light min-vh-100" : "min-vh-100"}>
      <div className="container my-4">
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <h2 className={`m-0 ${dark ? "text-light" : "text-dark"}`}>
            Categories
          </h2>


          <div className="d-flex align-items-center gap-3 flex-wrap">
            <CategorySearch
              value={q}
              onChange={(val) => { setQ(val); setPage(1); }}
              dark={dark}
            />

            {/* Sort */}
            <div className="d-flex align-items-center gap-2">
              <label className={`form-label m-0 ${dark ? "text-light" : "text-dark"}`}>
                Sort
              </label>
              <select
                className={`form-select form-select-sm ${dark ? "bg-dark text-light border-secondary" : ""
                  }`}
                style={{ width: 120 }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>


            {/* Toggle theme */}

            <div className="form-check form-switch ms-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
              />
              <label className="form-check-label ms-1" htmlFor="themeSwitch">
                {dark ? "Dark" : "Light"}
              </label>
            </div>

          </div>
        </div>

        {err && <div className={`alert alert-danger ${dark ? "bg-danger-subtle text-dark" : ""}`}>{err}</div>}
        {loading && <div className={`alert alert-info ${dark ? "bg-info-subtle text-dark" : ""}`}>Loading...</div>}

        <CategoryForm
          initial={formInitial}
          editingId={editingId}
          onSubmit={handleSubmit}
          onCancel={() => { setEditingId(null); setFormInitial({ name: "", description: "" }); }}
          submitting={saving}
          dark={dark}
        />

        <div className={`card shadow-sm ${dark ? "bg-dark text-light border-secondary" : ""}`}>
          <div className="card-body p-2 p-md-3">
            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
              <div className={dark ? "text-light" : "text-muted"}>
                Showing {pageItems.length} of {filtered.length} items
              </div>


              <div className="d-flex align-items-center gap-2">
                <label className="form-label m-0">Per page</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 90 }}
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className={`table table-bordered table-hover align-middle mb-2 ${dark ? "table-dark border-secondary" : ""}`}>
                <thead className={`text-center ${dark ? "" : "table-light"}`}>
                  <tr>
                    <th style={{ minWidth: 200 }}>Name</th>
                    <th>Description</th>
                    <th style={{ width: 200 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => (
                    <tr key={c.id} className="text-center">
                      <td className="text-start">{c.name}</td>
                      <td className="text-start">{c.description}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          {/* EDIT với icon */}
                          <button
                            onClick={() => handleEdit(c)}
                            className="btn btn-sm btn-warning text-white"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square me-1"></i>
                            Edit
                          </button>

                          {/* DELETE với icon */}
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="btn btn-sm btn-danger"
                            title="Delete"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                  {pageItems.length === 0 && !loading && (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-muted">No categories available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination với icon */}
            <nav aria-label="Pagination" className="d-flex justify-content-center">
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className={`page-link ${dark ? "bg-dark text-light border-secondary" : ""}`}
                    onClick={() => goTo(page - 1)}
                    title="Previous"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button
                      className={`page-link ${dark
                        ? p === page
                          ? "bg-primary text-light border-primary"
                          : "bg-dark text-light border-secondary"
                        : ""
                        }`}
                      onClick={() => goTo(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button
                    className={`page-link ${dark ? "bg-dark text-light border-secondary" : ""}`}
                    onClick={() => goTo(page + 1)}
                    title="Next"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>



          </div>
        </div>
      </div>
    </div>
  );
}
