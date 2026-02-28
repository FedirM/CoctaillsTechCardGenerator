import { Wine, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Wine className="h-6 w-6" />
          <span className="text-xl font-semibold tracking-tight">
            Cocktail Composer
          </span>
        </div>
        <Button variant="outline" onClick={onExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
      </div>
    </header>
  );
}
