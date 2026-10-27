import React, { useEffect, useState } from "react";
import { getPlants, updatePlant, deletePlant } from "./api";

function App() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  async function fetchPlants() {
    setLoading(true);
    setError(null);

    try {
      const data = await getPlants();

      if (!Array.isArray(data)) {
        setError("Backend did not return a plant list.");
        setPlants([]);
      } else {
        const sorted = data.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", undefined, {
            sensitivity: "base",
          })
        );
        setPlants(sorted);
      }
    } catch (err) {
      setError("Error fetching plants.");
      setPlants([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPlants();
  }, []);

  async function handleDelete(public_id) {
    if (!window.confirm("Delete this plant?")) return;

    try {
      await deletePlant(public_id);
      fetchPlants();
    } catch {
      alert("Error deleting plant");
    }
  }

  async function handleWateredToday(plant) {
    const timestamp = new Date().toISOString().split("T")[0];
    const updatedNotes = (plant.notes || "") + `\n[${timestamp}] Watered today`;

    try {
      await updatePlant(plant.public_id, { notes: updatedNotes });
      fetchPlants();
    } catch {
      alert("Error updating plant");
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading plants...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Plants</h1>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name, species, or ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: 10,
            flex: 1,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() => setSearch(searchInput)}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
          }}
        >
          Search
        </button>
      </div>

      <button
        style={{ marginBottom: 20 }}
        onClick={() => (window.location.href = "/register")}
      >
        Register New Plant
      </button>

      {plants
        .filter((plant) => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            plant.name.toLowerCase().includes(q) ||
            plant.species.toLowerCase().includes(q) ||
            plant.public_id.toLowerCase().includes(q)
          );
        })
        .map((plant) => {
          const thumbnail = plant.photos?.[0];

          return (
            <div
              key={plant.public_id}
              onClick={() => (window.location.href = `/plant/${plant.public_id}`)}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {/* Thumbnail */}
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="thumb"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "#eee",
                    borderRadius: 4,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: 12,
                  }}
                >
                  No Photo
                </div>
              )}

              <h3>{plant.name}</h3>
              <p><strong>ID:</strong> {plant.public_id}</p>
              <p><strong>Species:</strong> {plant.species}</p>
              <p><strong>Owner:</strong> {plant.owner_id}</p>
              <p><strong>Location:</strong> {plant.location}</p>

              {/* Notes */}
              <div>
                <strong>Notes:</strong>
                <ul>
                  {plant.notes
                    ?.split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                </ul>
              </div>

              {/* Mother */}
              {plant.mother_public_id && (
                <p>
                  <strong>Mother:</strong>{" "}
                  <a href={`/edit/${plant.mother_public_id}`}>
                    {plant.mother_public_id}
                  </a>
                </p>
              )}

              {/* Children */}
              {plant.children?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong>Children:</strong>
                  <ul>
                    {plant.children.map((child) => (
                      <li key={child.public_id}>
                        <a href={`/edit/${child.public_id}`}>{child.public_id}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWateredToday(plant);
                  }}
                >
                  Watered Today
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/edit/${plant.public_id}`;
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(plant.public_id);
                  }}
                  style={{ backgroundColor: "#c62828", color: "white" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
