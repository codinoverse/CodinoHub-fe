import React, { useState, useEffect } from "react";
import "./superusermodal.css";

const SuperUserModal = ({ isOpen, onClose }) => {
    const [superuser, setSuperUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        companyName: ""
    });

    const [createdBy, setCreatedBy] = useState("");
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { label: "First Name", name: "firstName", type: "text" },
        { label: "Last Name", name: "lastName", type: "text" },
        { label: "Username", name: "username", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Company Name", name: "companyName", type: "text" }
    ];

    useEffect(() => {
        const raw = localStorage.getItem("superuserDetails");

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                const name = parsed?.username || parsed?.user?.username || "";
                setCreatedBy(name);
            } catch (err) {
                console.error("Invalid localStorage format:", err);
                setCreatedBy("");
            }
        } else {
            console.warn("No superuserDetails found in localStorage");
            setCreatedBy("");
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setSuperUser({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                companyName: ""
            });
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuperUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (superuser[steps[currentStep].name] !== "") {
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

        const { firstName, lastName, username, email, companyName } = superuser;

        if (!createdBy) {
            alert("Creator info is missing. Please log in again.");
            return;
        }

        if (firstName && lastName && username && email && companyName) {
            try {
                const superuserData = {
                    ...superuser,
                    createdBy,
                    userType: "SuperUser"
                };

                const response = await fetch("http://192.168.1.12:9000/superUser/createSuperuserAndUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(superuserData),
                });

                if (response.ok) {
                    const text = await response.text();
                    let data = {};

                    if (text) {
                        try {
                            data = JSON.parse(text);
                        } catch (err) {
                            console.error("Failed to parse JSON", err);
                        }
                    }

                    alert(data.message || "SuperUser created successfully!");
                    onClose();
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        } else {
            alert("All fields are required!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0  flex items-center justify-center z-50">
            <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-center">Create Super User</h2>

                {/* Stepper Progress */}
                <div className="stepper-container flex justify-between mb-6 relative">
                    {steps.map((step, index) => (
                        <div key={step.name} className="relative flex items-center justify-center z-10">
                            <div
                                className={`step-circle w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${index < currentStep
                                    ? "bg-green-500 text-white"
                                    : index === currentStep
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-600 border border-gray-300"
                                    }`}
                            >
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
                            {index < steps.length - 1 && (
                                <div
                                    className={`connector-line absolute h-3 ${index < currentStep ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                    style={{
                                        left: "50%",
                                        width: "100%",
                                        transform: "translateX(0%)"
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 d-flex justify-content-center">
                            {steps[currentStep].label.toUpperCase()}
                        </label>
                        <input
                            type={steps[currentStep].type}
                            name={steps[currentStep].name}
                            value={superuser[steps[currentStep].name]}
                            onChange={handleChange}
                            className="w-full text-center p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Navigation Buttons */}
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
                            <button
                                type="button"
                                onClick={handleNext}
                                className="next-btn"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="create-btn"
                            >
                                Create
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuperUserModal;