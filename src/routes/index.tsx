import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "GAXIS-Lumen — GREEN Limited" },
      { name: "description", content: "Secure access to GREEN Limited's approved documents and training." },
      { property: "og:title", content: "GAXIS-Lumen — GREEN Limited" },
      { property: "og:description", content: "Secure access to GREEN Limited's approved documents and training." },
    ],
  }),
});
