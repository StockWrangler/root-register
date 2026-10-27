import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import EditPlant from "./EditPlant";
import Register from "./Register";
import PhotoTest from "./PhotoTest";
import PlantDetails from "./PlantDetails";

const path = window.location.pathname;

let Page = App;

// Individual plant details page
if (path.startsWith("/plant/")) {
  Page = PlantDetails;

// Edit page
} else if (path.startsWith("/edit/")) {
  Page = EditPlant;

// Register new plant
} else if (path === "/register") {
  Page = Register;

// Photo test (optional)
} else if (path === "/photo-test") {
  Page = PhotoTest;

// Home or /plants
} else if (path === "/" || path === "/plants") {
  Page = App;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
