import { useState } from "react";
import type { Category, Transaction } from "../../types";
import { CURRENCIES } from "../../lib/constants";
import { Modal } from "../ui/Modal";

interface AddTransactionFormProps {
  onClose: () => void;
  onAdd: (tx: Omit<Transaction, "id">) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
}

type Tab = "manual" | "upload";

export function AddTransactionForm({
  onClose,
  onAdd,
  categories,
  onAddCategory,
}: AddTransactionFormProps) {
  const [tab, setTab] = useState<Tab>("manual");

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    currency: "USD",
    description: "",
    notes: "",
    category: categories[0]?.name ?? "",
    type: "debit" as "debit" | "credit",
  });

  const [newCatName, setNewCatName] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount) return;
    onAdd({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    set("category", newCatName.trim());
    setShowNewCat(false);
    setNewCatName("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // TODO: replace with real API call to your backend
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false);
    alert("File uploaded! Your backend will parse and return transactions.");
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg bg-[#060c14] text-slate-100 border border-[#1e293b] text-[12px] focus:border-amber-400/50 focus:outline-none transition-colors";

  const labelCls = "text-[9px] tracking-[0.14em] text-slate-500 uppercase mb-1.5 block";

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      {/* Tabs */}
      <div className="flex gap-1 bg-[#060c14] rounded-lg p-1 mb-5">
        {(["manual", "upload"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-md text-[11px] tracking-wide transition-colors ${
              tab === t
                ? "bg-[#111d2e] text-amber-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t === "manual" ? "Manual Entry" : "Upload File"}
          </button>
        ))}
      </div>

      {tab === "manual" && (
        <div className="grid grid-cols-2 gap-3.5">
          {/* Date */}
          <div>
            <label className={labelCls}>Date</label>
            <input
              className={inputCls}
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className={labelCls}>Type</label>
            <select
              className={inputCls}
              value={form.type}
              onChange={(e) => set("type", e.target.value as "debit" | "credit")}
            >
              <option value="debit">Debit (Expense)</option>
              <option value="credit">Credit (Income)</option>
            </select>
          </div>

          {/* Amount + Currency */}
          <div className="col-span-2">
            <label className={labelCls}>Amount</label>
            <div className="flex gap-2">
              <select
                className={`${inputCls} w-24 shrink-0`}
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                className={inputCls}
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <input
              className={inputCls}
              type="text"
              placeholder="e.g. Whole Foods"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="col-span-2">
            <label className={labelCls}>Category</label>
            {showNewCat ? (
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  type="text"
                  placeholder="New category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2.5 rounded-lg bg-amber-400 text-[#060c14] text-[11px] font-medium shrink-0 hover:bg-amber-300 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowNewCat(false)}
                  className="px-3 py-2.5 rounded-lg border border-[#1e293b] text-slate-500 text-[11px] shrink-0 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewCat(true)}
                  className="px-4 py-2.5 rounded-lg bg-[#111d2e] border border-[#1e3052] text-amber-400 text-[11px] shrink-0 hover:bg-[#162236] transition-colors whitespace-nowrap"
                >
                  + New
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label className={labelCls}>Notes</label>
            <textarea
              className={`${inputCls} h-16 resize-none`}
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="col-span-2 py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 transition-colors"
          >
            Add Transaction
          </button>
        </div>
      )}

      {tab === "upload" && (
        <div className="flex flex-col gap-4">
          <div
            className="border-2 border-dashed border-[#1e293b] rounded-xl py-10 px-5 text-center cursor-pointer hover:border-slate-600 transition-colors"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <div className="text-4xl text-slate-700 mb-3">⬆</div>
            <p className="text-[13px] text-slate-400 mb-1">
              {file ? file.name : "Click to select or drop a file"}
            </p>
            <p className="text-[11px] text-slate-600">
              Supports CSV and PDF bank statements
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Uploading…" : "Upload & Parse Statement"}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
