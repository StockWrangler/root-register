const API_URL = "http://127.0.0.1:8000";

export async function getPlants() {
  const res = await fetch(`${API_URL}/plants`);
  const plants = await res.json();

  for (const plant of plants) {
    try {
      const childRes = await fetch(
        `${API_URL}/plants?mother_public_id=${plant.public_id}`
      );
      const children = await childRes.json();
      plant.children = Array.isArray(children) ? children : [];
    } catch (err) {
      console.error("CHILD FETCH ERROR:", err);
      plant.children = [];
    }
  }

  return plants;
}

export async function getPlant(public_id) {
  const res = await fetch(`${API_URL}/plants/${public_id}`);
  return res.json();
}

export async function registerPlant(data) {
  const res = await fetch(`${API_URL}/registerPlant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePlant(public_id, data) {
  const res = await fetch(`${API_URL}/plants/${public_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePlant(public_id) {
  const res = await fetch(`${API_URL}/plants/${public_id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getChildren(mother_public_id) {
  const res = await fetch(`${API_URL}/plants?mother_public_id=${mother_public_id}`);
  return res.json();
}

export async function updatePhotos(publicId, formData) {
  const res = await fetch(`${API_URL}/photo-api/update/${publicId}`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function deletePhoto(publicId, url) {
  const res = await fetch(`${API_URL}/photo-api/delete/${publicId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return await res.json();
}
