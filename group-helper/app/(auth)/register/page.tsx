"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarColor: "#CECBF6",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const avatarColors = [
    { bg: "#CECBF6", text: "#3C3489" },
    { bg: "#9FE1CB", text: "#085041" },
    { bg: "#F5C4B3", text: "#712B13" },
    { bg: "#FAC775", text: "#633806" },
    { bg: "#B5D4F4", text: "#0C447C" },
    { bg: "#C0DD97", text: "#27500A" },
  ];

  const getInitials = () => {
    const first = form.firstName.charAt(0).toUpperCase();
    const last = form.lastName.charAt(0).toUpperCase();
    return `${first}${last}` || "DR";
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (p.length === 0) return { strength: 0, label: "", color: "" };
    if (p.length < 6) return { strength: 1, label: "Lemah", color: "bg-error" };
    if (p.length < 10) return { strength: 2, label: "Sedang", color: "bg-warning" };
    return { strength: 3, label: "Kuat", color: "bg-success" };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }

    if (!agreed) {
      setError("Kamu harus menyetujui syarat & ketentuan!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          avatarColor: form.avatarColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/login");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { strength, label, color } = getPasswordStrength();
  const selectedColor = avatarColors.find((c) => c.bg === form.avatarColor);

  const steps = [
    { num: 1, title: "Buat akun", desc: "Data diri & password", active: true },
    { num: 2, title: "Verifikasi email", desc: "Cek inbox kamu", active: false },
    { num: 3, title: "Buat / join grup", desc: "Mulai belajar bareng", active: false },
    { num: 4, title: "Siap digunakan", desc: "Dashboard aktif", active: false },
  ];

  return (
    <div className="min-h-screen flex" data-theme="night">

      {/* Sidebar Kiri */}
      <div
        className="hidden lg:flex w-80 flex-col items-center justify-center p-10 gap-8"
        style={{ background: "#6C63FF" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden">
            <Image
              src="/group-helper-logo.png"
              alt="Group Helper Logo"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Group Helper</h1>
        </div>

        <div className="flex flex-col gap-0 w-full">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold .flex-shrink-0"
                  style={{
                    background: step.active ? "#EF9F27" : "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-white/20 my-1"></div>
                )}
              </div>
              <div className="pb-6">
                <div className="text-white text-sm font-medium">{step.title}</div>
                <div className="text-white/60 text-xs">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Kanan */}
      <div className="flex-1 flex items-center justify-center p-8 bg-base-100 overflow-y-auto">
        <div className="w-full max-w-md py-6">

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-base-content">Buat akun baru</h2>
            <p className="mt-1" style={{ color: "#6C63FF" }}>
              Isi data diri kamu untuk mulai
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Avatar Picker */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Pilih warna avatar</span>
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold .flex-shrink-0"
                  style={{
                    background: form.avatarColor,
                    color: selectedColor?.text || "#3C3489",
                  }}
                >
                  {getInitials()}
                </div>
                <div className="flex gap-2">
                  {avatarColors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, avatarColor: c.bg })}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: c.bg,
                        outline: form.avatarColor === c.bg ? `2px solid white` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Nama */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nama depan</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Desi"
                  className="input input-bordered w-full"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nama belakang</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Ratna"
                  className="input input-bordered w-full"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan password"
                  className="input input-bordered w-full pr-12"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i <= strength ? color : "bg-base-300"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength === 3 ? "text-success" : strength === 2 ? "text-warning" : "text-error"}`}>
                    Password {label}
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Konfirmasi password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password"
                  className="input input-bordered w-full pr-12"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {form.confirmPassword && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mt-1"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="text-sm text-base-content/70">
                Saya setuju dengan{" "}
                <a href="#" className="hover:underline" style={{ color: "#6C63FF" }}>syarat & ketentuan</a>
                {" "}dan{" "}
                <a href="#" className="hover:underline" style={{ color: "#6C63FF" }}>kebijakan privasi</a>
                {" "}Group Helper
              </span>
            </div>

            <button
              type="submit"
              className={`btn w-full text-white font-bold ${loading ? "loading" : ""}`}
              style={{ background: "#6C63FF" }}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar sekarang"}
            </button>
          </form>

          <div className="divider text-sm text-base-content/40">atau</div>

          <button className="btn btn-outline w-full gap-2">
            <span className="font-bold text-red-500">G</span>
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#6C63FF" }}>
              Masuk di sini
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}