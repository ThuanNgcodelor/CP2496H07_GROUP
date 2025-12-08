export default function CategorySearch({ value, onChange, dark = false }) {
    const groupTextCls = `input-group-text ${dark ? "bg-dark text-light border-secondary" : ""}`;
    const inputCls = `form-control ${dark ? "bg-dark text-light border-secondary" : ""}`;

    return (
        <div className="input-group w-auto">
            <span className={groupTextCls}>Search</span>
            <input
                className={inputCls}
                placeholder="name / description"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                aria-label="Search categories"
            />
        </div>
    );
}
