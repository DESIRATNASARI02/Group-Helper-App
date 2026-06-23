"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      
      const groupRes = await fetch("/api/groups/my");
      const groupData = await groupRes.json();

      if (groupData.groups?.length > 0) {
        router.push("/dashboard"); 
      } else {
        router.push("/groups"); 
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "✅", text: "Shared task management" },
    { icon: "📝", text: "Catatan bersama grup" },
    { icon: "📅", text: "Jadwal belajar terorganisir" },
    { icon: "💬", text: "Real-time group chat" },
    { icon: "🤖", text: "Reminder bot otomatis" },
  ];

  return (
    <div className="min-h-screen flex" data-theme="night">

      {/* Sidebar Kiri */}
      <div
        className="hidden lg:flex w-96 flex-col items-center justify-center p-10 gap-8"
        style={{ background: "#6C63FF" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden">
            <Image
              src="/group-helper-logo.png"
              alt="Group Helper Logo"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Group Helper</h1>
          <p className="text-white/70 text-center text-sm">
            Platform manajemen kelompok belajar yang efektif
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                {f.icon}
              </div>
              <span className="text-white/90 text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Kanan */}
      <div className="flex-1 flex items-center justify-center p-8 bg-base-100">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-base-content">Selamat datang</h2>
            <p className="text-base-content/60 mt-1">
              Masuk ke akun Group Helper kamu
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered w-full focus:border-purple-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
                
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan password"
                  className="input input-bordered w-full pr-12 focus:border-purple-500"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn w-full mt-2 text-white font-bold ${loading ? "loading" : ""}`}
              style={{ background: "#6C63FF" }}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#6C63FF" }}>
              Daftar sekarang
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}