import React, { useEffect, useState } from "react";
import { getPlant, updatePlant } from "./api";
import PhotoManager from "./PhotoManager";

function EditPlant() {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  const public_id = window.location.pathname.split("/edit/")[1];

  const [form, setForm] = useState({
    public_id: "",
    name: "",
    species: "",
    location: "",
    notes: "",
    owner_id: "",
    mother_public_id: "",
    history: "",
    photos: [],          // ⭐ MUST EXIST
    newNote: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getPlant(public_id);
        setPlant(data);

        setForm({
          public_id: data.public_id,
          name: data.name,
          species: data.species,
          location: data.location,
          notes: data.notes || "",
          owner_id: data.owner_id || "",
          mother_public_id: data.mother_public_id || "",
          history: data.history || "",
          photos: Array.isArray(data.photos) ? data.photos : [],   // ⭐ FIXED
          newNote: "",
        });
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
      setLoading(false);
    }

    load();
  }, [public_id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ⭐ Watered Today — append to notes + history
  async function handleWateredToday() {
    const timestamp = new Date().toISOString().split("T")[0];

    const updatedNotes =
      (form.notes || "") + `\n[${timestamp}] Watered today`;

    const updatedHistory =
      (form.history || "") +
      `\n[${timestamp}] Watered today logged`;

    const payload = {
      ...form,
      notes: updatedNotes,
      history: updatedHistory,
    };

    try {
      await updatePlant(public_id, payload);
      alert("Watered today logged!");
      window.location.reload();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Error updating plant");
    }
  }

  // ⭐ Save — append new notes + full edit history
  async function handleSubmit(e) {
    e.preventDefault();

    const timestamp = new Date().toISOString().split("T")[0];

    let updatedNotes = form.notes || "";
    let updatedHistory = form.history || "";

    // ⭐ Append new note
    if (form.newNote && form.newNote.trim() !== "") {
      updatedNotes += `\n[${timestamp}] ${form.newNote.trim()}`;
      updatedHistory += `\n[${timestamp}] Note added: "${form.newNote.trim()}"`;
    }

    // ⭐ Full edit history tracking
    function logChange(field, oldVal, newVal) {
      if (oldVal !== newVal) {
        updatedHistory += `\n[${timestamp}] ${field} changed from "${oldVal}" to "${newVal}"`;
      }
    }

    logChange("name", plant.name, form.name);
    logChange("species", plant.species, form.species);
    logChange("location", plant.location, form.location);
    logChange("owner", plant.owner_id, form.owner_id);
    logChange("mother", plant.mother_public_id, form.mother_public_id);

    const payload = {
      ...form,
      notes: updatedNotes,
      history: updatedHistory,
    };

    try {
      await updatePlant(public_id, payload);
      alert("Plant updated successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Error updating plant");
    }
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading plant...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "450px" }}>
      <h1>Edit Plant</h1>

      {/* ⭐ Create Child Plant */}
      <button
        style={{
          marginBottom: "20px",
          background: "#4caf50",
          color: "white",
          padding: "10px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() =>
          (window.location.href = `/register?mother=${public_id}`)
        }
      >
        Create Child Plant
      </button>

      {/* ⭐ Watered Today */}
      <button
        style={{
          marginBottom: "20px",
          background: "#2196f3",
          color: "white",
          padding: "10px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleWateredToday}
      >
        Watered Today
      </button>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <label>
          Public ID:
          <input
            name="public_id"
            value={form.public_id}
            readOnly
            style={{ background: "#eee" }}
          />
        </label>

        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Species:
          <input
            name="species"
            value={form.species}
            onChange={handleChange}
          />
        </label>

        <label>
          Location:
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label>
          Owner:
          <input
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
          />
        </label>

        {/* ⭐ Notes Journal */}
        <div>
          <strong>Notes:</strong>
          <ul>
            {form.notes
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
          </ul>
        </div>

        {/* ⭐ Add New Note */}
        <label>
          Add New Note:
          <textarea
            name="newNote"
            value={form.newNote}
            onChange={handleChange}
            rows={3}
            placeholder="Write a new note..."
          />
        </label>

        {/* ⭐ Full Edit History */}
        <div>
          <strong>History:</strong>
          <ul>
            {form.history
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
          </ul>
        </div>

        {/* ⭐ Mother */}
        <label>
          Mother Plant ID:
          <input
            name="mother_public_id"
            value={form.mother_public_id}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <button type="submit">Save Changes</button>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          style={{ marginTop: "5px" }}
        >
          Cancel
        </button>
      </form>

      {/* ⭐ Photos Section */}
      <PhotoManager
        publicId={public_id}
        existingPhotos={form.photos}   // ⭐ FIXED
      />
    </div>
  );
}

export default EditPlant;
