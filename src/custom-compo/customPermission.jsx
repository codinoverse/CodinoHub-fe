import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomPermission = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState({ name: "", permissionTypeId: "" });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePermissionTypes, setAvailablePermissionTypes] = useState([]);
  const [isLoadingPermissionTypes, setIsLoadingPermissionTypes] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const steps = [
    { label: "Name", name: "name", type: "text" },
    { label: "Permission Type", name: "permissionTypeId", type: "dropdown" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setPermission({ name: "", permissionTypeId: "" });
      setCurrentStep(0);
      setAvailablePermissionTypes([]);
      setIsLoadingPermissionTypes(false);
      setFetchError(null);
    } else {
      fetchPermissionTypes();
    }
  }, [isOpen]);

  const fetchPermissionTypes = async (retryCount = 0) => {
    setIsLoadingPermissionTypes(true);
    setFetchError(null);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const permissionTypesURL = `${baseURL}/customUserManagement/customPermissionType/all`;
      console.log("Fetching permission types from:", permissionTypesURL);
      console.log("Environment VITE_BASE_URL:", baseURL);

      const response = await axios.get(permissionTypesURL, {
        headers: {
          Accept: "application/json",
        },
      });

      console.log("API response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.warn("Permission types array is empty:", response.data);
          setFetchError("No permission types available.");
        } else if (!response.data.every((type) => typeof type.id === "number" && typeof type.name === "string")) {
          console.warn("Invalid permission type format:", response.data);
          setFetchError("Invalid permission type data format.");
        } else {
          setAvailablePermissionTypes(response.data);
          console.log("Fetched permission types:", response.data);
        }
      } else {
        console.warn("Unexpected response format for permission types:", response.data);
        setFetchError("Failed to load permission types: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching permission types:", error.message, error.response);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setFetchError(`Failed to fetch permission types: ${errorMessage}`);

      // Retry up to 2 times on network errors
      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch (${retryCount + 1}/2)...`);
        setTimeout(() => fetchPermissionTypes(retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingPermissionTypes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPermission((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (permission[steps[currentStep].name]) {
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
    const { name, permissionTypeId } = permission;
    if (!name || !permissionTypeId) {
      alert("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const permissionData = {
        name,
        permissionTypeId: parseInt(permissionTypeId, 10),
      };
      console.log("Submitting permission data:", permissionData);
      const baseURL = import.meta.env.VITE_BASE_URL;
      const createPermissionURL = `${baseURL}/customUserManagement/customPermissions`;

      await axios.post(createPermissionURL, permissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Custom Permission created successfully!");
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
    console.log("CustomPermission not rendered due to isOpen false");
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-center">Create Custom Permission</h2>
        <div className="stepper-container flex justify-between mb-6 relative">
          {steps.map((step, index) => (
            <div key={step.name} className="relative flex items-center justify-center z-10">
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
                  className={`connector-line absolute h-3 ${index < currentStep ? "bg-blue-500" : "bg-gray-300"}`}
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
                name="permissionTypeId"
                value={permission.permissionTypeId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
                disabled={isLoadingPermissionTypes}
              >
                <option value="">Select Permission Type</option>
                {isLoadingPermissionTypes ? (
                  <option value="">Loading...</option>
                ) : fetchError ? (
                  <option value="">{fetchError}</option>
                ) : availablePermissionTypes.length === 0 ? (
                  <option value="">No permission types available</option>
                ) : (
                  availablePermissionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))
                )}
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
                value={permission[steps[currentStep].name]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
                placeholder={`Enter permission ${steps[currentStep].label.toLowerCase()}`}
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
                disabled={isLoadingPermissionTypes}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                disabled={isSubmitting || isLoadingPermissionTypes}
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

export default CustomPermission;