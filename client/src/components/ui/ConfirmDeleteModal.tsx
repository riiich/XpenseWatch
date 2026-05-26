import { Modal } from "./Modal";

interface ConfirmDeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;
    transactionDescription: string;
}

export function ConfirmDeleteModal({ onClose, onConfirm, transactionDescription }: ConfirmDeleteModalProps) {
    return (
        <Modal title="Delete Transaction" onClose={onClose} maxWidth="max-w-sm">
            <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete{" "}
                <span className="text-slate-100 font-medium">"{transactionDescription}"</span>?
                This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg border border-[#1e293b] text-slate-400 text-[12px] tracking-wide hover:text-slate-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[12px] tracking-wide hover:bg-rose-500/20 transition-colors"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}