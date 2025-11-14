
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { ClerkProvider } from "@clerk/clerk-react";

  createRoot(document.getElementById("root")!).render(<App />);
  <ClerkProvider publishableKey="pk_test_c2tpbGxlZC1idWZmYWxvLTkxLmNsZXJrLmFjY291bnRzLmRldiQ">
  <App />
</ClerkProvider>

  