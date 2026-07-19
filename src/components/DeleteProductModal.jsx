const DeleteProductModal = ({ isOpen, onClose, onDelete, product }) => {

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[420px]">

                <h2 className="text-2xl font-bold text-red-600">
                    Delete Product
                </h2>

                <p className="mt-4 text-gray-600">
                    Are you sure you want to delete
                    <span className="font-bold">
                        {" "}{product.name}
                    </span>?
                </p>

                <p className="text-sm text-red-500 mt-2">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DeleteProductModal;