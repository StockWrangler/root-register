import os
import uuid

PHOTOS_DIR = "photos"

def save_photo(file) -> str:
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(PHOTOS_DIR, filename)

    contents = file.file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    return f"http://127.0.0.1:8000/photos/{filename}"
