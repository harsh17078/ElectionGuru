import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = t("chat_page.suggestions", { returnObjects: true }) as string[];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.response }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, I couldn't connect to the AI server. Please make sure the backend is running on port 8000." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-12 flex flex-col" style={{ minHeight: "calc(100vh - 10rem)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          <span className="gradient-text">{t("chat_page.title")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">{t("chat_page.subtitle")}</p>
      </motion.div>

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-1"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium hover:bg-primary/20 hover:scale-105 transition-all duration-200 border border-primary/20"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gradient-to-br from-saffron to-trigreen text-white"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-md"
                  : "bg-card border border-border/60 rounded-tl-md"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron to-trigreen text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-card border border-border/60 rounded-2xl rounded-tl-md px-5 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-card border border-border/60 shadow-xl shadow-black/5"
        >
          <div className="pl-2">
            <Sparkles className="w-5 h-5 text-primary/60" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat_page.placeholder")}
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
