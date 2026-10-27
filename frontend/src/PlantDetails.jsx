import React, { useEffect, useState } from "react";
import { getPlant } from "./api";

export default function PlantDetails() {
  const publicId = window.location.pathname.split("/plant/")[1];
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getPlant(publicId);
      setPlant(data);
    }
    load();
  }, [publicId]);

  if (!plant) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <button
        onClick={() => (window.location.href = "/plants")}
        style={{
          marginBottom: 20,
          padding: "8px 12px",
          borderRadius: 6,
          background: "#ccc",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Back to Plants
      </button>

      <h1>{plant.name}</h1>
      <h3 style={{ color: "#555" }}>{plant.species}</h3>

      <div style={{ marginBottom: 20 }}>
        <strong>Photos:</strong>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          {plant.photos?.length ? (
            plant.photos.map((url) => (
              <img
                key={url}
                src={url}
                alt="plant"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            ))
          ) : (
            <div>No photos</div>
          )}
        </div>
      </div>

      <p><strong>Location:</strong> {plant.location || "—"}</p>
      <p><strong>Owner:</strong> {plant.owner_id || "—"}</p>
      <p><strong>Mother:</strong> {plant.mother_public_id || "—"}</p>

      <div style={{ marginTop: 20 }}>
        <strong>Notes:</strong>
        <ul>
          {plant.notes
            ?.split("\n")
            .filter((l) => l.trim() !== "")
            .map((l, i) => (
              <li key={i}>{l}</li>
            ))}
        </ul>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>History:</strong>
        <ul>
          {plant.history
            ?.split("\n")
            .filter((l) => l.trim() !== "")
            .map((l, i) => (
              <li key={i}>{l}</li>
            ))}
        </ul>
      </div>

      <button
        style={{
          padding: "10px 15px",
          background: "#2196f3",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          marginTop: 20,
        }}
        onClick={() => (window.location.href = `/edit/${publicId}`)}
      >
        Edit Plant
      </button>
    </div>
  );
}
