import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trip/new")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { role: "explorer" } as any, hash: "join" });
  },
  component: () => null,
});
