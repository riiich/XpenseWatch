import { useState } from "react";
import type { Category, Transaction } from "../../types";
import { CURRENCIES } from "../../lib/constants";
import { Modal } from "../ui/Modal";
import { useApp } from "@/context/AppContext";

interface AddTransactionFormProps {
	onClose: () => void;
	categories: Category[];
}

type Tab = "manual" | "fileUpload";

export function AddTransactionForm({ onClose, categories }: AddTransactionFormProps) {
	const [tab, setTab] = useState<Tab>("manual");
	const { selectedAccId, selectedCategoryId, getAccounts, getTransactions } = useApp();

	const [manualForm, setManualForm] = useState({
		transactionDate: new Date().toISOString().split("T")[0],
		amount: 0,
		currency: "USD",
		description: "",
		notes: "",
		accountName: "",
		categoryName: categories[0]?.name ?? "",
		type: "debit" as "debit" | "credit",
		accountId: selectedAccId,
		categoryId: selectedCategoryId,
		isIncome: false,
		isCredit: false,
		isManual: true,
	});
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const set = <K extends keyof typeof manualForm>(key: K, val: (typeof manualForm)[K]) =>
		setManualForm((f) => ({ ...f, [key]: val }));

	const handleManualSubmit = async () => {
		setIsSubmitted(true);

		if (!manualForm.description.trim() || !manualForm.amount) return;

		if (manualForm.categoryId === 0)
			// alert("Select a category!");
			return;

		manualForm.isManual = true;

		const res = await fetch("http://localhost:5095/api/transactions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify(manualForm),
		});

		const data = await res.json();

		if (res.status === 400) alert("there is something wrong");

		// refetch the accounts to get the correct account balance instead of doing the math in the frontend
		await getAccounts();

		// refetch transactions to update any new transaction
		await getTransactions();

		onClose();
	};

	const handleFileUpload = async () => {
		if (!file) return;
		setUploading(true);

		// TODO: replace with real API call to your backend

		await new Promise((r) => setTimeout(r, 1500));
		setUploading(false);
		alert("File uploaded! Your backend will parse and return transactions.");

		onClose();
	};

	const inputCls =
		"w-full px-3 py-2.5 rounded-lg	 bg-[#060c14] text-slate-100 border border-[#1e293b] text-[13px] " +
		"focus:border-amber-400/50 focus:outline-none transition-colors";

	const labelCls = "text-[9px] tracking-[0.14em] text-slate-500 uppercase mb-1.5 block";

	return (
		<Modal title="Add Transaction" onClose={onClose}>
			{/* Tabs */}
			<div className="flex gap-1 bg-[#060c14] rounded-lg p-1 mb-5">
				{(["manual", "fileUpload"] as Tab[]).map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`flex-1 py-2 rounded-md text-[11px] tracking-wide transition-colors ${
							tab === t ? "bg-[#111d2e] text-amber-400" : "text-slate-500 hover:text-slate-300"
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
						<label className={labelCls}>Date *</label>
						<input
							className={inputCls}
							type="date"
							value={manualForm.transactionDate}
							onChange={(e) => set("transactionDate", e.target.value)}
						/>
					</div>

					{/* Type */}
					<div>
						<label className={labelCls}>Type *</label>
						<select
							className={inputCls}
							value={manualForm.type}
							onChange={(e) => (
								set("type", e.target.value as "debit" | "credit"),
								e.target.value === "debit" ? set("isCredit", false) : set("isCredit", true)
							)}
						>
							<option value="debit">Debit</option>
							<option value="credit">Credit</option>
						</select>
					</div>

					{/* Income or Expense */}
					<div>
						<label className={labelCls}>Income or Expense *</label>
						<select
							className={inputCls}
							value={String(manualForm.isIncome)}
							onChange={(e) => set("isIncome", e.target.value === "true")}
						>
							<option value="true">Income (money in)</option>
							<option value="false">Expense (money out)</option>
						</select>
					</div>

					{/* Amount + Currency */}
					<div className="col-span-2">
						<label className={labelCls}>Amount *</label>
						<div className="flex gap-2 w-fit">
							<select
								className={inputCls}
								value={manualForm.currency}
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
								value={manualForm.amount}
								onChange={(e) => set("amount", e.target.valueAsNumber)}
							/>
						</div>
					</div>

					{/* Category */}
					<div className="col-span-2">
						<label className={labelCls}>Category *</label>
						{isSubmitted && manualForm.categoryId === 0 && (
							<p className="text-red-400">A category is required...</p>
						)}
						<div className="flex gap-2">
							<select
								className={inputCls}
								value={manualForm.categoryId}
								onChange={(e) => {
									const selectedCategory = categories.find(
										(c) => c.id === parseInt(e.target.value),
									);
									(set("categoryName", selectedCategory?.name ?? ""),
										set("categoryId", parseInt(e.target.value)));
								}}
							>
								<option
									value={0}
									// hidden
									disabled
								>
									Select a category...
								</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Description */}
					<div className="col-span-2">
						<label className={labelCls}>Description *</label>
						<input
							className={inputCls}
							type="text"
							placeholder="e.g. Whole Foods"
							value={manualForm.description}
							onChange={(e) => set("description", e.target.value)}
						/>
					</div>

					{/* Notes */}
					<div className="col-span-2">
						<label className={labelCls}>Notes</label>
						<textarea
							className={`${inputCls} h-16 resize-none`}
							placeholder="Optional notes..."
							value={manualForm.notes}
							onChange={(e) => set("notes", e.target.value)}
						/>
					</div>

					{/* Submit */}
					<button
						onClick={handleManualSubmit}
						className="col-span-2 py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide hover:bg-amber-300 transition-colors"
					>
						Add Transaction
					</button>
				</div>
			)}

			{tab === "fileUpload" && (
				<div className="flex flex-col gap-4">
					<div
						className="border-2 border-dashed border-[#1e293b] rounded-xl py-10 px-5 text-center cursor-pointer hover:border-slate-600 transition-colors"
						onClick={() => document.getElementById("fileInput")?.click()}
					>
						<div className="text-4xl text-slate-700 mb-3">⬆</div>
						<p className="text-[13px] text-slate-400 mb-1">
							{file ? file.name : "Click to select or drop a file"}
						</p>
						<p className="text-[11px] text-slate-600">Supports CSV and PDF bank statements</p>
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
							onClick={handleFileUpload}
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
