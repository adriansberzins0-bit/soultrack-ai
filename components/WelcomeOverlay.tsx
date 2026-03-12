"use client"
 
import Image from "next/image"
 
type WelcomeOverlayProps = {
  visible: boolean
  fadingOut?: boolean
}
 
export default function WelcomeOverlay({
  visible,
  fadingOut = false,
}: WelcomeOverlayProps) {
  if (!visible) return null
 
  return (
    <div
      className={`
        fixed inset-0 z-[999] flex items-center justify-center overflow-hidden
        transition-opacity duration-700
        ${fadingOut ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.38),_rgba(12,18,36,0.96)_42%,_rgba(0,0,0,1)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-xl" />
 
      {/* GLOWS */}
      <div className="absolute top-[-140px] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulseSlow" />
      <div className="absolute bottom-[-120px] left-1/2 h-[260px] w-[560px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute left-[10%] top-[30%] h-[160px] w-[160px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[12%] top-[28%] h-[180px] w-[180px] rounded-full bg-blue-400/10 blur-3xl" />
 
      {/* PARTICLES */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[18%] top-[20%] h-2 w-2 rounded-full bg-blue-300/60 blur-[1px] animate-twinkle" />
        <span className="absolute left-[30%] top-[14%] h-1.5 w-1.5 rounded-full bg-white/70 blur-[1px] animate-twinkle [animation-delay:0.4s]" />
        <span className="absolute right-[22%] top-[18%] h-2 w-2 rounded-full bg-cyan-300/60 blur-[1px] animate-twinkle [animation-delay:0.8s]" />
        <span className="absolute left-[24%] bottom-[24%] h-1.5 w-1.5 rounded-full bg-blue-200/60 blur-[1px] animate-twinkle [animation-delay:1.2s]" />
        <span className="absolute right-[28%] bottom-[20%] h-2 w-2 rounded-full bg-white/60 blur-[1px] animate-twinkle [animation-delay:1.6s]" />
      </div>
 
      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="animate-welcomePop animate-soulyFloat">
          <Image
            src="/logo.png"
            alt="SoulTrack AI"
            width={340}
            height={340}
            priority
            className="-mb-20 drop-shadow-[0_0_55px_rgba(59,130,246,0.75)] select-none"
          />
        </div>
 
        <p className="mt-6 text-2xl font-bold tracking-wide text-white md:text-4xl">
          Welcome to
        </p>
 
        <h1 className="mt-1 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
          SoulTrack AI
        </h1>
 
        <div className="mt-6 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.85)] animate-dotBounce" />
          <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)] animate-dotBounce [animation-delay:0.2s]" />
          <span className="h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,140,248,0.85)] animate-dotBounce [animation-delay:0.4s]" />
        </div>
 
        <p className="mt-4 max-w-md text-sm text-white/55 md:text-base">
          Your emotional AI companion is getting ready...
        </p>
      </div>
    </div>
  )
}