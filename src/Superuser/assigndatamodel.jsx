import React, { useState, useEffect } from "react";
import axios from "axios";
import './assigndatamodel.css';

const AssignDataModal = ({ isOpen, onClose, onAssignUser, users: superUserUsers }) => {
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
            const [usersRes, roleTypesRes, rolesRes] = await Promise.all([
                axios.get("http://192.168.1.12:9000/user/getAllUsernames"),
                axios.get("http://192.168.1.12:9000/getAllRoleTypes"),
                axios.get("http://192.168.1.12:9000/getAllRoles")
            ]);

            const usersData = usersRes.data || [];
            setUsers(usersData);
            setRoleTypes(roleTypesRes.data || []);
            setRoles(rolesRes.data || []);

            if (usersData.length) {
                setAssignment((prev) => ({
                    ...prev,
                    selectedUsername: usersData[0].username,
                    userId: usersData[0].id
                }));
            }
        } catch (err) {
            console.error("❌ Error fetching dropdown data:", err);
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
                ...assignment,
                selectedUsername: value,
                userId: selectedUser?.id || 0
            });
        } else {
            setAssignment({ ...assignment, [name]: value });
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
                await axios.post("http://192.168.1.12:9000/user/assignRoleType/role", payload);
                alert("✅ Role assigned successfully.");

                // Update SuperUser assignedUsers table
                onAssignUser({
                    ...payload,
                    username: selectedUsername
                });

                onClose();
            } catch (error) {
                console.error("❌ Error assigning role:", error);
                alert("❌ Failed to assign role: Server error.");
            }
        } else {
            alert("⚠️ Please fill all fields.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Assign Role</h2>
                <form onSubmit={handleSubmit}>
                    <table className="assign-form-table">
                        <tbody>
                            <tr>
                                <td><label>User:</label></td>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <td><label>Role Type:</label></td>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <td><label>Role:</label></td>
                                <td>
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-actions">
                        <button type="submit">Assign</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignDataModal;
