import { useState } from "react";

const Icon = ({ name, size = 20, className = "" }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true
  };

  const paths = {
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3.1 3.8" />
        <path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.3 3.3-.7" />
      </>
    ),
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        <path d="M12 8v8m-4-4h8" />
      </>
    )
  };

  return <svg {...common}>{paths[name]}</svg>;
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            username: username.trim(),
            password,
            remember
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password.");
      }

      // รองรับ API ที่ใช้ cookie session หรือ token
      if (data.token) {
        if (remember) {
          localStorage.setItem("auth_token", data.token);
        } else {
          sessionStorage.setItem("auth_token", data.token);
        }
      }

      // เก็บข้อมูลผู้ใช้ ถ้า API ส่งกลับมา
      if (data.user) {
        sessionStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      // Redirect หลัง Login สำเร็จ
      window.location.href = data.redirectTo || "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Healthcare branding */}
        <section className="relative hidden overflow-hidden bg-[#102b46] px-12 py-10 text-white lg:flex lg:flex-col xl:px-20">
          <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

          <header className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-[#102b46] shadow-lg shadow-teal-950/20">
              <Icon name="heart" size={27} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">Queue HOS</p>
              <p className="text-xs text-slate-300">
                Hospital Queue Management
              </p>
            </div>
          </header>

          <div className="relative my-auto max-w-xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Smarter healthcare experiences
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Better care
              <br />
              starts with
              <span className="text-teal-300"> better flow.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              A smarter way to manage hospital queues, support healthcare teams,
              and create a smoother patient experience.
            </p>

            <div className="mt-12 grid max-w-lg grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300">
                  <Icon name="shield" size={23} />
                </div>
                <p className="font-semibold">Secure access</p>
                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Designed with privacy in mind
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300">
                  <Icon name="user" size={23} />
                </div>
                <p className="font-semibold">Team focused</p>
                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Built for hospital workflows
                </p>
              </div>
            </div>
          </div>

          <footer className="relative flex items-center justify-between gap-4 text-xs text-slate-400">
            <span>Queue HOS · Hospital Management</span>
            <span>Care made simpler.</span>
          </footer>
        </section>

        {/* Right: Login form */}
        <section className="flex min-h-screen flex-col bg-white px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          <header className="flex items-center justify-between lg:justify-end">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102b46] text-teal-300">
                <Icon name="heart" size={23} />
              </div>
              <span className="font-bold tracking-tight text-[#102b46]">
                Queue HOS
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Healthcare portal
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Icon name="shield" size={29} />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#102b46] sm:text-4xl">
                Sign in to your
                <br />
                account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access the hospital management system.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Username
                </label>

                <div className="group flex items-center rounded-xl border border-slate-200 bg-slate-50/70 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-500/10">
                  <span className="pl-4 text-slate-400 transition group-focus-within:text-teal-600">
                    <Icon name="user" />
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <div className="group flex items-center rounded-xl border border-slate-200 bg-slate-50/70 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-500/10">
                  <span className="pl-4 text-slate-400 transition group-focus-within:text-teal-600">
                    <Icon name="lock" />
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} size={19} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-teal-600 focus:ring-teal-500"
                  />
                  Remember me
                </label>

                {/* Connect this link to your password recovery route. */}
                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#102b46] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#102b46]/10 transition duration-200 hover:bg-[#183c5c] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    <Icon name="arrow" size={19} />
                  </span>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">
                SECURE HEALTHCARE ACCESS
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="mt-0.5 text-teal-700">
                <Icon name="shield" size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Your security matters
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Please keep your login credentials private. Always sign out
                  when using a shared computer.
                </p>
              </div>
            </div>
          </div>

          <footer className="mx-auto w-full max-w-md pt-4 text-center text-xs leading-5 text-slate-400">
            <p>For authorized hospital personnel only.</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Queue HOS. All rights reserved.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
