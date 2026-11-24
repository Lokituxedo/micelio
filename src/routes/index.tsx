import { createFileRoute } from "@tanstack/react-router";
import { MicelioApp } from "@/components/micelio-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MicelioApp />;
}
