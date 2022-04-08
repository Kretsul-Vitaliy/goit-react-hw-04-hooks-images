import React from "react";
import App from "./App/";
import ReactDOM from "react-dom/client";
// import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App tab="home" />
  </React.StrictMode>
);

// // AFTER
// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App/";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
