import React, { useState, useRef } from "react";
import { updatePhotos, deletePhoto } from "./api";

export default function PhotoManager({ publicId, existingPhotos }) {
  const [photos, setPhotos] = useState(
    Array.isArray(existingPhotos) ? existingPhotos : []
  );
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setPreviewFiles(files);
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    setPreviewFiles(files);
  }

  async function handleUpload() {
    if (previewFiles.length === 0) return;

    const formData = new FormData();
    previewFiles.forEach((file) => formData.append("photos", file));

    try {
      const updated = await updatePhotos(publicId, formData);
      setPhotos(updated.photos || []);
      setPreviewFiles([]);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Error uploading photos");
    }
  }

  async function handleDeletePhoto(url) {
    if (!window.confirm("Delete this photo?")) return;

    try {
      const updated = await deletePhoto(publicId, url);
      setPhotos(updated.photos || []);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Error deleting photo");
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Photos</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {Array.isArray(photos) &&
          photos.map((url) => (
            <div key={url} style={{ position: "relative" }}>
              <img
                src={url}
                alt="plant"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={() => handleDeletePhoto(url)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 6px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: "2px dashed #888",
          padding: 30,
          borderRadius: 10,
          textAlign: "center",
          background: isDragging ? "#eef7ff" : "#fafafa",
          cursor: "pointer",
        }}
      >
        <p style={{ margin: 0 }}>
          {isDragging ? "Drop photos to upload" : "Drag & drop photos here, or click to select"}
        </p>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>

      {previewFiles.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Preview</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {previewFiles.map((file) => {
              const url = URL.createObjectURL(file);
              return (
                <img
                  key={file.name}
                  src={url}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              );
            })}
          </div>

          <button
            onClick={handleUpload}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              background: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Upload Photos
          </button>
        </div>
      )}
    </div>
  );
}
