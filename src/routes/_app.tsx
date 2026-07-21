import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/maxces/AppSidebar";
import { AuroraBackground } from "@/components/maxces/AuroraBackground";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AuroraBackground />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar />
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
