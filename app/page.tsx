"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormItem, FormControl, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ChatMessage } from "@/components/chat/chat-message";
import { topicQuestions } from "@/constants/topics";
import { Message } from "@/types/chats";
import { PromptForm } from "@/components/chat/prompt-form";
import { Send } from "lucide-react";

export default function TaxChatbot() {
  const [, setSelectedTopic] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const form = useForm({ defaultValues: { prompt: "" } });

  const handleTopicClick = (topicId: string) => {
    form.setValue("prompt", topicId);
    setSelectedTopic(topicId);
  };

  const onSubmit = async (values: { prompt: string }) => {
    if (!values.prompt.trim()) return;
    setLoading(true);

    const newUserMessage: Message = {
      role: "user",
      parts: [{ text: values.prompt }],
    };

    const updatedHistory = [...conversationHistory, newUserMessage];
    setConversationHistory(updatedHistory);
    form.reset();

    try {
      const sanitizedHistory = conversationHistory.filter(
        (msg) => msg.role === "user"
      );

      const history = [...sanitizedHistory, newUserMessage];

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
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
                            Mengetik...
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
            <div className="lg:max-w-[840px] mx-auto bg-white items-center rounded-md sticky sm:bottom-10 bottom-4 px-2 left-0  right-0 z-10 w-full shadow-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Tanyakan seputar pajak..."
                            disabled={loading}
                            {...field}
                            rows={1}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // prevent newline
                                form.handleSubmit(onSubmit)(); // trigger form submit
                              }
                            }}
                            className="resize-none focus:border-none focus-visible:ring-red-500 focus-visible:ring-1 focus:ring-0"
                            onInput={(e) => {
                              const target = e.currentTarget;
                              target.style.height = "auto";
                              target.style.height = `${target.scrollHeight}px`;
                            }}
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
          )}
        </main>
      </div>
    </>
  );
}
