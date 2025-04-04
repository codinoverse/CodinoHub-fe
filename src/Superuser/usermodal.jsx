// UserModal.jsx
import React, { useState } from "react";
import "./UserModal.css"; // External CSS file

const UserModal = ({ isOpen, onClose, onCreateUser }) => {
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        company: "",
        description: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.firstname && user.lastname && user.username && user.email ) {
            onCreateUser(user);
            setUser({ firstname: "", lastname: "", username: "", email: "" });
            onClose();
        } else {
            alert("All fields except description are required!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Create User</h2>
                <form onSubmit={handleSubmit}>
                    <table className="user-form-table">
                        <tbody>
                            <tr>
                                <td><label>First Name:</label></td>
                                <td><input type="text" name="firstname" value={user.firstname} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td><input type="text" name="lastname" value={user.lastname} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Username:</label></td>
                                <td><input type="text" name="username" value={user.username} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Email ID:</label></td>
                                <td><input type="email" name="email" value={user.email} onChange={handleChange} required /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-actions">
                        <button type="submit">Create</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
