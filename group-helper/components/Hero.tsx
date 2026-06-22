import Link from "next/link";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative py-10 lg:py-16">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-blue-400/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-green-400/8 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-12 lg:grid-cols-2">

        {/* LEFT */}
        <div className="flex flex-col items-start">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 mb-8">
            ✨ All-in-One Study Group Management
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            Study Smarter,
            <br />
            <span className="text-green-500">Together.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-md">
            Manage tasks, schedule sessions, share notes, and chat with your study group in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              View Demo
            </button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  alt={`Student ${i}`}
                  className="w-10 h-10 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="text-amber-400 text-base tracking-wide">★★★★★</div>
              <p className="text-sm text-slate-400 mt-0.5">Trusted by 2,000+ students</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="absolute -left-6 top-10 grid grid-cols-6 gap-2.5 opacity-25 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            ))}
          </div>
          <div className="absolute -right-4 top-8 space-y-2 pointer-events-none">
            <div className="h-0.5 w-10 rounded-full bg-blue-400/50 -rotate-12" />
            <div className="h-0.5 w-6 rounded-full bg-green-400/50 -rotate-12" />
          </div>
          <DashboardPreview />
        </div>

      </div>
    </section>
  );
}