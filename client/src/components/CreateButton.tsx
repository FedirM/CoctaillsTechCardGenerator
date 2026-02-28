import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateButtonProps {
  onCreate: () => void;
}

export function CreateButton({ onCreate }: CreateButtonProps) {
  return (
    <Button
      onClick={onCreate}
      size="lg"
      className="fixed bottom-6 right-6 z-50 shadow-lg"
    >
      <Plus className="mr-2 h-5 w-5" />
      New Cocktail
    </Button>
  );
}
