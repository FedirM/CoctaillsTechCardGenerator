interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[80px] rounded-md border p-3 text-sm text-left outline-none resize-y focus:ring-2 focus:ring-ring"
    />
  );
}
