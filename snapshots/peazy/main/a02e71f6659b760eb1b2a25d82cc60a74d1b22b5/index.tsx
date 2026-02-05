
import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { PeazyLabsLanding } from "./PeazyLabsLanding";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <PeazyLabsLanding />
      <Analytics />
    </React.StrictMode>
  );
}
