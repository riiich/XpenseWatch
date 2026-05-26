import type { ReactNode } from "react";

interface ModalProps {
	title: string;
	onClose: () => void;
	children: ReactNode;
	maxWidth?: string;
}

export function Modal({ title, onClose, children, maxWidth = "max-w-lg" }: ModalProps) {
	return (
		<div
			className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className={`bg-[#0a1422] border border-[#1e293b] rounded-2xl p-10.5 w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-fade-in`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-center mb-5">
					<span className="font-display text-xl font-semibold text-slate-100">{title}</span>
					<button
						onClick={onClose}
						className="text-slate-500 hover:text-slate-300 text-2xl leading-none px-1 transition-colors"
						aria-label="Close"
					>
						×
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}
