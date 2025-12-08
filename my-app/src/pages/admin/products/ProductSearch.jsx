export default function ProductSearch({ value, onChange, dark = false }) {
    const textCls = `input-group-text ${dark ? "bg-dark text-light border-secondary" : ""}`;
    const inputCls = `form-control ${dark ? "bg-dark text-light border-secondary" : ""}`;

    return (
        <div className="input-group w-auto">
            <span className={textCls}>Search</span>
            <input
                className={inputCls}
                placeholder="name / description / category"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                aria-label="Search products"
            />
        </div>
    );
}
