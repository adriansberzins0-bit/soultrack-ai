"use client"
 
import { useLayoutEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import MoodDashboard from "@/components/MoodDashboard"
 
type ChatMessage = {
  role: "user" | "assistant"
  content: string
}
type MoodEntry = {
  id: string
  date: string
  score: number
  label: string
  summary: string
}
 
export default function Home() {
 
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState("chat")
  const [period, setPeriod] = useState<"week" | "month">("week")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  

 
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
 
  useLayoutEffect(() => {
    if (!chatContainerRef.current) return
 
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, loading])
 
 
 
  const typeAssistantMessage = async (
    baseMessages: ChatMessage[],
    fullText: string
  ) => {
 
    let current = ""
 
    setMessages([...baseMessages, { role: "assistant", content: "" }])
 
    for (let i = 0; i < fullText.length; i++) {
 
      current += fullText[i]
 
      setMessages([...baseMessages, { role: "assistant", content: current }])
 
      await new Promise((resolve) => setTimeout(resolve, 12))
 
    }
 
  }
 
 
 
  const analyze = async () => {
 
    if (!text.trim() || loading) return
 
    const userText = text.trim()
 
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ]
 
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
          messages: [
            {
              role: "system",
              content:
                "You are an empathetic journaling companion. Respond naturally and keep responses short.",
            },
            ...newMessages,
          ],
        }),
      })
 
      const data = await res.json()
 
      const aiMessage = data.message?.content || "AI could not respond."
 
      await typeAssistantMessage(newMessages, aiMessage)
 
    } catch {
 
      await typeAssistantMessage(
        newMessages,
        "Something went wrong while contacting AI."
      )
 
    } finally {
 
      setLoading(false)
      textareaRef.current?.focus()
 
    }
 
  }
 
 
 
  return (
 
    <main
      className={`
      flex flex-col items-center min-h-screen p-10 gap-6 text-white
      transition-all duration-300
      ${menuOpen ? "ml-[260px]" : "ml-0"}
      `}
    >
 
 
 
      {/* MENU BUTTON */}
 
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        
        
        >
          Mood Dashboard
      </button>
 
 
 
      {/* SIDEBAR */}
 
      {menuOpen && (
  <div
    className="
    fixed top-0 left-0
    h-full w-[260px]
    bg-gradient-to-b from-blue-800/60 via-blue-900/40 to-black/80
    backdrop-blur-2xl
    border-r border-white/10
    shadow-2xl
    p-6 pt-24
    flex flex-col gap-6
    z-40
    "
  >
 
    <h2 className="text-3xl font-bold mb-4">
      Menu
    </h2>
 
    <button
      onClick={() => {
        setPage("chat")
        setMenuOpen(false)
      }}
      className="text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition shadow-lg"
    >
      Chat
    </button>
 
    <button
      onClick={() => {
        setPage("mood")
        setMenuOpen(false)
      }}
      className="text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition shadow-lg"
    >
      Mood Dashboard
    </button>
 
    <button
      onClick={() => {
        setPage("insights")
        setMenuOpen(false)
      }}
      className="text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition shadow-lg"
    >
      AI Insights
    </button>
 
  </div>
)}
 
 {page === "chat" && (
  <>
 
      {/* LOGO + TITLE */}
 
<div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-blue-800/60 via-blue-900/40 to-black/80 backdrop-blur-2xl shadow-2xl px-10 py-8 mb-6">
  <div className="flex items-center gap-8">
    <Image
      src="/logo.png"
      alt="SoulTrack AI"
      width={220}
      height={220}
      className="drop-shadow-2xl"
    />
 
    <h1
      className="
        text-[56px]
        font-black
        tracking-tight
        bg-gradient-to-r
        from-white
        via-blue-100
        to-blue-300
        bg-clip-text
        text-transparent
        drop-shadow-2xl
      "
    >
      SoulTrack AI
    </h1>
  </div>
</div>
 
 
 
      {/* CHAT BOX */}
 
      <div
        ref={chatContainerRef}
        className="w-full max-w-4xl h-[450px] overflow-y-auto rounded-3xl border border-blue-400/40 bg-[#0b1220]/70 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-6 space-y-4"
      >
 
        {messages.map((msg, i) => (
 
          <div
            key={i}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
 
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm shadow-lg"
                  : "bg-[#111a2b]/90 border border-white/10 text-white rounded-bl-sm shadow-lg"
              }`}
            >
 
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
 
            </div>
 
          </div>
 
        ))}
 
 
 
        {loading && (
 
          <div className="flex justify-start">
 
            <div className="max-w-[70%] px-4 py-3 rounded-2xl text-sm bg-[#111a2b]/90 border border-white/10 text-white rounded-bl-sm flex gap-1">
 
              <span className="animate-bounce">•</span>
              <span className="animate-bounce">•</span>
              <span className="animate-bounce">•</span>
 
            </div>
 
          </div>
 
        )}
 
      </div>
 
 
 
      {/* INPUT */}
 
      <div className="w-full max-w-4xl flex flex-col gap-3">
 
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
 
            if (e.key === "Enter" && !e.shiftKey) {
 
              e.preventDefault()
              analyze()
 
            }
 
          }}
          placeholder="Write about how you're feeling..."
          className="w-full h-36 p-6 rounded-3xl bg-[#0b1220]/70 border border-white/10 backdrop-blur-2xl text-lg text-white placeholder-white/40 shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
        />
 
 
        <div className="flex justify-end">
 
          <button
            onClick={analyze}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border border-blue-300/20 transition font-semibold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
 
        </div>
 
      </div>
      </>
  )}
 {page === "mood" && (
        <MoodDashboard
          moodEntries={moodEntries}
          period={period}
          setPeriod={setPeriod}
        />
      )}
    </main>
 
  )
 
}

 
 
   