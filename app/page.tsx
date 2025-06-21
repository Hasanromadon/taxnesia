"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormItem, FormControl, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Image from "next/image";
import { ChatMessage } from "@/components/chat/chat-message";
import { topicQuestions } from "@/constants/topics";
import { Message } from "@/types/chats";
import { PromptForm } from "@/components/chat/prompt-form";
import { Send } from "lucide-react";
import { ImageUploadInput } from "@/components/chat/image-upload";

export default function TaxChatbot() {
  const [, setSelectedTopic] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const form = useForm({ defaultValues: { prompt: "" } });

  const handleTopicClick = (topicId: string) => {
    form.setValue("prompt", topicId);
    setSelectedTopic(topicId);
  };

  const onSubmit = async (values: { prompt: string }) => {
    if (!values.prompt.trim() && !imageFile) return;
    setLoading(true);

    // Simpan pesan user untuk UI
    const newUserMessage: Message = {
      role: "user",
      parts: values.prompt ? [{ text: values.prompt }] : [{ text: "" }],
      fileUrl: imageFile ? URL.createObjectURL(imageFile) : undefined, // ← for UI preview only
    };

    const updatedHistory = [...conversationHistory, newUserMessage];
    setConversationHistory(updatedHistory);
    form.reset();

    try {
      // Kirim hanya history role user dan bersihkan fileUrl
      const sanitizedHistory = conversationHistory
        .filter((msg) => msg.role === "user")
        .map((msg) => ({
          role: msg.role,
          parts: msg.parts.map((p) => ({ text: p.text })), // remove fileUrl
        }));

      const history = [
        ...sanitizedHistory,
        {
          role: "user",
          parts: [{ text: values.prompt }],
        },
      ];

      const formData = new FormData();
      formData.append("history", JSON.stringify(history));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/gemini", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setConversationHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: data.answer }],
          question: data.question,
          answer: data.answer,
          examples: data.examples,
          regulations: data.regulations,
          references: data.references?.map((r: string) => ({ uri: r })) ?? [],
        },
      ]);

      setImageFile(null);
    } catch (err) {
      console.error("Error:", err);
      setConversationHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  return (
    <>
      <AppSidebar
        onNewChat={() => setConversationHistory([])}
        onSelectTopic={handleTopicClick}
      />
      <div className="w-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-white shadow-sm py-4">
          <div className="container mx-auto flex items-center justify-between px-4">
            <p className="font-semibold text-xl text-gray-800 ml-8">
              Taxnesa AI
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>TI</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex flex-1 w-full flex-col max-w-4xl mx-auto relative border-none mt-3">
          <section className="flex-1 w-full overflow-hidden rounded-md -mt-3 md:mt-0">
            <Card className="h-full flex flex-col border-none">
              <CardContent className="flex-1 p-4">
                <ScrollArea className="h-full">
                  {conversationHistory.length === 0 ? (
                    <div className="flex flex-col items-center text-center md:mt-6">
                      <Image
                        width={100}
                        height={100}
                        quality={70}
                        className="w-16 h-16 md:w-24 md:h-24"
                        alt="avatar bot"
                        src="/avatar-bot.png"
                      />
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                          Selamat datang di Asisten Pajak Digital
                        </h2>
                        <p className="text-sm text-gray-600">
                          Silakan pilih topik yang tersedia atau ketik
                          pertanyaan Anda terkait perpajakan seperti PPh, PPN,
                          PBB, dan lainnya. Saya siap membantu Anda memahami
                          informasi perpajakan dengan lebih mudah.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {topicQuestions.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.label)}
                            className={`flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm shadow transition hover:scale-[1.02] hover:shadow-md focus:outline-none ${topic.color} text-white`}
                          >
                            <topic.icon className="w-4 h-4" />
                            {topic.label}
                          </button>
                        ))}
                      </div>
                      <PromptForm
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        form={form}
                        loading={loading}
                        onSubmit={onSubmit}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 mb-10">
                      {conversationHistory.map((msg, i) => (
                        <ChatMessage message={msg} key={i} />
                      ))}
                      {loading && (
                        <div className="flex gap-1 items-center max-w-4xl">
                          <Avatar>
                            <AvatarFallback>
                              <Image
                                width={100}
                                height={100}
                                alt="avatar bot"
                                src="/avatar-bot.png"
                              />
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-gray-500">
                            Asisten sedang menulis...
                          </div>
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </section>
          {conversationHistory.length > 0 && (
            <div className="lg:max-w-[840px] mx-auto bg-white border items-center rounded-md sticky sm:bottom-10 bottom-4 px-2 sm:px-0 left-0  right-0 z-10 w-full shadow-md overflow-hidden">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                  {!loading && imageFile && (
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
                            placeholder="Tanyakan seputar pajak. Gunakan kata kunci yang relevan dan sesuai konteks, misalnya menyertakan kata seperti: 'pajak', 'PPN', 'PPh', atau 'faktur'."
                            disabled={loading}
                            {...field}
                            style={{ height: "64px" }}
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
                            className="resize-none w-full focus:ring-0 focus:outline-none md:pr-20 mb-4 pb-2 disabled:bg-white scrollbar-hide overflow-y-auto"
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
              <div
                className={`absolute -translate-y-1/2 right-8 bg-red-50 p-3 rounded-full md:block hidden ${
                  imageFile ? "bottom-0" : "top-1/2"
                }`}
              >
                <Send
                  onClick={form.handleSubmit(onSubmit)}
                  className={`w-4 h-4 cursor-pointer  ${
                    loading ? "text-neutral-700" : "text-red-500"
                  }`}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
