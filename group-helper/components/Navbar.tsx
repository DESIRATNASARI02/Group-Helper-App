import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-5">
      <div className="flex items-center gap-3">
        <Image
          src="/group-helper-logo.png"
          alt="Group Helper"
          width={52}
          height={52}
        />
        <span className="text-2xl font-extrabold">
          <span className="text-blue-600">group</span>
          <span className="text-green-600">-helper</span>
        </span>
      </div>

      <nav className="hidden gap-8 lg:flex">
        <Link href="#features" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">How It Works</Link>
        <Link href="#about" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">About Us</Link>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}