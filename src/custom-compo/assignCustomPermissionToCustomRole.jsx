import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignCustomPermissionToCustomRole = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ customRoleId: "", customPermissionId: "" });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const steps = [
    { label: "Select Role", name: "customRoleId", type: "dropdown" },
    { label: "Select Permission", name: "customPermissionId", type: "dropdown" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setFormData({ customRoleId: "", customPermissionId: "" });
      setCurrentStep(0);
      setAvailableRoles([]);
      setAvailablePermissions([]);
      setIsLoadingRoles(false);
      setIsLoadingPermissions(false);
      setFetchError(null);
    } else {
      fetchRoles();
      fetchPermissions();
    }
  }, [isOpen]);

  const fetchRoles = async (retryCount = 0) => {
    setIsLoadingRoles(true);
    setFetchError(null);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const rolesURL = `${baseURL}/customUserManagement/CustomRoleTable/all`;
      console.log("Fetching roles from:", rolesURL);

      const response = await axios.get(rolesURL, {
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Roles API response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.warn("Roles array is empty:", response.data);
          setFetchError("No roles available.");
        } else if (!response.data.every((role) => typeof role.id === "number" && typeof role.name === "string")) {
          console.warn("Invalid role format:", response.data);
          setFetchError("Invalid role data format.");
        } else {
          setAvailableRoles(response.data);
          console.log("Fetched roles:", response.data);
        }
      } else {
        console.warn("Unexpected response format for roles:", response.data);
        setFetchError("Failed to load roles: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error.message, error.response);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setFetchError(`Failed to fetch roles: ${errorMessage}`);

      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch roles (${retryCount + 1}/2)...`);
        setTimeout(() => fetchRoles(retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchPermissions = async (retryCount = 0) => {
    setIsLoadingPermissions(true);
    setFetchError(null);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const permissionsURL = `${baseURL}/customUserManagement/customPermissions/all`;
      console.log("Fetching permissions from:", permissionsURL);

      const response = await axios.get(permissionsURL, {
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Permissions API response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.warn("Permissions array is empty:", response.data);
          setFetchError("No permissions available.");
        } else if (!response.data.every((perm) => typeof perm.id === "number" && typeof perm.name === "string")) {
          console.warn("Invalid permission format:", response.data);
          setFetchError("Invalid permission data format.");
        } else {
          setAvailablePermissions(response.data);
          console.log("Fetched permissions:", response.data);
        }
      } else {
        console.warn("Unexpected response format for permissions:", response.data);
        setFetchError("Failed to load permissions: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching permissions:", error.message, error.response);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setFetchError(`Failed to fetch permissions: ${errorMessage}`);

      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch permissions (${retryCount + 1}/2)...`);
        setTimeout(() => fetchPermissions(retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (formData[steps[currentStep].name]) {
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
    const { customRoleId, customPermissionId } = formData;
    if (!customRoleId || !customPermissionId) {
      alert("Both role and permission are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const assignPermissionURL = `${baseURL}/customUserManagement/roles/${customRoleId}/permissions/${customPermissionId}`;
      const requestBody = {
        customRoleId: parseInt(customRoleId, 10),
        customPermissionId: parseInt(customPermissionId, 10),
      };
      console.log("Assigning permission with URL:", assignPermissionURL);
      console.log("Request body:", requestBody);

      const response = await axios.post(assignPermissionURL, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Assign permission response:", response.data);
      alert("Permission assigned to role successfully!");
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
    console.log("AssignCustomPermissionToCustomRole not rendered due to isOpen false");
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Assign Permission to Role</h2>
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
          {steps[currentStep].type === "dropdown" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-center">
                {steps[currentStep].label.toUpperCase()}
              </label>
              <select
                name={steps[currentStep].name}
                value={formData[steps[currentStep].name]}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${
                  fetchError ? "border-red-500" : ""
                }`}
                required
                disabled={currentStep === 0 ? isLoadingRoles : isLoadingPermissions}
              >
                <option value="">
                  {currentStep === 0 ? "Choose a Role" : "Choose a Permission"}
                </option>
                {currentStep === 0 ? (
                  isLoadingRoles ? (
                    <option value="" disabled>
                      Loading roles...
                    </option>
                  ) : fetchError ? (
                    <option value="" disabled>
                      {fetchError}
                    </option>
                  ) : availableRoles.length === 0 ? (
                    <option value="" disabled>
                      No roles available
                    </option>
                  ) : (
                    availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))
                  )
                ) : (
                  isLoadingPermissions ? (
                    <option value="" disabled>
                      Loading permissions...
                    </option>
                  ) : fetchError ? (
                    <option value="" disabled>
                      {fetchError}
                    </option>
                  ) : availablePermissions.length === 0 ? (
                    <option value="" disabled>
                      No permissions available
                    </option>
                  ) : (
                    availablePermissions.map((perm) => (
                      <option key={perm.id} value={perm.id}>
                        {perm.name}
                      </option>
                    ))
                  )
                )}
              </select>
              {fetchError && (
                <p className="text-red-500 text-sm mt-1 text-center">{fetchError}</p>
              )}
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                disabled={currentStep === 0 ? isLoadingRoles : isLoadingPermissions}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50"
                disabled={isSubmitting || isLoadingRoles || isLoadingPermissions}
              >
                {isSubmitting ? "Submitting..." : "Assign"}
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

export default AssignCustomPermissionToCustomRole;