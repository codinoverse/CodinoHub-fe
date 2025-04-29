import React, { useEffect, useState } from "react";
import axios from "axios";
import "./updatedRolemodal.css";

const UpdateRoleModal = ({ isOpen, onClose, user, onSave }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");


    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            setSelectedRole(user?.role || "");
        }
    }, [isOpen, user]);


    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://192.168.1.12:9000/getAllRoles");
            setRoles(response.data);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };


    const handleSave = async () => {
        if (!selectedRole || !user) {
            console.error("Save failed: No selected role or user data.");
            return;
        }

        const payload = {
            userId: user.id,
            roleType: user.roleType,
            roleName: selectedRole,
        };

        try {
            console.log("Sending payload to backend:", payload);

            const response = await axios.post(
                "http://192.168.1.12:9000/user/assignRoleType/role",
                payload
            );

            console.log("Role updated successfully:", response.data);

            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to update role:", error.response?.data || error.message);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="update-role-modal-backdrop show">
            <div className="update-role-modal">
                <div className="update-role-modal-content">
                    <h5 className="update-role-modal-title">Update Role for {user.username}</h5>

                    <div className="update-role-form-group">
                        <label htmlFor="roleSelect">Select New Role:</label>
                        <select
                            id="roleSelect"
                            className="update-role-form-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="" disabled>
                                Select a Role
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="update-role-modal-actions">
                        <button
                            className="update-role-btn update-role-btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="update-role-btn update-role-btn-primary"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoleModal;
