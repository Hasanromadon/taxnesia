import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PromptFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: { prompt: string }) => void;
  loading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  form,
  onSubmit,
  loading,
}) => {
  return (
    <div className="md:px-4 px-2 w-full relative mb-8">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    placeholder="Tanyakan seputar pajak..."
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
                    className="resize-none shadow-sm focus:border-none focus-visible:ring-red-500 focus-visible:ring-1 focus:ring-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="absolute top-1/2 -translate-y-1/2 right-8 bg-red-50 p-3 rounded-full">
        <Send className="w-4 h-4 text-red-500" />
      </div>
    </div>
  );
};
