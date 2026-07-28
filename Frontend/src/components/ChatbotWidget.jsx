import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Copy, Check, ChevronDown } from "lucide-react";
import api from "../utils/api";

const MODES = [
  { id: "grammar",   label: " Grammar Check",    hint: "Paste or type text to check",         forWriter: true  },
  { id: "improve",   label: " Improve Writing",   hint: "Paste a sentence or paragraph",        forWriter: true  },
  { id: "summarize", label: " Summarize Blog",    hint: "Click Send to summarize this blog",    forWriter: false },
  { id: "define",    label: " Define a Word",     hint: "Type or select a word to define it",   forWriter: false },
  { id: "chat",      label: " Ask Anything",      hint: "Ask me anything about this blog",      forWriter: false },
];

export default function ChatbotWidget({ blogId, blogContent = "", isAuthor = false }) {
  const [open, setOpen]         = useState(false);
  const [mode, setMode]         = useState("chat");
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const messagesEndRef           = useRef(null);
  const inputRef                 = useRef(null);

  const currentMode = MODES.find((m) => m.id === mode);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, mode]);

  // Detect text selected anywhere on the page
  useEffect(() => {
    const onSelect = () => {
      const selected = window.getSelection()?.toString().trim();
      if (selected && selected.length > 2 && open) {
        setInput(selected);
      }
    };
    document.addEventListener("mouseup", onSelect);
    return () => document.removeEventListener("mouseup", onSelect);
  }, [open]);

  const addMessage = (role, type, content) =>
    setMessages((prev) => [...prev, { role, type, content, id: Date.now() }]);

  const copyText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSend = async () => {
    const text = input.trim();

    // Summarize doesn't need input text
    if (mode !== "summarize" && !text) return;

    setLoading(true);
    const userLabel =
      mode === "summarize" ? "Summarize this blog for me" :
      mode === "grammar"   ? `Check grammar: "${text}"` :
      mode === "improve"   ? `Improve this: "${text}"` :
      mode === "define"    ? `Define: "${text}"` :
      text;

    addMessage("user", mode, userLabel);
    setInput("");

    try {
      let res;

      if (mode === "grammar") {
        res = await api.post("/chatbot/grammar", { text, blogId });
        addMessage("assistant", "grammar", res.data);
      } else if (mode === "improve") {
        res = await api.post("/chatbot/improve", { text, blogId });
        addMessage("assistant", "improve", res.data);
      } else if (mode === "summarize") {
        res = await api.post("/chatbot/summarize", { text: blogContent, blogId });
        addMessage("assistant", "summarize", res.data.summary);
      } else if (mode === "define") {
        res = await api.post("/chatbot/define", { word: text, blogId });
        addMessage("assistant", "define", res.data);
      } else {
        res = await api.post("/chatbot/chat", {
          message: text,
          blogId,
          chatMode: isAuthor ? "writer" : "reader",
        });
        addMessage("assistant", "chat", res.data.response);
      }
    } catch {
      addMessage("assistant", "error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Message renderers ──────────────────────────────────────────────────────

  const renderAssistantMessage = (msg) => {
    const { type, content, id } = msg;

    if (type === "error") {
      return (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {content}
        </div>
      );
    }

    if (type === "grammar" && typeof content === "object") {
      return (
        <div className="space-y-3 text-sm">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">CORRECTED</p>
            <p className="text-foreground">{content.corrected}</p>
            <button
              onClick={() => copyText(content.corrected, id)}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied === id ? "Copied!" : "Copy"}
            </button>
          </div>
          {content.issues?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">ISSUES FOUND</p>
              {content.issues.map((issue, i) => (
                <div key={i} className="bg-secondary/50 rounded-lg px-3 py-2">
                  <p className="font-medium text-foreground">{issue.issue}</p>
                  <p className="text-muted-foreground mt-0.5">{issue.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (type === "improve" && typeof content === "object") {
      return (
        <div className="space-y-3 text-sm">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">IMPROVED VERSION</p>
            <p className="text-foreground">{content.improved}</p>
            <button
              onClick={() => copyText(content.improved, id)}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied === id ? "Copied!" : "Copy"}
            </button>
          </div>
          {content.changes?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">WHAT CHANGED</p>
              {content.changes.map((c, i) => (
                <p key={i} className="text-muted-foreground text-xs">• {c}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (type === "define" && typeof content === "object") {
      return (
        <div className="text-sm space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-foreground text-base">{content.word}</span>
            {content.partOfSpeech && (
              <span className="text-xs text-muted-foreground italic">{content.partOfSpeech}</span>
            )}
          </div>
          <p className="text-foreground">{content.definition}</p>
          {content.exampleSentence && (
            <p className="text-muted-foreground italic text-xs">"{content.exampleSentence}"</p>
          )}
          {content.synonyms?.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Synonyms:</span> {content.synonyms.join(", ")}
            </p>
          )}
        </div>
      );
    }

    // summarize + chat — plain text
    return (
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-all hover:scale-105"
          title="Open AI Assistant"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
      )}

      {/* Chat widget */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-xl shadow-2xl border border-border bg-background overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">AI Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode selector */}
          <div className="px-4 py-2 border-b border-border bg-card/50 relative">
            <button
              onClick={() => setDropdown((d) => !d)}
              className="flex items-center justify-between w-full text-sm text-foreground bg-secondary/60 hover:bg-secondary rounded-lg px-3 py-2 transition-colors"
            >
              <span>{currentMode?.label}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdown ? "rotate-180" : ""}`} />
            </button>
            {dropdown && (
              <div className="absolute left-4 right-4 top-full mt-1 z-10 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setDropdown(false); setMessages([]); setInput(""); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-secondary ${mode === m.id ? "bg-secondary font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <MessageCircle className="w-8 h-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">{currentMode?.hint}</p>
                {mode === "grammar" || mode === "improve" ? (
                  <p className="text-xs text-muted-foreground/60 mt-1">Tip: select text on the blog to auto-fill</p>
                ) : null}
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] bg-card border border-border rounded-2xl rounded-tl-sm px-3 py-2.5">
                    {renderAssistantMessage(msg)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-border bg-card/50">
            {mode === "summarize" ? (
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Summarize this blog
              </button>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "grammar" ? "Paste text to check grammar..." :
                    mode === "improve" ? "Paste text to improve..." :
                    mode === "define"  ? "Type a word to define..." :
                    "Ask me anything..."
                  }
                  disabled={loading}
                  className="flex-1 resize-none bg-background border border-border rounded-lg px-3 py-2 text-sm !text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 min-h-[38px]"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 bg-primary text-primary-foreground rounded-lg p-2 hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}