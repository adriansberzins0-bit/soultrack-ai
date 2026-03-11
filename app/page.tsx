"use client"
 
import { useState, useRef, useLayoutEffect, useEffect } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import MoodDashboard from "@/components/MoodChart"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
 
type ChatMessage = {
  role: "user" | "assistant"
  content: string
}
 
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState<"chat" | "mood" | "insights">("chat")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      analyze()
    }
  }
 
  const chatRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
 
  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])
 
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = menuOpen ? "hidden" : "auto"
    } else {
      document.body.style.overflow = "auto"
    }
 
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])
 
  const typeAssistantMessage = async (reply: string) => {
    let current = ""
 
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])
 
    for (let i = 0; i < reply.length; i++) {
      current += reply[i]
 
      await new Promise((resolve) => setTimeout(resolve, 8))
 
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: "assistant",
          content: current,
        }
        return copy
      })
    }
  }
 
  const analyze = async () => {
    if (!text.trim() || loading) return
 
    const userMessage: ChatMessage = {
      role: "user",
      content: text.trim(),
    }
 
    const newMessages = [...messages, userMessage]
 
    setMessages(newMessages)
    setText("")
    setLoading(true)
 
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })
 
      const data = await res.json()
 
      const reply =
        data?.message?.content || "Something went wrong while contacting AI."
 
      setLoading(false)
      await typeAssistantMessage(reply)
    } catch {
      setLoading(false)
      await typeAssistantMessage("Something went wrong while contacting AI.")
    } finally {
      textareaRef.current?.focus()
    }
  }
 
  const openPage = (p: "chat" | "mood" | "insights") => {
    setPage(p)
 
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMenuOpen(false)
    }
  }
 
 
 
  return (
    <>
      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
 
      {/* MENU BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          fixed top-4 left-4 md:top-6 md:left-6
          z-50
          rounded-2xl border border-white/10
          bg-blue-500/20 hover:bg-blue-500/30
          px-4 py-3
          text-2xl text-white
          shadow-xl backdrop-blur-xl
          transition
        "
      >
        ☰
      </button>
 
      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-full w-[270px]
          bg-gradient-to-b from-blue-800/70 via-blue-900/50 to-black/90
          backdrop-blur-2xl
          border-r border-white/10
          shadow-2xl
          px-6 pt-24 pb-8
          flex flex-col gap-5
          transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => openPage("chat")}
          className="text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition text-white"
        >
          Chat
        </button>
 
        <button
          onClick={() => openPage("mood")}
          className="text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition text-white"
        >
          Mood Dashboard
        </button>
 
        <button
          onClick={() => openPage("insights")}
          className="text-left px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition text-white"
        >
          AI Insights
        </button>
      </aside>
 
      {/* MAIN */}
      <main
        className={`
          flex flex-col items-center
          min-h-screen
          px-4 py-6
          gap-6
          text-white
          transition-all duration-300
          ${menuOpen ? "md:ml-[270px]" : "md:ml-0"}
        `}
      >
        {/* TOP RIGHT LOGIN */}
        <div className="w-full max-w-6xl flex justify-end gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                Login
              </button>
            </SignInButton>
 
            <SignUpButton mode="modal">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                Sign up
              </button>
            </SignUpButton>
          </Show>
 
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
 
        {/* HERO */}
        <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-blue-800/60 to-black/80 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
          <div className="flex items-center gap-5 px-6 py-8">
            <Image
              src="/logo.png"
              alt="SoulTrack AI"
              width={160}
              height={160}
              className="w-[60px] h-[60px] md:w-[120px] md:h-[120px]"
            />
 
            <h1 className="text-3xl md:text-[56px] font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              SoulTrack AI
            </h1>
          </div>
        </div>
 
        {/* CHAT PAGE */}
        {page === "chat" && (
          <>
            <div
              ref={chatRef}
              className="w-full max-w-4xl h-[320px] rounded-3xl border border-white/10 bg-black/40 p-6 overflow-y-auto"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-lg
                      ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          : "bg-white/10 border border-white/10 text-white"
                      }
                    `}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
 
              {loading && (
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:text-base bg-white/10 border border-white/10 text-white shadow-lg">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>
 
            <div className="w-full max-w-4xl flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write about how you're feeling..."
                className="flex-1 min-h-[110px] rounded-2xl bg-black/40 border border-white/10 p-4 resize-none outline-none"
              />
 
              <button
                onClick={analyze}
                disabled={loading}
                className="px-6 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        )}
 
        {/* MOOD PAGE */}
        {page === "mood" && <MoodDashboard />}
 
        {/* INSIGHTS PAGE */}
        {page === "insights" && (
          <div className="max-w-4xl text-white/80 text-center">
            AI insights will appear here.
          </div>
        )}
      </main>
    </>
  )
}