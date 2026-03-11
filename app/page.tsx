"use client"
 
import { useLayoutEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import MoodDashboard from "@/components/MoodDashboard"
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
 
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
  const [page, setPage] = useState<"chat" | "mood" | "insights">("chat")
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
 
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
 
  const detectMoodFromText = (input: string) => {
    const lower = input.toLowerCase()
 
    const positiveWords = [
      "good",
      "great",
      "happy",
      "excited",
      "calm",
      "better",
      "fine",
      "proud",
      "hopeful",
      "motivated",
      "energetic",
      "love",
      "relaxed",
      "nice",
    ]
 
    const negativeWords = [
      "sad",
      "bad",
      "angry",
      "tired",
      "lonely",
      "anxious",
      "worried",
      "depressed",
      "upset",
      "stressed",
      "hurt",
      "empty",
      "scared",
      "burned out",
    ]
 
    let positive = 0
    let negative = 0
 
    for (const word of positiveWords) {
      if (lower.includes(word)) positive++
    }
 
    for (const word of negativeWords) {
      if (lower.includes(word)) negative++
    }
 
    if (positive > negative + 1) {
      return {
        score: 4.2,
        label: "Positive",
        summary: "This session felt mostly positive and uplifting.",
      }
    }
 
    if (negative > positive + 1) {
      return {
        score: 1.8,
        label: "Low",
        summary: "This session felt emotionally heavy or difficult.",
      }
    }
 
    return {
      score: 3,
      label: "Neutral / Mixed",
      summary: "This session had a balanced or mixed emotional tone.",
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
                "You are an empathetic journaling companion. Respond naturally, warmly, and keep responses fairly short but thoughtful.",
            },
            ...newMessages,
          ],
        }),
      })
 
      const data = await res.json()
      const aiMessage =
        data?.message?.content || "AI could not generate a response."
 
      await typeAssistantMessage(newMessages, aiMessage)
 
      const recentUserText = newMessages
        .filter((m) => m.role === "user")
        .slice(-3)
        .map((m) => m.content)
        .join(" ")
 
      const mood = detectMoodFromText(recentUserText)
 
      setMoodEntries((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score: mood.score,
          label: mood.label,
          summary: mood.summary,
        },
      ])
    } catch (error) {
      console.error(error)
 
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
      className={`flex flex-col items-center min-h-screen px-4 py-5 sm:px-6 lg:px-10 gap-4 sm:gap-6 text-white transition-all duration-300 ${
        menuOpen ? "ml-[220px] sm:ml-[240px] md:ml-[260px]" : "ml-0"
      }`}
    >
      <div className="w-full max-w-6xl flex justify-end items-center gap-3 mb-2">
       <div className="flex gap-3">
 
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
      </div>
 
      {/* MENU BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 md:top-6 md:left-6 text-2xl md:text-3xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/30 rounded-2xl px-3 py-2 md:px-4 md:py-2 backdrop-blur-xl z-50"
      >
        ☰
      </button>
 
      {/* SIDEBAR */}
      {menuOpen && (
        <div
          className={`
            fixed md:relative
            top-0 left-0
            w-[260px]
            h-full
            bg-gradient-to-b from-blue-800/60 via-blue-900/40 to-black/80
            backdrop-blur-2xl
            border-r border-white/10
            shadow-2xl
            p-5 pt-20
            flex flex-col gap-4
            z-40
          `}
        >
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
 
      {/* CHAT PAGE */}
      {page === "chat" && (
        <>
          <div className="w-full max-w-2xl md:max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-blue-800/60 via-blue-900/40 to-black/80 backdrop-blur-2xl shadow-2xl px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8 mb-2">
            <div className="flex flex-row items-center gap-2 sm:gap-6">
              <Image
                src="/logo.png"
                alt="SoulTrack AI"
                width={220}
                height={220}
                className="w-[55px] h-[55px] sm:w-[120px] sm:h-[120px] md:w-[220px] md:h-[220px] drop-shadow-2xl"
              />
 
              <h1
                className="
                  text-2xl sm:text-5xl md:text-[56px]
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
 
          <div
            ref={chatContainerRef}
            className="w-full max-w-4xl h-[320px] sm:h-[400px] md:h-[450px] overflow-y-auto rounded-3xl border border-blue-400/40 bg-[#0b1220]/70 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-4 sm:p-5 md:p-6 space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-white/50 text-sm sm:text-base">
                Start writing about how you feel...
              </div>
            )}
 
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-white/10 border border-white/20 text-white rounded-bl-sm"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
 
            {loading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed bg-white/10 border border-white/20 text-white rounded-bl-sm flex gap-1 items-center">
                    <span className="animate-bounce [animation-delay:-0.3s]">
                      •
                    </span>
                    <span className="animate-bounce [animation-delay:-0.15s]">
                      •
                    </span>
                    <span className="animate-bounce">•</span>
                  </div>
                </div>
              )}
          </div>
 
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
              className="w-full h-28 sm:h-32 md:h-36 p-4 sm:p-5 md:p-6 rounded-3xl bg-[#0b1220]/70 border border-white/10 backdrop-blur-2xl text-base sm:text-lg text-white placeholder-white/40 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            />
 
            <div className="flex justify-end">
              <button
                onClick={analyze}
                disabled={loading}
                className="px-6 sm:px-7 md:px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-sm sm:text-base"
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </>
      )}
 
      {/* MOOD PAGE */}
      {page === "mood" && (
        <MoodDashboard
          moodEntries={moodEntries}
          period={period}
          setPeriod={setPeriod}
        />
      )}
 
      {/* INSIGHTS PAGE */}
      {page === "insights" && (
        <div className="w-full max-w-4xl rounded-3xl border border-blue-400/40 bg-gradient-to-b from-blue-800/20 via-blue-900/20 to-black/40 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-5 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            AI Insights
          </h2>
 
          <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed">
            <p>
              Here we will later add deeper AI analysis of emotional patterns,
              repeated struggles, positive trends, and growth over time.
            </p>
 
            <p>
              In the next version, SoulTrack AI can start comparing your weekly
              and monthly emotional tone to show your personal changes.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}