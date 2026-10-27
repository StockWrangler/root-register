import { useState, useEffect } from "react";

export default function PhotoManager({ publicId }) {
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing plant photos
  useEffect(() => {
    const loadPlant = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/plants/${publicId}`);
        if (!res.ok) return;
        const data = await res.json();
        setExistingPhotos(data.photos || []);
      } catch (e) {
        console.log("Failed to load plant", e);
      }
    };
    loadPlant();
  }, [publicId]);

  const registerPhotos = async () => {
    setLoading(true);
    setError(null);

    const form = new FormData();
    for (let f of newFiles) form.append("photos", f);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/photos/register/${publicId}`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      setExistingPhotos(data.photos || []);
    } catch (e) {
      setError(e.toString());
    }

    setLoading(false);
  };

  const updatePhotos = async () => {
    setLoading(true);
    setError(null);

    const payload = { photos: existingPhotos };
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    for (let f of newFiles) form.append("new_photos", f);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/photos/update/${publicId}`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      setExistingPhotos(data.photos || []);
    } catch (e) {
      setError(e.toString());
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Photos</h3>

      {/* Existing Photos */}
      <div style={{ marginBottom: 20 }}>
        <strong>Existing:</strong>
        <div style={{
          display: "flex",
          gap: 10,
          marginTop: 10,
          flexWrap: "wrap"
        }}>
          {existingPhotos.length === 0 && <span>No photos yet.</span>}
          {existingPhotos.map((url) => (
            <img
              key={url}
              src={url}
              alt="plant"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid #ccc"
              }}
            />
          ))}
        </div>
      </div>

      {/* New Upload */}
      <div style={{ marginBottom: 20 }}>
        <label>Upload new photos:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setNewFiles(e.target.files)}
          style={{ marginLeft: 10 }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={registerPhotos} disabled={loading}>
          Register (initial)
        </button>
        <button type="button" onClick={updatePhotos} disabled={loading}>
          Update (append/replace)
        </button>
      </div>

      {/* Status */}
      {loading && <p style={{ marginTop: 20 }}>Uploading...</p>}
      {error && (
        <pre style={{ marginTop: 20, color: "red" }}>
          {error}
        </pre>
      )}
    </div>
  );
}
