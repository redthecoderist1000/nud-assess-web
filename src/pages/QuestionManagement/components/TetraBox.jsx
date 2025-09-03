import React from "react";

const stats = [
  {
    title: "My Questions",
    value: 7,
    subtitle: (
      <span>
        <span style={{ color: "#3b82f6", fontSize: "14px", marginRight: 4 }}>
          ↗ +3
        </span>
        from last month
      </span>
    ),
    borderColor: "#2C388F",
    icon: (
      <span
        style={{
          background: "#eef2ff",
          borderRadius: "50%",
          padding: 6,
          display: "inline-flex",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="#2C388F"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="12" cy="12" r="2" fill="#2C388F" />
        </svg>
      </span>
    ),
  },
  {
    title: "Shared Questions",
    value: 2,
    subtitle: "Available from community",
    borderColor: "#22c55e",
    icon: (
      <span
        style={{
          background: "#dcfce7",
          borderRadius: "50%",
          padding: 6,
          display: "inline-flex",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path
            d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm8 7v-1a4 4 0 0 0-8 0v1"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    ),
  },
  {
    title: "Total Usage",
    value: 10,
    subtitle: "Times used in quizzes",
    borderColor: "#2563eb",
    icon: (
      <span
        style={{
          background: "#e0e7ff",
          borderRadius: "50%",
          padding: 6,
          display: "inline-flex",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="#2563eb"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="12" cy="12" r="2" fill="#2563eb" />
        </svg>
      </span>
    ),
  },
  {
    title: "Avg Usage",
    value: 1,
    subtitle: "Per question",
    borderColor: "#fb923c",
    icon: (
      <span
        style={{
          background: "#fff7ed",
          borderRadius: "50%",
          padding: 6,
          display: "inline-flex",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path
            d="M4 17c0-4 4-7 8-7s8 3 8 7"
            stroke="#fb923c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M12 12v5"
            stroke="#fb923c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    ),
  },
];

const TetraBox = () => (
  <div
    style={{
      display: "flex",
      gap: "24px",
      marginTop: "8px",
    }}
  >
    {stats.map((stat, idx) => (
      <div
        key={idx}
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: "16px",
          border: `1.5px solid #e5e7eb`,
          minWidth: 0,
          boxShadow: "none",
          padding: "24px 20px 20px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "4px",
            background: stat.borderColor,
            borderRadius: "16px 0 0 16px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "16px", color: "#222" }}>
            {stat.title}
          </span>
          {stat.icon}
        </div>
        <div style={{ marginTop: "18px", marginBottom: "2px" }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "28px",
              color: stat.borderColor,
            }}
          >
            {stat.value}
          </span>
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          {stat.subtitle}
        </div>
      </div>
    ))}
  </div>
);

export default TetraBox;
