import { useState, useEffect } from "react";
import axios from "axios";
import "./updateCustomRoleType.css";

const UpdatedCustomRoleType = ({ isOpen, onClose, roleType, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data only when the modal opens or the roleType changes
  useEffect(() => {
    if (isOpen && roleType) {
      setName(roleType.name || "");
      setDescription(roleType.description || "");
    } else if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen, roleType]);

  const steps = [
    { label: "Name", value: name, onChange: setName, required: true },
    { label: "Description", value: description, onChange: setDescription },
  ];

  const handleNext = () => {
    if (steps[currentStep].required && !steps[currentStep].value) {
      alert(`${steps[currentStep].label} is required!`);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const url = roleType
        ? `${baseURL}/customUserManagement/role-types/${roleType.id}`
        : `${baseURL}/customUserManagement/role-types`;
      const method = roleType ? "put" : "post";
      const payload = { id: roleType?.id, name, description };

      await axios[method](url, payload);
      onSave(); // Refresh data
      alert("Role type saved successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving role type:", error);
      alert("Failed to save role type.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!roleType?.id) {
      alert("Role type not selected for deletion.");
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to delete the role type "${roleType.name}"?`
    );
    if (!confirmation) return;

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const url = `${baseURL}/customUserManagement/role-types/${roleType.id}`;

      await axios.delete(url);
      alert("Role type deleted successfully!");
      onSave(); // Refresh data
      onClose();
    } catch (error) {
      console.error("Error deleting role type:", error);
      alert("Failed to delete role type.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {roleType ? "Edit Custom Role Type" : "Create Custom Role Type"}
        </h2>
        <div className="stepper-container flex justify-between mb-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="relative flex items-center justify-center z-10"
            >
              <div
                className={`step-circle w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-green-500 text-white"
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
                  className={`connector-line absolute h-3 ${
                    index < currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  style={{
                    left: "50%",
                    width: "100%",
                    transform: "translateX(0%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-center text-gray-700 font-medium mb-2">
              {steps[currentStep].label.toUpperCase()}
            </label>
            <input
              type="text"
              value={steps[currentStep].value}
              onChange={(e) => steps[currentStep].onChange(e.target.value)}
              className="w-full text-center p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={steps[currentStep].required}
            />
          </div>
          <div className="flex justify-end gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            )}
            {roleType && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatedCustomRoleType;
