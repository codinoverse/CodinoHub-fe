import React, { useState, useEffect } from "react";
import './assigndatamodel.css';

const AssignDataModal = ({ isOpen, onClose, users, onAssignUser }) => {
    const [assignment, setAssignment] = useState({
        username: "",
        roleType: "Developer",
        role: "BE"
    });

    useEffect(() => {
        if (!isOpen) {
            setAssignment({
                username: "",
                roleType: "Developer",
                role: "BE"
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (assignment.username) {
            onAssignUser(assignment);
            onClose();
        } else {
            alert("Please select a user!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Assign Data</h2>
                <form onSubmit={handleSubmit}>
                    <table className="assign-form-table">
                        <tbody>
                            <tr>
                                <td><label>User:</label></td>
                                <td>
                                    <select name="username" value={assignment.username} onChange={handleChange} required>
                                        <option value="">Select User</option>
                                        {users.map((user, index) => (
                                            <option key={index} value={user.username}>{user.username}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Role Type:</label></td>
                                <td>
                                    <select name="roleType" value={assignment.roleType} onChange={handleChange}>
                                        <option value="Developer">Developer</option>
                                        <option value="QA">QA</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="Data">Data</option>
                                        <option value="Security">Security</option>
                                        <option value="Product">Product</option>
                                        <option value="AI Expert">AI Expert</option>
                                        <option value="Custom Team">Custom Team</option>
                                        <option value="NEWBEE/INTERN">NEWBEE/INTERN</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Role:</label></td>
                                <td>
                                    <select name="role" value={assignment.role} onChange={handleChange}>
                                        <option value="BE">BE</option>
                                        <option value="FE">FE</option>
                                        <option value="Tester">Tester</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-actions">
                        <button type="submit">Assign User</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignDataModal;
