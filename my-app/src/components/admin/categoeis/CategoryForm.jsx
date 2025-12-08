import { useEffect, useState } from "react";

export default function CategoryForm({ initial, editingId, onSubmit, onCancel, submitting }) {
    const [form, setForm] = useState(initial);

    useEffect(() => { setForm(initial); }, [initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form, editingId);
    };

    return (
        <form onSubmit={handleSubmit} className="row g-2 mb-4">
            <div className="col-md-4">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="form-control"
                    required
                />
            </div>
            <div className="col-md-6">
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="form-control"
                />
            </div>
            <div className="col-md-2 d-flex align-items-start gap-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
