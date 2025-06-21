import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Send } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageUploadInput } from "./image-upload";

interface PromptFormProps {
  imageFile?: File | null;
  form: UseFormReturn<any>;
  onSubmit: (values: { prompt: string }) => void;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  loading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  form,
  imageFile,
  onSubmit,
  setImageFile,
  loading,
}) => {
  return (
    <div className="w-full relative mb-8 shadow-md overflow-hidden border rounded-md">
      <Form {...form}>
        <form className="w-full p-4" onSubmit={form.handleSubmit(onSubmit)}>
          {imageFile && (
            <div className="w-fit relative mb-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-h-20 rounded-md border"
              />
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="absolute top-0 right-0 bg-white border border-neutral-500 rounded-full w-6 h-6 flex items-center justify-center text-xs  shadow-md hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          )}
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    {...field}
                    disabled={loading}
                    style={{ height: "64px" }}
                    placeholder="Tanyakan seputar pajak. Gunakan kata kunci yang relevan dan sesuai konteks, misalnya menyertakan kata seperti: 'pajak', 'PPN', 'PPh', atau 'faktur'."
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    onInput={(e) => {
                      const target = e.currentTarget;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    className="resize-none w-full focus:ring-0 focus:outline-none md:pr-20 pr-0 mb-4 pb-2 disabled:bg-white scrollbar-hide overflow-y-auto"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <ImageUploadInput
            onImageSelect={(file) => {
              setImageFile(file);
            }}
          />
        </form>
      </Form>
      <div className="absolute top-1/2 -translate-y-1/2 right-8 bg-red-50 p-3 rounded-full hidden md:block">
        <Send
          onClick={form.handleSubmit(onSubmit)}
          className="w-4 h-4 text-red-500"
        />
      </div>
    </div>
  );
};
