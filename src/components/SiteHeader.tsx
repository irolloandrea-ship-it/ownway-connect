import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size={32} />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/trip/new" className="hover:text-foreground">Find my WayMaker</Link>
          <Link to="/moments" className="hover:text-foreground">OwnWay Moments</Link>
          <Link to="/waymaker/apply" className="hover:text-foreground">Become a WayMaker</Link>
        </nav>
        <Link to="/trip/new">
          <Button size="sm" className="rounded-full">Find my WayMaker</Button>
        </Link>
      </div>
    </header>
  );
}
