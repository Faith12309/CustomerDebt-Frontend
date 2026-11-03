import { AlertTriangle } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, onDelete, user }) => {

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-user-title"
                className="bg-white rounded-card shadow-pop border border-surface-line p-6 w-full max-w-[420px]"
            >

                <div className="flex items-start gap-4">

                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-red-600" />
                    </div>

                    <div>

                        <h2
                            id="delete-user-title"
                            className="text-lg font-bold tracking-tight text-slate-900"
                        >
                            Delete user
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete
                            <span className="font-semibold text-slate-900">
                                {" "}{user.username}
                            </span>?
                        </p>

                        <p className="text-sm text-red-600 mt-2">
                            This action cannot be undone.
                        </p>

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-control border border-surface-line bg-white text-sm font-medium text-slate-700 hover:bg-surface-muted transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="px-4 py-2.5 rounded-control bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition-colors"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DeleteUserModal;