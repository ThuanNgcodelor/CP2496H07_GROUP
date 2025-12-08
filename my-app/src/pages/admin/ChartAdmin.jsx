// ChartAdminLowCode.jsx
// Low-code Chart Builder + Time Aggregation (Daily/Weekly/Monthly/Yearly)

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  BarElement,
  BarController,
  PieController,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Swal from "sweetalert2";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  BarElement,
  BarController,
  PieController,
  Tooltip,
  Legend,
  Filler
);

const PALETTE = {
  primary: "#0d6efd",
  success: "#198754",
  warning: "#ffc107",
  danger: "#dc3545",
  info: "#0dcaf0",
  purple: "#6f42c1",
  pink: "#d63384",
};

const DEFAULTS = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  data: [120, 190, 150, 220, 180, 240, 200],
};

const uid = () => Math.random().toString(36).slice(2, 9);

// ------------------ ChartCard ------------------
function ChartCard({
  chart,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const [openCfg, setOpenCfg] = useState(false);

  // computed series (timeseries -> aggregated)
  const computed = useMemo(() => {
    if (!chart.timeseries || chart.timeseries.length === 0) return null;
    return aggregateTimeSeries(chart.timeseries, {
      period: chart.period || "daily",
      from: chart.dateFrom,
      to: chart.dateTo,
    });
  }, [chart.timeseries, chart.period, chart.dateFrom, chart.dateTo]);

  const config = useMemo(
    () => buildChartJsConfig(chart, computed),
    [chart, computed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    if (chart.type === "line" && chart.fill) {
      const ctx2d = canvas.getContext("2d");
      const g = ctx2d.createLinearGradient(0, 0, 0, canvas.height || 300);
      g.addColorStop(0, hexToRgba(chart.color || PALETTE.primary, 0.35));
      g.addColorStop(1, hexToRgba(chart.color || PALETTE.primary, 0));
      // mutate config safely
      if (config?.data?.datasets?.[0]) {
        config.data.datasets[0].backgroundColor = g;
      }
    }

    instanceRef.current = new Chart(canvas, config);
    return () => instanceRef.current && instanceRef.current.destroy();
  }, [config, chart.type, chart.fill, chart.color]);

  return (
    <div
      className="card shadow mb-4 position-relative"
      style={{ cursor: "grab", userSelect: "none" }}
      draggable
      onDragStart={(e) => onDragStart(e, chart.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, chart.id)}
    >
      <div
        className="card-header py-3 d-flex align-items-center justify-content-between sticky-top"
        style={{ top: 0, background: "#fff", zIndex: 2 }}
      >
        <h6 className="m-0 fw-bold text-primary">{chart.title}</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setOpenCfg((v) => !v)}
            title="Toggle settings"
          >
            ⚙️
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(chart.id)}
            title="Remove chart"
          >
            x
          </button>
        </div>
      </div>

      {openCfg && (
        <div className="px-3 pt-3">
          <ChartEditor chart={chart} onUpdate={onUpdate} />
          <hr className="my-3" />
        </div>
      )}

      <div className="card-body">
        <div style={{ minHeight: chart.height || 320 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

function ChartEditor({ chart, onUpdate }) {
  const [local, setLocal] = useState(chart);
  useEffect(() => setLocal(chart), [chart.id]);

  const set = (patch) => setLocal((s) => ({ ...s, ...patch }));
  const save = () => onUpdate(local.id, local);

  const seedSampleTS = () => {
    // Generate last 6 months of daily values
    const days = 180;
    const out = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      out.push({
        date: d.toISOString().slice(0, 10),
        value: Math.round(80 + Math.random() * 140), // 80..220
      });
    }
    const from = out[0].date;
    const to = out[out.length - 1].date;
    set({
      timeseries: out,
      dateFrom: from,
      dateTo: to,
      period: local.period || "weekly",
      labels: local.labels, // keep fallback labels
      data: local.data,
    });
  };

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={local.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Type</label>
        <select
          className="form-select"
          value={local.type}
          onChange={(e) => set({ type: e.target.value })}
        >
          <option value="line">Area/Line</option>
          <option value="bar">Bar</option>
          <option value="doughnut">Donut</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label">Height (px)</label>
        <input
          type="number"
          className="form-control"
          value={local.height || 320}
          onChange={(e) => set({ height: Number(e.target.value) })}
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Legend</label>
        <select
          className="form-select"
          value={local.legend ? "1" : "0"}
          onChange={(e) => set({ legend: e.target.value === "1" })}
        >
          <option value="1">Show</option>
          <option value="0">Hide</option>
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label">Fill (line)</label>
        <select
          className="form-select"
          value={local.fill ? "1" : "0"}
          onChange={(e) => set({ fill: e.target.value === "1" })}
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>

      {/* ---- Time Aggregation Controls ---- */}
      <div className="col-md-3">
        <label className="form-label">Period</label>
        <select
          className="form-select"
          value={local.period || "daily"}
          onChange={(e) => set({ period: e.target.value })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Date From</label>
        <input
          type="date"
          className="form-control"
          value={local.dateFrom || ""}
          onChange={(e) => set({ dateFrom: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Date To</label>
        <input
          type="date"
          className="form-control"
          value={local.dateTo || ""}
          onChange={(e) => set({ dateTo: e.target.value })}
        />
      </div>
      <div className="col-md-3 d-flex align-items-end">
        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={seedSampleTS}
        >
          Seed sample TS
        </button>
      </div>
      {/* ---- END ---- */}

      <div className="col-md-4">
        <label className="form-label">Color / Palette</label>
        <div className="d-flex gap-2 align-items-center">
          <input
            type="color"
            className="form-control form-control-color"
            value={local.color || PALETTE.primary}
            onChange={(e) => set({ color: e.target.value })}
          />
          <div className="d-flex gap-1">
            {Object.values(PALETTE).map((c) => (
              <button
                key={c}
                type="button"
                className="btn btn-sm border"
                style={{ background: c, width: 28, height: 28 }}
                onClick={() => set({ color: c })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <label className="form-label">Labels (comma-separated)</label>
        <input
          className="form-control"
          value={(local.labels || []).join(", ")}
          onChange={(e) => set({ labels: splitCsv(e.target.value) })}
          placeholder="Mon, Tue, Wed, Thu, Fri, Sat, Sun"
        />
      </div>

      <div className="col-12">
        <label className="form-label">Data values (comma-separated)</label>
        <input
          className="form-control"
          value={(local.data || []).join(", ")}
          onChange={(e) => set({ data: splitCsv(e.target.value).map(numeric) })}
          placeholder="120, 190, 150, 220, 180, 240, 200"
        />
      </div>

      <div className="col-12 d-flex justify-content-end gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setLocal(chart)}
        >
          Reset
        </button>
        <button className="btn btn-primary" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
}

// ------------------ Main Page ------------------
export default function ChartAdminLowCode() {
  const [charts, setCharts] = useState(() => {
    const saved = localStorage.getItem("lowcode_charts_v2"); // bump key to v2
    if (saved) return JSON.parse(saved);
    return [
      makeChart({
        type: "line",
        title: "Area Sessions",
        labels: DEFAULTS.labels,
        data: DEFAULTS.data,
        fill: true,
        color: PALETTE.primary,
        period: "weekly",
      }),
      makeChart({
        type: "bar",
        title: "Bar Counts",
        labels: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
        data: [5, 7, 3, 8, 6],
        color: PALETTE.success,
        period: "monthly",
      }),
      makeChart({
        type: "doughnut",
        title: "Traffic Sources",
        labels: ["Direct", "Referral", "Social", "Email", "Ads"],
        data: [35, 22, 18, 12, 13],
        color: PALETTE.purple,
        period: "monthly",
      }),
    ];
  });

  useEffect(() => {
    localStorage.setItem("lowcode_charts_v2", JSON.stringify(charts));
  }, [charts]);

  const addChart = (type) => {
    if (type === "line")
      setCharts((s) => [
        makeChart({
          type: "line",
          title: "New Area/Line",
          labels: DEFAULTS.labels,
          data: DEFAULTS.data,
          fill: true,
          color: PALETTE.info,
          period: "weekly",
        }),
        ...s,
      ]);
    if (type === "bar")
      setCharts((s) => [
        makeChart({
          type: "bar",
          title: "New Bar",
          labels: ["A", "B", "C", "D"],
          data: [4, 9, 6, 7],
          color: PALETTE.warning,
          period: "monthly",
        }),
        ...s,
      ]);
    if (type === "doughnut")
      setCharts((s) => [
        makeChart({
          type: "doughnut",
          title: "New Donut",
          labels: ["One", "Two", "Three"],
          data: [40, 35, 25],
          color: PALETTE.pink,
          period: "monthly",
        }),
        ...s,
      ]);
  };

  const updateChart = (id, patch) =>
    setCharts((s) => s.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteChart = (id) => setCharts((s) => s.filter((c) => c.id !== id));

  // Drag & Drop
  const dragIdRef = useRef(null);
  const onDragStart = (e, id) => {
    dragIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, overId) => {
    e.preventDefault();
    const fromId = dragIdRef.current;
    if (!fromId || fromId === overId) return;
    setCharts((items) => reorderById(items, fromId, overId));
    dragIdRef.current = null;
  };

  // Export / Import (SweetAlert2)
  const exportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(charts, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `charts-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Export successful",
        text: "Charts exported as JSON file.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Export failed",
        text: e.message || "Unable to export charts.",
      });
    }
  };

  const importJSON = async (file) => {
    if (!file) return;
    const text = await file.text();
    try {
      const next = JSON.parse(text);
      if (Array.isArray(next)) {
        setCharts(next);
        Swal.fire({
          icon: "success",
          title: "Import successful",
          text: "Charts imported successfully.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          position: "top-end",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Invalid JSON",
          text: "Expected an array of charts.",
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Import failed",
        text: e.message || "Unable to parse JSON file.",
      });
    }
  };

  return (
    <div
      className="container-fluid pb-4"
      id="container-wrapper"
      style={{ paddingTop: 16 }}
    >
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Charts (Low-code Builder)</h1>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Charts
          </li>
        </ol>
      </div>

      {/* Toolbar */}
      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-bold me-2">Add chart:</span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => addChart("line")}
          >
            + Area/Line
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => addChart("bar")}
          >
            + Bar
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => addChart("doughnut")}
          >
            + Donut
          </button>

          <div className="vr mx-2" />
          <button className="btn btn-outline-dark btn-sm" onClick={exportJSON}>
            Export JSON
          </button>
          <label
            className="btn btn-outline-dark btn-sm mb-0"
            title="Import from JSON file"
          >
            Import JSON
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => importJSON(e.target.files?.[0])}
            />
          </label>

          <div className="ms-auto small text-muted">Drag cards to reorder</div>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-3">
        {charts.map((c) => (
          <div
            key={c.id}
            className={
              c.type === "doughnut" || c.type === "pie"
                ? "col-12 col-lg-4"
                : "col-12 col-lg-8"
            }
          >
            <ChartCard
              chart={c}
              onUpdate={updateChart}
              onDelete={deleteChart}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------ helpers ------------------
function makeChart({
  type,
  title,
  labels,
  data,
  fill = false,
  color = PALETTE.primary,
  period = "daily",
}) {
  return {
    id: uid(),
    type,
    title,
    labels,
    data,
    fill,
    color,
    legend: true,
    height: type === "doughnut" || type === "pie" ? 300 : 340,
    // aggregation fields
    period, // "daily" | "weekly" | "monthly" | "yearly"
    dateFrom: null,
    dateTo: null,
    timeseries: [], // [{date:"YYYY-MM-DD", value:number}]
  };
}

function reorderById(list, fromId, overId) {
  const srcIdx = list.findIndex((x) => x.id === fromId);
  const dstIdx = list.findIndex((x) => x.id === overId);
  if (srcIdx < 0 || dstIdx < 0) return list;
  const next = list.slice();
  const [moved] = next.splice(srcIdx, 1);
  next.splice(dstIdx, 0, moved);
  return next;
}

function splitCsv(s) {
  return s
    .split(/[,|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function numeric(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function hexToRgba(hex, a = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function buildChartJsConfig(chart, computed) {
  const labels = computed?.labels?.length ? computed.labels : chart.labels;
  const data = computed?.data?.length ? computed.data : chart.data;

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: chart.legend
        ? { display: true, labels: { usePointStyle: true } }
        : { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: undefined,
  };

  if (chart.type === "line" || chart.type === "bar") {
    baseOptions.scales = {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" } },
    };
  }

  if (chart.type === "line") {
    return {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: chart.title,
            data,
            fill: !!chart.fill,
            tension: 0.4,
            borderColor: chart.color || PALETTE.primary,
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: chart.color || PALETTE.primary,
            pointHoverBackgroundColor: chart.color || PALETTE.primary,
            pointHoverBorderColor: "#fff",
          },
        ],
      },
      options: baseOptions,
    };
  }

  if (chart.type === "bar") {
    return {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: chart.title,
            data,
            backgroundColor: (labels || []).map(
              () => chart.color || PALETTE.primary
            ),
            borderColor: (labels || []).map(
              () => chart.color || PALETTE.primary
            ),
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      },
      options: baseOptions,
    };
  }

  // doughnut / pie
  const colors = (labels || []).map((_, i) => multiColor(chart.color, i));
  return {
    type: chart.type,
    data: {
      labels,
      datasets: [
        {
          label: chart.title,
          data,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      ...baseOptions,
      cutout: chart.type === "doughnut" ? "60%" : undefined,
    },
  };
}

// ------------------ time aggregation ------------------
function aggregateTimeSeries(ts, { period = "daily", from, to }) {
  if (!Array.isArray(ts) || ts.length === 0) return { labels: [], data: [] };

  const fromDate = from ? new Date(from + "T00:00:00") : null;
  const toDate = to ? new Date(to + "T23:59:59") : null;

  const buckets = new Map(); // key -> sum
  const order = []; // to preserve order of first appearance

  const add = (key, val) => {
    if (!buckets.has(key)) {
      buckets.set(key, 0);
      order.push(key);
    }
    buckets.set(key, buckets.get(key) + (Number(val) || 0));
  };

  for (const item of ts) {
    const d = new Date(item.date + "T12:00:00"); // avoid TZ edge
    if (isNaN(d)) continue;
    if (fromDate && d < fromDate) continue;
    if (toDate && d > toDate) continue;

    let key;
    switch (period) {
      case "weekly": {
        const { year, isoWeek } = isoWeekOf(d);
        key = `${year}-W${String(isoWeek).padStart(2, "0")}`;
        break;
      }
      case "monthly": {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        break;
      }
      case "yearly": {
        key = `${d.getFullYear()}`;
        break;
      }
      default: {
        key = d.toISOString().slice(0, 10); // daily
      }
    }
    add(key, item.value);
  }

  // Sort keys chronologically
  const sorted = order.sort((a, b) =>
    bucketSortKey(a).localeCompare(bucketSortKey(b))
  );
  const labels = sorted.map((k) => formatBucketLabel(k, period));
  const data = sorted.map((k) => buckets.get(k));
  return { labels, data };
}

function bucketSortKey(key) {
  // Convert "YYYY", "YYYY-MM", "YYYY-Www", "YYYY-MM-DD" into sortable "YYYY-MM-DD"-like strings
  if (/^\d{4}$/.test(key)) return `${key}-12-31`;
  if (/^\d{4}-\d{2}$/.test(key)) return `${key}-28`;
  if (/^\d{4}-W\d{2}$/.test(key)) {
    const [y, w] = key.split("-W");
    // approximate sort key as year + week
    return `${y}-${w}`;
  }
  return key; // daily
}

function formatBucketLabel(key, period) {
  if (period === "weekly" && /^\d{4}-W\d{2}$/.test(key)) {
    return key; // e.g., 2025-W09
  }
  if (period === "monthly" && /^\d{4}-\d{2}$/.test(key)) {
    const [y, m] = key.split("-");
    return `${y}-${m}`;
  }
  return key; // daily or yearly
}

function isoWeekOf(date) {
  // ISO week: Thursday in current week decides the year
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), isoWeek: weekNo };
}

function multiColor(baseHex, idx) {
  const step = 12 * idx;
  const { r, g, b } = hexToRgb(baseHex || PALETTE.primary);
  const rr = clamp(r + step, 0, 255);
  const gg = clamp(g + step / 2, 0, 255);
  const bb = clamp(b - step / 3, 0, 255);
  return `rgb(${rr},${gg},${bb})`;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const bigint = parseInt(full, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
