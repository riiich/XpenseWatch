import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();

  const sectionCls = "bg-[#0a1422] border border-[#1e293b] rounded-xl p-6 mb-4";
  const labelCls = "text-[9px] tracking-[0.15em] text-slate-500 uppercase mb-1.5 block";
  const inputCls =
    "w-full px-3 py-2.5 rounded-lg bg-[#060c14] text-slate-100 border border-[#1e293b] text-[12px] focus:border-amber-400/50 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#060c14] px-10 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-semibold text-slate-100 mb-8">Settings</h1>

      {/* Profile */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-slate-200 mb-5">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input className={inputCls} type="text" placeholder="Jane" />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input className={inputCls} type="text" placeholder="Doe" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Email</label>
            <input className={inputCls} type="email" placeholder="jane@example.com" />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-lg bg-amber-400 text-[#060c14] text-[12px] font-medium hover:bg-amber-300 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Password */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-slate-200 mb-5">Change Password</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>Current Password</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-lg bg-[#111d2e] border border-[#1e3052] text-amber-400 text-[12px] hover:bg-[#162236] transition-colors">
          Update Password
        </button>
      </div>

      {/* Preferences */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-slate-200 mb-5">Preferences</h2>
        <div>
          <label className={labelCls}>Default Currency</label>
          <select className={inputCls}>
            {["USD", "EUR", "GBP", "JPY", "CAD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-rose-900/40 rounded-xl p-6">
        <h2 className="text-sm font-medium text-rose-400 mb-2">Danger Zone</h2>
        <p className="text-[12px] text-slate-500 mb-4">
          These actions are permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-lg border border-[#1e293b] text-slate-500 text-[12px] hover:text-slate-300 transition-colors"
          >
            Sign Out
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-rose-900/60 text-rose-500 text-[12px] hover:bg-rose-900/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
