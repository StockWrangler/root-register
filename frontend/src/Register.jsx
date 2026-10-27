import { useState, useEffect } from "react";
import { registerPlant, getPlant } from "./api";
import PhotoManager from "./PhotoManager";

function Register() {
  // Read ?mother=XYZ from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const motherId = urlParams.get("mother");

  const [mother, setMother] = useState(null);

  const [form, setForm] = useState({
    name: "",
    species: "",
    location: "",
    notes: "",
    owner_id: "",
    mother_public_id: motherId || "",
    photos: [],
  });

  // ⭐ Load mother plant details if creating a child
  useEffect(() => {
    async function loadMother() {
      if (!motherId) return;

      const data = await getPlant(motherId);
      setMother(data);

      // ⭐ Auto-fill child fields from mother
      setForm((prev) => ({
        ...prev,
        species: data.species || "",
        location: data.location || "",
        owner_id: data.owner_id || "",
        mother_public_id: motherId,
      }));
    }

    loadMother();
  }, [motherId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      mother_public_id: motherId || null,
    };

    try {
      const result = await registerPlant(payload);
      console.log("REGISTER RESULT:", result);

      alert("Plant registered successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert("Error registering plant");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h1>Register New Plant</h1>

      {/* If auto-filled, show a banner */}
      {mother && (
        <div
          style={{
            background: "#e8f5e9",
            padding: "10px",
            border: "1px solid #4caf50",
            marginBottom: "15px",
            borderRadius: "6px",
          }}
        >
          <strong>Creating child plant of:</strong> {mother.public_id}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="e.g. Magnolia Cutting"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Species:
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            readOnly={!!motherId}               // ⭐ Locked for child
            style={motherId ? { background: "#eee" } : {}}
            required
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            readOnly={!!motherId}               // ⭐ Locked for child
            style={motherId ? { background: "#eee" } : {}}
          />
        </label>

        <label>
          Owner:
          <input
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            readOnly={!!motherId}               // ⭐ Locked for child
            style={motherId ? { background: "#eee" } : {}}
            placeholder="Owner ID"
          />
        </label>

        <label>
          Notes:
          <textarea
            name="notes"
            placeholder="Anything special?"
            value={form.notes}
            onChange={handleChange}
            rows={4}
          />
        </label>

        {/* ⭐ Mother-child tracking field */}
        <label>
          Mother Plant ID:
          <input
            type="text"
            name="mother_public_id"
            value={form.mother_public_id}
            readOnly
            style={{ background: "#eee" }}
          />
        </label>

        <button type="submit" style={{ marginTop: "10px" }}>
          Save Plant
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          style={{ marginTop: "5px" }}
        >
          Cancel
        </button>
      </form>

      {/* ⭐ Photos */}
      <PhotoManager
        publicId={form.public_id}
        existingPhotos={form.photos}
      />
    </div>
  );
}

export default Register;
