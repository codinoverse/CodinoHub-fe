import React, { useState, useEffect } from "react";
import axios from "axios";
import "./customrolemodal.css";

const AssignCustomUserToCustomTeam = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ userId: "", customTeamTypeId: "" });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTeamTypes, setAvailableTeamTypes] = useState([]);
  const [userFetchError, setUserFetchError] = useState(null);
  const [teamFetchError, setTeamFetchError] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingTeamTypes, setIsLoadingTeamTypes] = useState(false);

  const steps = [
    { label: "User", name: "userId", type: "dropdown" },
    { label: "Team Type", name: "customTeamTypeId", type: "dropdown" },
  ];

  useEffect(() => {
    if (!isOpen) {
      console.log("Modal closed, resetting state");
      setFormData({ userId: "", customTeamTypeId: "" });
      setCurrentStep(0);
      setAvailableUsers([]);
      setAvailableTeamTypes([]);
      setUserFetchError(null);
      setTeamFetchError(null);
      setIsLoadingUsers(false);
      setIsLoadingTeamTypes(false);
    } else {
      console.log("Modal opened, fetching data");
      fetchUsers();
      fetchTeamTypes();
    }
  }, [isOpen]);

  const fetchUsers = async (retryCount = 0) => {
    setIsLoadingUsers(true);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const usersURL = `${baseURL}/user/getAllUsernames`;
      console.log(`Fetching users from: ${usersURL} (Attempt ${retryCount + 1})`);

      const response = await axios.get(usersURL, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Uncomment and set token if authentication is required
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Users API response (raw):", response.data);

      let users = response.data;
      if (!Array.isArray(users) && Array.isArray(users.users)) {
        users = users.users;
        console.log("Extracted nested users array:", users);
      }

      if (Array.isArray(users)) {
        if (users.length === 0) {
          console.warn("Users array is empty:", users);
          setUserFetchError("No users available.");
        } else {
          const normalizedUsers = users.map((user) => ({
            id: Number(user.id),
            name: user.name || user.username || user.fullName || "Unknown User",
          }));
          if (!normalizedUsers.every((user) => typeof user.id === "number" && typeof user.name === "string")) {
            console.warn("Invalid user format after normalization:", normalizedUsers);
            setUserFetchError("Invalid user data format.");
          } else {
            setAvailableUsers(normalizedUsers);
            setUserFetchError(null);
            console.log("Fetched and normalized users:", normalizedUsers);
          }
        }
      } else {
        console.warn("Unexpected response format for users:", response.data);
        setUserFetchError("Failed to load users: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching users:", error.message, error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setUserFetchError(`Failed to fetch users: ${errorMessage}`);

      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch users (${retryCount + 1}/2)...`);
        setTimeout(() => fetchUsers(retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchTeamTypes = async (retryCount = 0) => {
    setIsLoadingTeamTypes(true);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const teamTypesURL = `${baseURL}/customUserManagement/customTeamTypeAll/all`;
      console.log(`Fetching team types from: ${teamTypesURL} (Attempt ${retryCount + 1})`);

      const response = await axios.get(teamTypesURL, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Uncomment and set token if authentication is required
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Team types API response (raw):", response.data);

      let teamTypes = response.data;
      if (!Array.isArray(teamTypes) && Array.isArray(teamTypes.teamTypes)) {
        teamTypes = teamTypes.teamTypes;
        console.log("Extracted nested team types array:", teamTypes);
      }

      if (Array.isArray(teamTypes)) {
        if (teamTypes.length === 0) {
          console.warn("Team types array is empty:", teamTypes);
          setTeamFetchError("No team types available.");
        } else {
          const normalizedTeamTypes = teamTypes.map((team) => ({
            id: Number(team.id),
            name: team.name || team.teamName || "Unknown Team Type",
          }));
          if (!normalizedTeamTypes.every((team) => typeof team.id === "number" && typeof team.name === "string")) {
            console.warn("Invalid team type format after normalization:", normalizedTeamTypes);
            setTeamFetchError("Invalid team type data format.");
          } else {
            setAvailableTeamTypes(normalizedTeamTypes);
            setTeamFetchError(null);
            console.log("Fetched and normalized team types:", normalizedTeamTypes);
          }
        }
      } else {
        console.warn("Unexpected response format for team types:", response.data);
        setTeamFetchError("Failed to load team types: Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching team types:", error.message, error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setTeamFetchError(`Failed to fetch team types: ${errorMessage}`);

      if (retryCount < 2 && (error.code === "ERR_NETWORK" || error.response?.status >= 500)) {
        console.log(`Retrying fetch team types (${retryCount + 1}/2)...`);
        setTimeout(() => fetchTeamTypes(retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingTeamTypes(false);
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
    const { userId, customTeamTypeId } = formData;
    if (!userId || !customTeamTypeId) {
      alert("Both user and team type are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const assignData = {
        userId: parseInt(userId, 10),
        customTeamTypeId: parseInt(customTeamTypeId, 10),
      };
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const assignURL = `${baseURL}/customUserManagement/users/${userId}/teams/${customTeamTypeId}`;
      console.log("Submitting to:", assignURL);
      console.log("Request body:", assignData);

      const response = await axios.post(assignURL, assignData, {
        headers: {
          "Content-Type": "application/json",
          // Uncomment and set token if authentication is required
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Assign user to team response:", response.data);
      alert("User assigned to team successfully!");
      onClose();
    } catch (error) {
      console.error("Request error:", error.response?.data, error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Error: ${error.response?.status || "Unknown"} - ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, calling onClose");
    onClose();
  };

  if (!isOpen) {
    console.log("AssignCustomUserToCustomTeam not rendered due to isOpen false");
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-container bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">Assign User to Team</h2>
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
                  (steps[currentStep].name === "userId" ? userFetchError : teamFetchError) ? "border-red-500" : ""
                }`}
                required
                disabled={
                  steps[currentStep].name === "userId"
                    ? isLoadingUsers || availableUsers.length === 0
                    : isLoadingTeamTypes || availableTeamTypes.length === 0
                }
              >
                <option value="">
                  {steps[currentStep].name === "userId" ? "Select User" : "Select Team Type"}
                </option>
                {steps[currentStep].name === "userId" ? (
                  isLoadingUsers ? (
                    <option value="" disabled>
                      Loading users...
                    </option>
                  ) : userFetchError ? (
                    <option value="" disabled>
                      {userFetchError}
                    </option>
                  ) : availableUsers.length === 0 ? (
                    <option value="" disabled>
                      No users available
                    </option>
                  ) : (
                    availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  )
                ) : isLoadingTeamTypes ? (
                  <option value="" disabled>
                    Loading team types...
                  </option>
                ) : teamFetchError ? (
                  <option value="" disabled>
                    {teamFetchError}
                  </option>
                ) : availableTeamTypes.length === 0 ? (
                  <option value="" disabled>
                    No team types available
                  </option>
                ) : (
                  availableTeamTypes.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))
                )}
              </select>
              {(steps[currentStep].name === "userId" ? userFetchError : teamFetchError) && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {steps[currentStep].name === "userId" ? userFetchError : teamFetchError}
                </p>
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                disabled={
                  steps[currentStep].name === "userId" ? isLoadingUsers || userFetchError : isLoadingTeamTypes || teamFetchError
                }
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Assign"}
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
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

export default AssignCustomUserToCustomTeam;