import type { Transaction } from "../../types";
import { fmt, shortDate } from "../../lib/utils";
import { useState } from "react";
import ImageReceiptModal from "./ImageReceiptModal";

interface TransactionRowProps {
	transaction: Transaction;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;
}

export function TransactionRow({ transaction, onDelete, onEdit }: TransactionRowProps) {
	const isCredit = transaction.type === "credit";
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isReceiptLoading, setIsReceiptLoading] = useState(false);
	const [receiptError, setReceiptError] = useState<string | null>(null);
	const [hasReceipt, setHasReceipt] = useState<boolean | null>(null);

	const getReceipt = async () => {
		setIsImageModalOpen(true);
		setReceiptError(null);
		setImageUrl(null);

		try {
			setIsReceiptLoading(true);

			const res = await fetch(`http://localhost:5095/api/s3/receipts/${transaction.id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (res.status === 404) {
				console.log("Failed to retrieve receipt:", res.statusText);

				setHasReceipt(false);
				setImageUrl(null);
				return;
			}

			if (!res.ok) {
				throw new Error("Failed to get receipt...");
			}

			const data = await res.json();

			setHasReceipt(Boolean(data.presignedUrl));
			setImageUrl(data.presignedUrl ?? null);
		} catch (e) {
			setReceiptError("Could not load receipt...");
			setImageUrl(null);
			console.log(e);
		} finally {
			setIsReceiptLoading(false);
		}
	};

	const uploadReceipt = async (file: File) => {
		console.log("File to upload: ", file);

		const formData = new FormData();
		formData.append("receiptImage", file);
		formData.append("transactionId", transaction.id.toString());

		try {
			const res = await fetch("http://localhost:5095/api/s3/receipts", {
				method: "POST",
				headers: {
					Authorization: `bearer ${localStorage.getItem("token")}`,
				},
				body: formData,
			});

			if (!res.ok) {
				console.log("There was an error uploading: ", res.statusText);
				throw new Error("Upload failed!");
			}

			const data = await res.json();

			console.log("Uploaded receipt image: ", data);

			await getReceipt();
		} catch (e) {
			console.error("Upload failed...", e);
		}
	};

	// ** WORK ON **
	const replaceReceipt = (file: File) => {
		console.log("File to replace: ", file);

		// call api
	};

	// ** WORK ON **
	const deleteReceipt = () => {
		console.log("File deleted!");

		// call api
	};

	return (
		<div className="flex items-center gap-10 px-3 py-3 rounded-lg border-b border-[#0f172a] hover:bg-[#0a1422] transition-colors group">
			<span className="text-[12px] text-slate-500 w-22 shrink-0">
				{shortDate(transaction.transactionDate)}
			</span>

			<div className="w-1.5 h-1.5 rounded-full shrink-0" />

			<div className="flex flex-col gap-2 flex-1 min-w-0">
				<span className="text-[12px] text-slate-200 truncate">{transaction.description}</span>
				{transaction.notes && (
					<span className="text-[11px] text-slate-500 truncate">{transaction.notes}</span>
				)}
			</div>

			<div className="border-2 p-2">
				<button onClick={getReceipt}>Receipt</button>
			</div>

			<span className="text-[12px] text-slate-500 tracking-wide w-1/7 shrink-0 sm:block">
				{transaction.categoryName}
			</span>

			<span
				className={`text-[14px] font-medium tracking-wide w-28 text-right shrink-0 ${
					isCredit ? "text-emerald-400" : "text-slate-100"
				}`}
			>
				{transaction.isIncome ? (
					<span className="text-emerald-400">+{fmt(transaction.amount, transaction.currency)}</span>
				) : (
					<span className="text-red-400">-{fmt(transaction.amount, transaction.currency)}</span>
				)}
			</span>

			<button onClick={() => onEdit(transaction.id)}>Edit</button>

			<button
				onClick={() => onDelete(transaction.id)}
				className="text-red-400 text-xl hover:text-2xl leading-none w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label="Delete transaction"
			>
				🗑️
			</button>

			<div className="justify-center align-middle">
				<ImageReceiptModal
					isOpen={isImageModalOpen}
					imageUrl={imageUrl}
					hasReceipt={hasReceipt === true}
					isLoading={isReceiptLoading}
					error={receiptError}
					onClose={() => setIsImageModalOpen(false)}
					onUpload={uploadReceipt}
					onReplace={replaceReceipt}
					onDelete={deleteReceipt}
				/>
			</div>
		</div>
	);
}
