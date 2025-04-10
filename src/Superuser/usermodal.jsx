import React, { useState } from "react";
import "./UserModal.css";

const UserModal = ({ isOpen, onClose, onCreateUser }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: ""
    });

    const createdBy = JSON.parse(localStorage.getItem('userDetails'))?.username || '';

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.firstName && user.lastName && user.username && user.email && createdBy) {
            try {
                const userData = {
                    ...user,
                    createdBy: createdBy
                };
                const response = await fetch('http://192.168.1.17:9000/user/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
                    const text = await response.text();
                    let data = {};

                    if (text) {
                        try {
                            data = JSON.parse(text);
                        } catch (err) {
                            console.error("Failed to parse JSON", err);
                        }
                    }
                    alert(data.message || "User created successfully!");
                    setUser({
                        firstName: "",
                        lastName: "",
                        username: "",
                        email: ""
                    });

                    onClose();
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        } else {
            alert('All fields are required!');
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
                                <td><input type="text" name="firstName" value={user.firstName} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td><input type="text" name="lastName" value={user.lastName} onChange={handleChange} required /></td>
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
