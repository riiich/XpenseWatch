type ImageReceiptModalProps = {
    isOpen: boolean;
    imageUrl: string | null;
    hasReceipt: boolean;
    isLoading?: boolean;
    error?: string | null;
    onClose: () => void;
    onUpload: (file: File) => void;
    onReplace: (file: File) => void;
    onDelete: () => void;
};

export default function ImageReceiptModal({
    isOpen,
    imageUrl,
    hasReceipt,
    isLoading = false,
    error = null,
    onClose,
    onUpload,
    onReplace,
    onDelete,
}: ImageReceiptModalProps) {
    if (!isOpen) return null;

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        action: "upload" | "replace",
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (action === "upload") onUpload(file);
        else onReplace(file);

        event.target.value = "";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-2 top-2 rounded px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                    ✕
                </button>

                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Receipt
                </h2>

                {isLoading && (
                    <div className="p-8 text-center text-gray-600">
                        Loading receipt...
                    </div>
                )}

                {!isLoading && error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!isLoading && !hasReceipt && (
                    <div className="rounded border border-dashed border-gray-300 p-8 text-center">
                        <p className="mb-4 text-gray-600">
                            No receipt has been uploaded for this transaction.
                        </p>

                        <label className="inline-flex cursor-pointer items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Upload Receipt
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                className="hidden"
                                onChange={(event) =>
                                    handleFileChange(event, "upload")
                                }
                            />
                        </label>
                    </div>
                )}

                {!isLoading && hasReceipt && (
                    <div className="space-y-4">
                        <div className="flex max-h-[70vh] items-center justify-center overflow-auto rounded border bg-gray-50 p-4">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Receipt preview"
                                    className="max-h-[65vh] max-w-full rounded object-contain"
                                />
                            ) : (
                                <p className="text-gray-600">
                                    Receipt preview unavailable.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <label className="cursor-pointer rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                                Replace Receipt
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                    className="hidden"
                                    onChange={(event) =>
                                        handleFileChange(event, "replace")
                                    }
                                />
                            </label>

                            <button
                                type="button"
                                onClick={onDelete}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Delete Receipt
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
