import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types/chats";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const part = message.parts[0];

  console.log({ part });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${
        message.role === "user"
          ? "justify-end text-right"
          : "justify-start text-left"
      }`}
    >
      {/* Avatar (model) */}
      {message.role === "model" && (
        <Avatar className="bg-muted hidden md:block">
          <AvatarFallback>
            <Image
              width={100}
              height={100}
              alt="avatar bot"
              src="/avatar-bot.png"
            />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message bubble wrapper */}
      <div className="flex flex-col gap-2 md:max-w-[80%] max-w-[94%]">
        {/* Image Preview (if exists) */}
        {!!message.fileUrl && (
          <img
            src={message.fileUrl}
            alt="Uploaded"
            className="max-h-52 rounded-md border"
          />
        )}

        {/* Text Bubble */}
        {!!part?.text && (
          <div
            className={`rounded-lg px-4 py-2 text-sm shadow ${
              message.role === "user"
                ? "bg-red-600 text-white"
                : "bg-muted text-foreground"
            }`}
          >
            <div className="space-y-3">
              {message.role === "user" && part?.text && <p>{part.text}</p>}
              {message.answer && (
                <ReactMarkdown>{message.answer}</ReactMarkdown>
              )}

              {message?.examples && message.examples?.length > 0 && (
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-sm font-semibold mb-2">Contoh:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {message.examples.map((ex, idx) => (
                      <li key={idx}>
                        <ReactMarkdown>{ex}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message?.regulations && message?.regulations?.length > 0 && (
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-sm font-semibold mb-2">
                    Undang-undang dan aturan terkait:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm italic">
                    {message.regulations.map((ref, idx) => (
                      <li key={idx}>
                        <ReactMarkdown>{ref}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message?.references && message.references?.length > 0 && (
                <div className="rounded-xl bg-muted/50 p-4 text-xs">
                  <p className="font-medium mb-2 text-xs">Sumber:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                    {message.references.map((ref, idx) => (
                      <li key={idx}>
                        <a
                          href={ref.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline underline-offset-2 hover:text-primary/80 transition-colors"
                        >
                          {ref.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar (user) */}
      {message.role === "user" && (
        <Avatar className="bg-muted">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};
