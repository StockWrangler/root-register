import { useState } from "react";

export default function PhotoTest() {
  const [files, setFiles] = useState([]);
  const [publicId, setPublicId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const uploadPhotos = async (e) => {
    // CRITICAL: stop parent form submission
    if (e) e.preventDefault();

    setError(null);
    setResult(null);

    const form = new FormData();

    for (let f of files) {
      form.append("photos", f);
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/photos/register/${publicId}`, {
        method: "POST",
        body: form
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.toString());
    }
  };

  return (
    <div
      style={{ padding: 20 }}
      // CRITICAL: prevent ANY parent form from hijacking clicks
      onSubmit={(e) => e.preventDefault()}
    >
      <h2>Photo Upload Test</h2>

      <div style={{ marginBottom: 20 }}>
        <label>public_id:</label>
        <input
          type="text"
          placeholder="public_id"
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Select photos:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          style={{ marginLeft: 10 }}
        />
      </div>

      {/* CRITICAL: type="button" prevents form submission */}
      <button type="button" onClick={uploadPhotos}>
        Upload
      </button>

      {error && (
        <pre style={{ marginTop: 20, color: "red" }}>
          {error}
        </pre>
      )}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
