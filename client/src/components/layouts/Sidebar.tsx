import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS } from "../../lib/constants";
import { fmt } from "../../lib/utils";

interface SidebarProps {
  onAddAccount: () => void;
}

export function Sidebar({ onAddAccount }: SidebarProps) {
  const { accounts, selectedAccId, setSelectedAccId } = useApp();
  const { logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-[#0a1422] border-r border-[#1e293b] flex flex-col py-7 overflow-y-auto">
      {/* Logo */}
      <div className="font-display text-[22px] font-semibold text-amber-400 tracking-wide px-6 pb-7 border-b border-[#1e293b] mb-5">
        ◈ LEDGER
      </div>

      {/* Accounts list */}
      <div className="flex-1 px-3">
        <span className="text-[9px] tracking-[0.18em] text-slate-500 px-3 block mb-2">
          ACCOUNTS
        </span>

        {accounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setSelectedAccId(acc.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors mb-0.5
              ${selectedAccId === acc.id
                ? "bg-[#111d2e] text-slate-100"
                : "text-slate-400 hover:bg-[#0f1a27] hover:text-slate-200"
              }`}
          >
            <span className="text-amber-400 w-5 text-center text-base">
              {ACCOUNT_TYPE_ICONS[acc.type]}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium truncate">{acc.name}</span>
              <span
                className={`text-[10px] tracking-wide ${
                  acc.balance >= 0 ? "text-slate-500" : "text-rose-400"
                }`}
              >
                {fmt(acc.balance, acc.currency)}
              </span>
            </div>
          </button>
        ))}

        <button
          onClick={onAddAccount}
          className="w-full px-3 py-2.5 rounded-lg text-[11px] text-slate-500 text-left
            border border-dashed border-[#1e293b] mt-2 tracking-wide
            hover:border-slate-600 hover:text-slate-400 transition-colors"
        >
          + Add Account
        </button>
      </div>

      {/* Bottom */}
      <div className="px-3 pt-5 border-t border-[#1e293b]">
        <button
          onClick={logout}
          className="w-full px-3 py-2 rounded-lg text-[11px] text-slate-500
            tracking-widest hover:text-slate-400 transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
