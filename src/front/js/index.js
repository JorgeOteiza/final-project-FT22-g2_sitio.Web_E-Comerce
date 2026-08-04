//import react into the bundle
import React from "react";
import { createRoot } from "react-dom/client";

// Bundle the UI foundation locally so private sessions do not rely on CDN cache.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fortawesome/fontawesome-free/css/regular.min.css";
import "@fortawesome/fontawesome-free/css/brands.min.css";

//include your index.scss file into the bundle
import "../styles/index.css";

// Emit product catalog images with stable filenames through Webpack.
require.context("../img/products", false, /\.webp$/);

//import your own components
import Layout from "./layout.js";

//render your react application
const root = createRoot(document.querySelector("#app"));
root.render(<Layout />);
