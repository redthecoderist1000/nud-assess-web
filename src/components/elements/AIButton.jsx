import React from "react";

const AIButton = ({ label = "Generate", onClick }) => {
  return (
    <div style={{ position: "relative", margin: "0 2em" }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="unopaq" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 9 0"
          />
        </filter>
        <filter id="unopaq2" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 3 0"
          />
        </filter>
        <filter id="unopaq3" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0.2 0 
            0 1 0 0.2 0 
            0 0 1 0.2 0 
            0 0 0 2 0"
          />
        </filter>
      </svg>

      <button
        onClick={onClick}
        style={{
          position: "absolute",
          width: "120px",
          height: "60px",
          zIndex: 1,
          outline: "none",
          border: "none",
          borderRadius: "17px",
          cursor: "pointer",
          opacity: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "-9900%",
          background:
            "radial-gradient(circle at 50% 50%, #0000 0, #0000 20%, #111111aa 50%)",
          backgroundSize: "3px 3px",
          zIndex: -1,
        }}
      />

      <div
        style={{
          padding: "3px",
          background: "rgba(0,0,0,0.333)",
          borderRadius: "0.875em",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "60px",
            background: "#111215",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0.875em",
            clipPath:
              'path("M 90 0 C 115 0 120 5 120 30 C 120 55 115 60 90 60 L 30 60 C 5 60 0 55 0 30 C 0 5 5 0 30 0 Z")',
            fontWeight: "bold",
            fontSize: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default AIButton;
