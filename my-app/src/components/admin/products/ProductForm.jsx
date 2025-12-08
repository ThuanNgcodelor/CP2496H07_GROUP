import { useEffect, useState } from "react";

/** 
 * props:
 *  - initial: { id?, name, description, price, originalPrice, discountPercent, stock, status, categoryId, imageId? }
 *  - categories: [{id,name}] to select category
 *  - onSubmit(form, id, file)
 *  - onCancel()
 *  - editingId, submitting, dark
 */
export default function ProductForm({
    initial,
    categories = [],
    editingId,
    onSubmit,
    onCancel,
    submitting,
    dark = false,
}) {
    const [form, setForm] = useState(initial);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(initial);
        setFile(null);
        setErrors({});
    }, [initial]);

    const cls = `form-control ${dark ? "bg-dark text-light border-secondary" : ""}`;
    const sel = `form-select ${dark ? "bg-dark text-light border-secondary" : ""}`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                ["price", "originalPrice", "discountPercent", "stock"].includes(name)
                    ? value === "" ? "" : Number(value)
                    : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validation logic
        const newErrors = {};
        if (!form.name) newErrors.name = "Name is required.";
        if (!form.categoryId) newErrors.categoryId = "Category is required.";
        if (form.price === "" || form.price <= 0) newErrors.price = "Price must be greater than 0.";
        if (form.originalPrice === "" || form.originalPrice < 0) newErrors.originalPrice = "Original price cannot be negative.";
        if (form.discountPercent < 0 || form.discountPercent > 100) newErrors.discountPercent = "Discount must be between 0% and 100%.";
        if (form.price && form.originalPrice && form.price > form.originalPrice) newErrors.price = "Price cannot be higher than the original price.";
        if (form.stock === "" || form.stock < 0) newErrors.stock = "Stock cannot be negative.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const cleaned = { ...form };
        ["price", "originalPrice", "discountPercent", "stock"].forEach((k) => {
            if (cleaned[k] === "" || cleaned[k] == null) cleaned[k] = 0;
        });

        onSubmit?.(cleaned, editingId, file);
    };

    return (
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-6">
                <label htmlFor="name" className="form-label">Product Name</label>
                <input
                    id="name"
                    className={cls}
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            <div className="col-md-6">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    id="description"
                    className={cls}
                    name="description"
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <div className="col-md-6">
                <label htmlFor="categoryId" className="form-label">Category</label>
                <select
                    id="categoryId"
                    className={sel}
                    name="categoryId"
                    value={form.categoryId || ""}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select category --</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {errors.categoryId && <div className="text-danger">{errors.categoryId}</div>}
            </div>

            <div className="col-md-3">
                <label htmlFor="originalPrice" className="form-label">Original Price</label>
                <input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className={cls}
                    name="originalPrice"
                    placeholder="Enter original price"
                    value={form.originalPrice}
                    onChange={handleChange}
                />
                {errors.originalPrice && <div className="text-danger">{errors.originalPrice}</div>}
            </div>

            <div className="col-md-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={cls}
                    name="price"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                />
                {errors.price && <div className="text-danger">{errors.price}</div>}
            </div>

            <div className="col-md-3">
                <label htmlFor="discountPercent" className="form-label">Discount (%)</label>
                <input
                    id="discountPercent"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className={cls}
                    name="discountPercent"
                    placeholder="Enter discount percentage"
                    value={form.discountPercent}
                    onChange={handleChange}
                />
                {errors.discountPercent && <div className="text-danger">{errors.discountPercent}</div>}
            </div>

            <div className="col-md-3">
                <label htmlFor="stock" className="form-label">Stock</label>
                <input
                    id="stock"
                    type="number"
                    step="1"
                    min="0"
                    className={cls}
                    name="stock"
                    placeholder="Enter stock quantity"
                    value={form.stock}
                    onChange={handleChange}
                />
                {errors.stock && <div className="text-danger">{errors.stock}</div>}
            </div>

            <div className="col-md-6">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                    id="status"
                    className={sel}
                    name="status"
                    value={form.status || "IN_STOCK"}
                    onChange={handleChange}
                >
                    <option value="IN_STOCK">IN_STOCK</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
            </div>

            <div className="col-md-3 d-flex align-items-start gap-2">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
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
