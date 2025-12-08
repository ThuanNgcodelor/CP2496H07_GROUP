import React, { useState, useEffect } from "react";
import CarePlanner from "./CarePlanner";

const BRAND_RED = "#ff4d55";

const RIGHT_PADDING = 20;
const BOTTOM_PADDING = 16;  
const CHAT_BUBBLE_SIZE = 64; 
const GAP = 12;      

export default function FloatingCareLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>

      <button
        type="button"
        aria-label="Open Care & Nutrition Suggestions"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",

          bottom: BOTTOM_PADDING + CHAT_BUBBLE_SIZE + GAP,
          right: RIGHT_PADDING,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: BRAND_RED,
          color: "#fff",
          boxShadow: "0 10px 24px rgba(0,0,0,.18)",
          border: "none",
          zIndex: 2050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        className="fab-care"
      >
        <i className="fa fa-magic" style={{ fontSize: 20 }} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            zIndex: 2049,
          }}
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          height: "70vh",
          width: "min(420px, 96vw)",
          background: "#fff",
          zIndex: 2051,
          boxShadow: "0 0 30px rgba(0,0,0,.22)",
          borderTopLeftRadius: 14,
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 220ms ease-in-out",
          display: "flex",
          flexDirection: "column",
          marginRight: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: BRAND_RED,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fa fa-magic" />
            </span>
            <strong>Care & Nutrition</strong>
          </div>

          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="fa fa-times" />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: 12 }}>
          <CarePlanner />
        </div>
      </aside>

      <style>{`
        @media (max-width: 576px) {
          .fab-care {
            right: ${RIGHT_PADDING}px;      /* giữ thẳng hàng */
            bottom: ${BOTTOM_PADDING + CHAT_BUBBLE_SIZE + GAP}px;
          }
        }
      `}</style>
    </>
  );
}
