import { ImagePlus, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const MAX_FILE_SIZE_MB = 1;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadInput({
  onImageSelect,
}: {
  onImageSelect: (file: File | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setFileName(null);
      onImageSelect(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Hanya gambar dengan format JPG, PNG, atau WebP yang diizinkan."
      );
      setFileName(null);
      onImageSelect(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran gambar maksimal ${MAX_FILE_SIZE_MB} MB.`);
      setFileName(null);
      onImageSelect(null);
      return;
    }

    setFileName(file.name);
    onImageSelect(file);
  };

  return (
    <div className="w-full flex flex-col gap-3 absolute bottom-4 left-4">
      <div className="flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <ImagePlus className="w-5 h-5 text-gray-500" />
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {error ? (
          <span className="text-red-500 text-sm"></span>
        ) : (
          <span className="text-xs text-neutral-500">
            *maks. file 2mb (png/jpg)
          </span>
        )}
      </div>
    </div>
  );
}
