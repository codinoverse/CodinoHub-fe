import React, { useState, useEffect } from "react";
import axios from "axios";
import "./customrolemodal.css"

const CustomRoleModal = ({ isOpen, onClose }) => {
    const [roleType, setRoleType] = useState({ name: "", description: "", customRoleTypeId: "" });
    // const [createdBy, setCreatedBy] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableRoleTypes, setAvailableRoleTypes] = useState([]);
    const [viewAll, setViewAll] = useState(false);
    const [customRoleTypes, setCustomRoleTypes] = useState([]);

    const steps = [
        { label: "Name", name: "name", type: "text" },
        { label: "Description", name: "description", type: "text" },
        { label: "Role Type", name: "customRoleTypeId", type: "dropdown" },
    ];

    // useEffect(() => {
    //     const raw = localStorage.getItem("userDetails");
    //     if (raw) {
    //         try {
    //             const parsed = JSON.parse(raw);
    //             const name = parsed?.username || parsed?.user?.username || "";
    //             setCreatedBy(name);
    //         } catch (err) {
    //             console.error("Invalid localStorage format:", err);
    //             setCreatedBy("");
    //         }
    //     } else {
    //         setCreatedBy("");
    //     }
    // }, []);

    useEffect(() => {
        if (!isOpen) {
            setRoleType({ name: "", description: "", roleTypeId: "" });
            setCurrentStep(0);
            setViewAll(false);
        } else {
            fetchRoleTypes();
        }
    }, [isOpen]);

    const fetchRoleTypes = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const roleTypesURL = `${baseURL}/customUserManagement/role-types/all`;
            const response = await axios.get(roleTypesURL, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setAvailableRoleTypes(response.data || []);
        } catch (error) {
            console.error("Error fetching role types:", error.message);
            alert("Failed to fetch role types.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoleType((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (roleType[steps[currentStep].name]) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            alert(`${steps[currentStep].label} is required!`);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, customRoleTypeId } = roleType;
        if (!name || !description || !customRoleTypeId) {
            alert("All fields are required!");
            return;
        }

        setIsSubmitting(true);

        try {
            const roleData = { name, description, customRoleTypeId: parseInt(customRoleTypeId, 10) };
            const baseURL = import.meta.env.VITE_BASE_URL;
            const createRoleURL = `${baseURL}/customUserManagement/customRoleCreate`;

            await axios.post(createRoleURL, roleData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert("Custom Role created successfully!");
            onClose();
        } catch (error) {
            console.error("Request error:", error.response?.data, error.message);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Error: ${error.response?.status || "Unknown"} - ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewAll = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const customRoleTypeURL = `${baseURL}/customUserManagement/role-types`;

            const response = await axios.get(customRoleTypeURL, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setCustomRoleTypes(response.data || []);
            setViewAll(true);
        } catch (error) {
            console.error("Error fetching custom role types:", error.message);
            alert("Failed to fetch custom role types.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-center">Create Custom Role</h2>
                {!viewAll ? (
                    <>
                        <div className="stepper-container flex justify-between mb-6 relative">
                            {steps.map((step, index) => (
                                <div key={step.name} className="relative flex items-center justify-center z-10">
                                    <div className={`step-circle w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${index < currentStep ? "bg-green-500 text-white" : index === currentStep ? "bg-green-500 text-white" : "bg-white text-gray-600 border border-gray-300"}`}>
                                        {index < currentStep ? (
                                            <svg
                                                className="w-6 h-6 checkmark"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`connector-line absolute h-3 ${index < currentStep ? "bg-blue-500" : "bg-gray-300"}`}
                                            style={{
                                                left: "50%",
                                                width: "100%",
                                                transform: "translateX(0%)"
                                            }}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>
                            {steps[currentStep].type === "dropdown" ? (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2 text-center">
                                        {steps[currentStep].label.toUpperCase()}
                                    </label>
                                    <select
                                        name="customRoleTypeId"
                                        value={roleType.customRoleTypeId}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        required
                                    >
                                        <option value="">Select Role Type</option>
                                        {availableRoleTypes.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2 text-center">
                                        {steps[currentStep].label.toUpperCase()}
                                    </label>
                                    <input
                                        type={steps[currentStep].type}
                                        name={steps[currentStep].name}
                                        value={roleType[steps[currentStep].name]}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        required
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-4">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Back
                                    </button>
                                )}
                                {currentStep < steps.length - 1 ? (
                                    <button type="button" onClick={handleNext} className="nextbtn">
                                        Next
                                    </button>
                                ) : (
                                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Create"}
                                    </button>
                                )}
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div>
                        <h3 className="text-center mb-4">All Custom Role Types</h3>
                        <ul className="list-disc pl-5">
                            {customRoleTypes.map((type) => (
                                <li key={type.id}>
                                    <strong>{type.name}</strong>: {type.description}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setViewAll(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                            Back to Form
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomRoleModal;
