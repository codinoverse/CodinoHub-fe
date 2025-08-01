import React, { useState, useEffect } from "react";
import axios from "axios";
import './assigndatamodel.css';

const CustomConfiguration = ({ isOpen, onClose, onAssignUser }) => {
    const [assignment, setAssignment] = useState({
        userId: "",
        roleId: "",
    });

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
        } else {
            resetForm();
        }
    }, [isOpen]);

    const fetchDropdownData = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const [usersRes, rolesRes] = await Promise.all([
                axios.get(`${baseURL}/user/getAllUsernames`),
                axios.get(`${baseURL}/customUserManagement/CustomRoleTable/all`),
            ]);

            setUsers(usersRes.data || []);
            setRoles(rolesRes.data || []);
        } catch (err) {
            console.error("Error fetching dropdown data:", err);
        }
    };

    const resetForm = () => {
        setAssignment({
            userId: "",
            roleId: "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAssignment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert userId and roleId to integers
        const userId = parseInt(assignment.userId, 10);
        const customRoleId = parseInt(assignment.roleId, 10);

        if (userId && customRoleId) {
            try {
                const baseURL = import.meta.env.VITE_BASE_URL;

                // Construct the API URL
                const url = `${baseURL}/customUserManagement/users/${userId}/roles/${customRoleId}`;

                console.log("POST Request:", { userId, customRoleId, url });
                await axios.post(url);

                alert("Role assigned successfully.");

                // Notify parent about the assigned user and role
                onAssignUser({ userId, customRoleId });
                onClose();
            } catch (error) {
                console.error("Error assigning role:", error.response || error.message);
                alert(`Failed to assign role: ${error.response?.data?.message || "Server error."}`);
            }
        } else {
            alert("⚠️ Please select both user and role.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="modal-container1" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h5 className="text-center assigndata">Assign Role to User</h5>
                <form onSubmit={handleSubmit} className="assign-form-flex">
                    {/* User Dropdown */}
                    <div className="form-group mx-5">
                        <label>User:</label>
                        <select
                            name="userId"
                            value={assignment.userId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Arrow to Role */}
                    {assignment.userId && (
                        <>
                            <div className="arrow">➡</div>

                            {/* Role Dropdown */}
                            <div className="form-group">
                                <label>Role:</label>
                                <select
                                    name="roleId"
                                    value={assignment.roleId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </form>

                {/* Buttons only after both fields are selected */}
                {assignment.userId && assignment.roleId && (
                    <div className="modal-actions">
                        <button type="button" className="assign" onClick={handleSubmit}>
                            Assign
                        </button>
                        <button type="button" className="cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomConfiguration;
