import React, { useState, useEffect } from "react";
import axios from "axios";
import "./customrolemodal.css";

const CustomTeamType = ({ isOpen, onClose }) => {
  const [roleType, setRoleType] = useState({ name: "", description: "", customRoleTypeId: "" });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoleTypes, setAvailableRoleTypes] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const steps = [
    { label: "Name", name: "name", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Role Type", name: "customRoleTypeId", type: "dropdown" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setRoleType({ name: "", description: "", customRoleTypeId: "" });
      setCurrentStep(0);
      setAvailableRoleTypes([]);
      setFetchError(null);
    } else {
      fetchRoleTypes();
    }
  }, [isOpen]);

  const fetchRoleTypes = async (retryCount = 0) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const roleTypesURL = `${baseURL}/customUserManagement/role-types/all`;
      console.log("Fetching role types from:", roleTypesURL);

      const response = await axios.get(roleTypesURL, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Role types API response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.warn("Role types array is empty:", response.data);
          setFetchError("No role types available.");
        } else if (!response.data.every((role) => typeof role.id === "number" && typeof role.name === "string")) {
          console.warn("Invalid role type format:", response.data);
          setFetchError("Invalid role type data format.");
        } else {
          setAvailableRoleTypes(response.data);
          setFetchError(null);
          console.log("Fetched role types:", response.data);
        }
      } else {
        console.warn("Unexpected response format for role types:", response.data);
        setFetchError("Failed to load role types: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching role types:", error.message, error.response);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setFetchError(`Failed to fetch role types: ${errorMessage}`);

      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch role types (${retryCount + 1}/2)...`);
        setTimeout(() => fetchRoleTypes(retryCount + 1), 2000);
      }
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
      const roleData = {
        name: name,
        description: description,
        customRoleTypeId: parseInt(customRoleTypeId, 10),
      };
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const createTeamTypeURL = `${baseURL}/customUserManagement/customTeamType`;
      console.log("Submitting to:", createTeamTypeURL);
      console.log("Request body:", roleData);

      const response = await axios.post(createTeamTypeURL, roleData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Create team type response:", response.data);
      alert("Custom Team Type created successfully!");
      onClose();
    } catch (error) {
      console.error("Request error:", error.response?.data, error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Error: ${error.response?.status || "Unknown"} - ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    console.log("CustomTeamType not rendered due to isOpen false");
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">Create Custom Team Type</h2>
        <div className="stepper-container flex justify-between mb-6 relative">
          {steps.map((step, index) => (
            <div key={step.name} className="relative flex items-center justify-center z-10">
              <div
                className={`step-circle w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                  index < currentStep
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`connector-line absolute h-1 ${index < currentStep ? "bg-blue-500" : "bg-gray-300"}`}
                  style={{
                    left: "50%",
                    width: "100%",
                    transform: "translateX(0%)",
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
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${
                  fetchError ? "border-red-500" : ""
                }`}
                required
                disabled={availableRoleTypes.length === 0}
              >
                <option value="">Select Role Type</option>
                {fetchError ? (
                  <option value="" disabled>
                    {fetchError}
                  </option>
                ) : availableRoleTypes.length === 0 ? (
                  <option value="" disabled>
                    No role types available
                  </option>
                ) : (
                  availableRoleTypes.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              {fetchError && <p className="text-red-500 text-sm mt-1 text-center">{fetchError}</p>}
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
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                disabled={fetchError && steps[currentStep].name === "customRoleTypeId"}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomTeamType;