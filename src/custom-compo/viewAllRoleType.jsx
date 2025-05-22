import { useState, useEffect } from "react";
import axios from "axios";

const ViewAllRoleTypeModal = ({ isOpen, onClose }) => {
    const [roleTypes, setRoleTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchRoleTypes();
        }
    }, [isOpen]);

    const fetchRoleTypes = async () => {
        setIsLoading(true);
        setError("");

        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const response = await axios.get(`${baseURL}/customUsermanagement/roletype`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setRoleTypes(response.data || []);
        } catch (err) {
            console.error("Error fetching role types:", err.message);
            setError("Failed to load role types. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="modal-container bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">View All Role Types</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✕
                    </button>
                </div>
                {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                ) : roleTypes.length === 0 ? (
                    <div className="text-center py-4">No role types found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="border border-gray-300 p-2">ID</th>
                                    <th className="border border-gray-300 p-2">Name</th>
                                    <th className="border border-gray-300 p-2">Description</th>
                                    <th className="border border-gray-300 p-2">Created At</th>
                                    <th className="border border-gray-300 p-2">Created By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roleTypes.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-2">{role.id}</td>
                                        <td className="border border-gray-300 p-2">{role.name}</td>
                                        <td className="border border-gray-300 p-2">{role.description}</td>
                                        <td className="border border-gray-300 p-2">
                                            {new Date(role.createdAt).toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 p-2">{role.createdBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="modal-footer flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAllRoleTypeModal;
