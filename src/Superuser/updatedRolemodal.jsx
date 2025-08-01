import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateRoleModal = ({ isOpen, onClose, user, onSave }) => {
  const [roles, setRoles] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("UpdateRoleModal props:", { isOpen, user });
    if (isOpen && user) {
      fetchRoles();
      fetchRoleTypes();
      setSelectedRole(user?.role || "");
      setSelectedRoleType(user?.roleType || "");
      setError(null);
    }
  }, [isOpen, user]);

  const fetchRoles = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const response = await axios.get(`${baseURL}/getAllRoles`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Uncomment if authentication is required
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("fetchRoles response:", response.data);
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch roles:", error.message, error.response?.data);
      setRoles([]);
      setError("Failed to load roles. Please try again.");
    }
  };

  const fetchRoleTypes = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const response = await axios.get(`${baseURL}/getAllRoleTypes`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("fetchRoleTypes response:", response.data);
      setRoleTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch role types:", error.message, error.response?.data);
      setRoleTypes([]);
      setError("Failed to load role types. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!selectedRole || !selectedRoleType || !user?.id) {
      const errorMessage = "Please select a role, role type, and ensure user data is available.";
      console.error("Save failed:", errorMessage);
      setError(errorMessage);
      return;
    }

    const payload = {
      userId: user.id,
      roleType: selectedRoleType,
      roleName: selectedRole,
    };

    try {
      console.log("Sending payload to backend:", payload);
      const baseURL = import.meta.env.VITE_BASE_URL;
      if (!baseURL) {
        throw new Error("VITE_BASE_URL is not defined in .env");
      }
      const response = await axios.post(`${baseURL}/user/updateRole/${user.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Role updated successfully:", response.data);
      onSave(payload);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to update role.";
      console.error("Failed to update role:", error.response?.data, error.message);
      setError(`Error: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, calling onClose");
    setError(null);
    onClose();
  };

  if (!isOpen || !user) {
    console.warn("UpdateRoleModal not rendering - isOpen:", isOpen, "user:", user);
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "5px",
          minWidth: "300px",
          maxWidth: "500px",
          zIndex: 1001,
        }}
      >
        <h5 style={{ marginBottom: "20px" }}>Update Role for {user.username}</h5>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="roleTypeSelect" style={{ display: "block", marginBottom: "5px" }}>
            Select Role Type:
          </label>
          <select
            id="roleTypeSelect"
            value={selectedRoleType}
            onChange={(e) => {
              setSelectedRoleType(e.target.value);
              setError(null);
            }}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", marginBottom: "10px" }}
          >
            <option value="" disabled>
              Select a Role Type
            </option>
            {roleTypes.length > 0 ? (
              roleTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No role types available
              </option>
            )}
          </select>
          <label htmlFor="roleSelect" style={{ display: "block", marginBottom: "5px" }}>
            Select Role:
          </label>
          <select
            id="roleSelect"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setError(null);
            }}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          >
            <option value="" disabled>
              Select a Role
            </option>
            {roles.length > 0 ? (
              roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No roles available
              </option>
            )}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            style={{
              padding: "8px 16px",
              background: "#ccc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoleModal;