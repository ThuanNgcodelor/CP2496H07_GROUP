import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const initialCategories = [
  { id: "C1", name: "Electronics", description: "Devices and gadgets" },
  { id: "C2", name: "Books", description: "Printed and digital books" },
  { id: "C3", name: "Clothing", description: "Apparel and fashion" },
  { id: "C4", name: "Home", description: "Household items" },
  { id: "C5", name: "Sports", description: "Sporting goods" },
  { id: "C6", name: "Beauty", description: "Cosmetics and skincare" },
  { id: "C7", name: "Toys", description: "Children toys" },
  { id: "C8", name: "Garden", description: "Outdoor & garden" },
  { id: "C9", name: "Music", description: "Instruments and media" },
  { id: "C10", name: "Art", description: "Art supplies" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({ id: "", name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // ------- CRUD -------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...form, id: editingId } : c)));
      setEditingId(null);
    } else {
      setCategories((prev) => [...prev, form]);
    }
    setForm({ id: "", name: "", description: "" });
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setEditingId(cat.id);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ------- Search & Pagination -------
  const filtered = useMemo(() => {
    if (!q.trim()) return categories;
    const k = q.toLowerCase();
    return categories.filter(
      (c) => c.id.toLowerCase().includes(k) || c.name.toLowerCase().includes(k) || c.description.toLowerCase().includes(k)
    );
  }, [categories, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset trang nếu tìm kiếm làm số trang thay đổi
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="container my-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h2 className="m-0">Categories</h2>
        <div className="input-group w-auto">
          <span className="input-group-text">Search</span>
          <input
            className="form-control"
            placeholder="id / name / description"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Form thêm / sửa */}
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-2">
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={form.id}
            onChange={handleChange}
            className="form-control"
            disabled={editingId !== null}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3 d-flex align-items-start gap-2">
          <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ id: "", name: "", description: "" });
                setEditingId(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card shadow-sm">
        <div className="card-body p-2 p-md-3">
          <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
            <div className="text-muted">Showing {pageItems.length} of {filtered.length} items</div>
            <div className="d-flex align-items-center gap-2">
              <label className="form-label m-0">Per page</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 90 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-2">
              <thead className="table-light text-center">
                <tr>
                  <th style={{width: 100}}>ID</th>
                  <th style={{minWidth: 200}}>Name</th>
                  <th>Description</th>
                  <th style={{width: 200}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id} className="text-center">
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td className="text-start">{c.description}</td>
                    <td>
                      <div className="btn-group">
                        <button onClick={() => handleEdit(c)} className="btn btn-sm btn-warning text-white">Edit</button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-muted">No categories available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Pagination" className="d-flex justify-content-center">
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goTo(page - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => goTo(p)}>{p}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goTo(page + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
