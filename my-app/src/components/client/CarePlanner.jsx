// src/components/client/CarePlanner.jsx
import React, { useMemo, useState } from "react";

/* ================== DỮ LIỆU CỨNG: LOÀI → GIỐNG → GỢI Ý ================== */
const MASTER_DATA = {
  dog: {
    label: "Dog",
    breeds: [
      { value: "poodle", label: "Poodle" },
      { value: "labrador", label: "Labrador Retriever" },
      { value: "shiba", label: "Shiba Inu" },
      { value: "mixed", label: "Mixed/Unknown" },
    ],
    suggestions: [
      {
        breeds: ["poodle"],
        weightMin: 2,
        weightMax: 10,
        care: "Grooming every 4–6 weeks; daily brushing.",
        nutrition: "High-quality small-breed kibble, 2–3 meals/day.",
        schedule: "Vet check every 6 months; deworming each quarter.",
      },
      {
        breeds: ["labrador"],
        weightMin: 20,
        weightMax: 40,
        care: "Daily exercise 45–60 minutes; joint care supplements.",
        nutrition: "Balanced adult formula with omega-3; portion control.",
        schedule: "Annual bloodwork; dental scaling every 12–18 months.",
      },
      {
        breeds: ["shiba"],
        weightMin: 6,
        weightMax: 12,
        care: "Weekly deshedding; mental stimulation games.",
        nutrition: "Moderate protein formula; avoid overfeeding.",
        schedule: "Vaccination per schedule; tick/flea prevention monthly.",
      },
      {
        breeds: ["mixed"],
        weightMin: 1,
        weightMax: 60,
        care: "Care by size & coat; observe behavior/activity level.",
        nutrition: "Choose formula by size & age; fresh water at all times.",
        schedule: "Standard vaccines; parasite prevention year-round.",
      },
    ],
  },
  cat: {
    label: "Cat",
    breeds: [
      { value: "domestic_short", label: "Domestic Short Hair" },
      { value: "persian", label: "Persian" },
      { value: "maine_coon", label: "Maine Coon" },
      { value: "mixed", label: "Mixed/Unknown" },
    ],
    suggestions: [
      {
        breeds: ["persian"],
        weightMin: 2,
        weightMax: 6,
        care: "Daily eye/face cleaning; brushing every day.",
        nutrition: "Hairball-control diet; split into small frequent meals.",
        schedule: "Annual dental check; vaccine boosters per vet advice.",
      },
      {
        breeds: ["maine_coon"],
        weightMin: 5,
        weightMax: 11,
        care: "Regular grooming; joint monitoring for large breeds.",
        nutrition: "High-protein wet + dry mix; watch weight gain.",
        schedule: "Annual screening; hypertrophic cardiomyopathy check.",
      },
      {
        breeds: ["domestic_short", "mixed"],
        weightMin: 2,
        weightMax: 8,
        care: "Indoor enrichment; nail trim every 3–4 weeks.",
        nutrition: "Balanced adult cat diet; consider wet food for hydration.",
        schedule: "Deworming quarterly; flea prevention monthly.",
      },
    ],
  },
};

/* ================== BẢNG MÀU LÔNG MẪU ================== */
const COAT_COLORS = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "brown", label: "Brown" },
  { value: "gold", label: "Golden" },
  { value: "mixed", label: "Mixed" },
];

/* ================== FORM + GỢI Ý ================== */
export default function CarePlanner() {
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("poodle");
  const [coat, setCoat] = useState("mixed");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const speciesData = MASTER_DATA[species];
  const breedOptions = speciesData.breeds;

  React.useEffect(() => {
    setBreed(breedOptions[0]?.value || "");
  }, [species]); // eslint-disable-line

  const matched = useMemo(() => {
    if (!weight || Number.isNaN(+weight)) return null;
    const w = parseFloat(weight);
    const rules =
      speciesData.suggestions.filter((s) => s.breeds.includes(breed)) ||
      speciesData.suggestions.filter((s) => s.breeds.includes("mixed"));
    const byWeight =
      rules.find((r) => w >= r.weightMin && w <= r.weightMax) || rules[0];
    return byWeight || null;
  }, [speciesData, breed, weight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || Number.isNaN(+weight)) {
      setResult({ error: "Please enter a valid weight (kg)." });
      return;
    }
    if (!matched) {
      setResult({
        care: "General grooming and exercise routine based on size.",
        nutrition: "Balanced diet appropriate for life stage.",
        schedule: "Standard vaccines & parasite control.",
      });
      return;
    }
    setResult(matched);
  };

  return (
    <section className="container mb-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title mb-3">Care & Nutrition Suggestions (Form)</h5>
          <p className="text-muted mb-4">
            Select species, breed, coat color and weight. We’ll suggest a care
            plan and feeding guidance from predefined rules. Looks “smart” like
            AI—no ML required.
          </p>

          {/* ================= FORM (aligned & equal height) ================= */}
          {/* UPDATED */}
          <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
            <div className="col-12 col-md-3">
              <label className="form-label">Species</label>
              <select
                className="form-select"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                {Object.entries(MASTER_DATA).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Breed</label>
              <select
                className="form-select"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              >
                {breedOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Coat Color</label>
              <select
                className="form-select"
                value={coat}
                onChange={(e) => setCoat(e.target.value)}
              >
                {COAT_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="form-control"
                placeholder="e.g. 7.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            {/* Buttons row */}
            <div className="col-12 d-flex flex-column flex-md-row gap-3 mt-1">
              <button type="submit" className="btn btn-primary flex-fill">
                GET SUGGESTIONS
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={() => setResult(null)}
              >
                CLEAR
              </button>
            </div>
          </form>

          {/* Equal height for inputs/selects */}
          {/* UPDATED */}
          <style>{`
            .form-select, .form-control {
              min-height: 44px;
            }
          `}</style>

          {/* ================= RESULT ================= */}
          {result && (
            <div className="alert alert-info mt-4 mb-0">
              {result.error ? (
                <strong>{result.error}</strong>
              ) : (
                <>
                  <h6 className="mb-2">
                    Suggested Plan for <em>{speciesData.label}</em> —{" "}
                    <em>
                      {(breedOptions.find((b) => b.value === breed) || {}).label}
                    </em>{" "}
                    ({coat} coat, {weight}kg)
                  </h6>
                  <ul className="mb-0">
                    <li>
                      <strong>Care:</strong> {result.care}
                    </li>
                    <li>
                      <strong>Nutrition:</strong> {result.nutrition}
                    </li>
                    <li>
                      <strong>Schedule:</strong> {result.schedule}
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
