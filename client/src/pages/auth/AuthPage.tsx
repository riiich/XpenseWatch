import { useState } from "react";
import type { AuthView } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [view, setView] = useState<AuthView>("login");

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-[#060c14] text-slate-100 border border-[#1e293b] text-[12px] focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-slate-600";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,_#0f1e35_0%,_#060c14_60%)]">
      <div className="bg-[#0a1422] border border-[#1e293b] rounded-3xl p-11 w-96 animate-fade-in">
        {/* Logo */}
        <div className="font-display text-[28px] font-semibold text-amber-400 tracking-wide mb-2">
          ◈ LEDGER
        </div>
        <p className="text-[12px] text-slate-500 tracking-wide mb-8">
          Your finances, clarified.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#060c14] rounded-xl p-1 mb-6">
          {(["login", "signup"] as AuthView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2.5 rounded-lg text-[11px] tracking-wide transition-colors ${
                view === v
                  ? "bg-[#111d2e] text-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {v === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {view === "signup" && (
            <input className={inputCls} type="text" placeholder="Full Name" />
          )}
          <input className={inputCls} type="email" placeholder="Email address" />
          <input className={inputCls} type="password" placeholder="Password" />
          {view === "signup" && (
            <input className={inputCls} type="password" placeholder="Confirm password" />
          )}

          <button
            onClick={login}
            className="w-full py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide mt-1 hover:bg-amber-300 transition-colors"
          >
            {view === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Demo shortcut */}
        <p
          onClick={login}
          className="text-center text-[11px] text-slate-500 mt-5 cursor-pointer tracking-wide hover:text-slate-400 transition-colors"
        >
          Continue with demo →
        </p>
      </div>
    </div>
  );
}
