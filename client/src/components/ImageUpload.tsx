import { useRef } from "react";
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div
      className={`relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 ${
        disabled ? "" : "cursor-pointer hover:border-gray-400"
      }`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      {value ? (
        <img
          src={value}
          alt="Cocktail"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <ImagePlus className="h-8 w-8" />
          <span className="text-xs">Upload image</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}
