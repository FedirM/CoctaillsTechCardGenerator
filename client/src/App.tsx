import { useRef } from "react";
import { useCocktails } from "@/hooks/useCocktails";
import { Header } from "@/components/Header";
import { CreateButton } from "@/components/CreateButton";
import { CocktailList } from "@/components/CocktailList";
import { PdfExport, type PdfExportHandle } from "@/components/PdfExport";

export default function App() {
  const {
    cocktails,
    loading,
    editingId,
    setEditingId,
    create,
    update,
    remove,
    reorder,
  } = useCocktails();

  const pdfRef = useRef<PdfExportHandle>(null);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onExport={() => pdfRef.current?.exportPdf()} />
      <CreateButton onCreate={create} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {cocktails.length === 0 ? (
          <div className="py-32 text-center text-gray-400">
            <p className="text-lg">No cocktails yet</p>
            <p className="text-sm">
              Click "New Cocktail" to create your first card
            </p>
          </div>
        ) : (
          <CocktailList
            cocktails={cocktails}
            editingId={editingId}
            onEdit={(id) =>
              setEditingId(editingId === id ? null : id)
            }
            onDelete={remove}
            onUpdate={update}
            onReorder={reorder}
          />
        )}
      </main>

      <PdfExport ref={pdfRef} cocktails={cocktails} />
    </div>
  );
}
