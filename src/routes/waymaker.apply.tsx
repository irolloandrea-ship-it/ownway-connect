import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/waymaker/apply")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { role: "waymaker" } as any, hash: "join" });
  },
  component: () => null,
});
