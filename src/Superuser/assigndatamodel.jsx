import React, { useState, useEffect } from "react";
import axios from "axios";
import './assigndatamodel.css';

const AssignDataModal = ({ isOpen, onClose, onAssignUser }) => {
    const [assignment, setAssignment] = useState({
        userId: 0,
        selectedUsername: "",
        roleType: "",
        role: ""
    });

    const [users, setUsers] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
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
            const [usersRes, roleTypesRes, rolesRes] = await Promise.all([
                axios.get(`${baseURL}/user/getAllUsernames`),
                axios.get(`${baseURL}/getAllRoleTypes`),
                axios.get(`${baseURL}/getAllRoles`)
            ]);

            setUsers(usersRes.data || []);
            setRoleTypes(roleTypesRes.data || []);
            setRoles(rolesRes.data || []);
        } catch (err) {
            console.error(" Error fetching dropdown data:", err);
        }
    };

    const resetForm = () => {
        setAssignment({
            userId: 0,
            selectedUsername: "",
            roleType: "",
            role: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "username") {
            const selectedUser = users.find((u) => u.username === value);
            setAssignment({
                selectedUsername: value,
                userId: selectedUser?.id || 0,
                roleType: "",
                role: ""
            });
        } else if (name === "roleType") {
            setAssignment((prev) => ({
                ...prev,
                roleType: value,
                role: ""
            }));
        } else {
            setAssignment((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, roleType, role, selectedUsername } = assignment;

        if (userId && roleType && role) {
            const payload = {
                userId,
                roleType: roleType.toUpperCase(),
                roleName: role.toUpperCase()
            };

            try {
                const baseURL = import.meta.env.VITE_BASE_URL;
                await axios.post(`${baseURL}/user/assignRoleType/role`, payload);
                alert("Role assigned successfully.");

                onAssignUser({
                    ...payload,
                    username: selectedUsername
                });

                onClose();
            } catch (error) {
                console.error("Error assigning role:", error);
                alert("Failed to assign role: Server error.");
            }
        } else {
            alert("⚠️ Please fill all fields.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="modal-container1" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h5 className="text-center assigndata">Assign Data</h5>
                <form onSubmit={handleSubmit} className="assign-form-flex">
                    {/* User Dropdown */}
                    <div className="form-group mx-5">
                        <label>User:</label>
                        <select
                            name="username"
                            value={assignment.selectedUsername}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Arrow to Role Type */}
                    {assignment.selectedUsername && (
                        <>
                            <div className="arrow">➡</div>

                            {/* Role Type Dropdown */}
                            <div className="form-group">
                                <label>Role Type:</label>
                                <select
                                    name="roleType"
                                    value={assignment.roleType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Role Type</option>
                                    {roleTypes.map((rt) => (
                                        <option key={rt.id} value={rt.name}>{rt.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Arrow to Role */}
                    {assignment.roleType && (
                        <>
                            <div className="arrow">➡</div>

                            {/* Role Dropdown */}
                            <div className="form-group">
                                <label>Role:</label>
                                <select
                                    name="role"
                                    value={assignment.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </form>

                {/* Buttons only after role is selected */}
                {assignment.role && (
                    <div className="modal-actions">
                        <button className="assign" onClick={handleSubmit}>Assign</button>
                        <button className="cancel" onClick={onClose}>Cancel</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AssignDataModal;
