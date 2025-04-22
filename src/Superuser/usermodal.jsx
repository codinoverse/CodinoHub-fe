import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useNavigate } from "react-router-dom"; // if using react-router for redirection

const UserModal = ({ isOpen, onClose, onCreateUser }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: ""
    });

    const navigate = useNavigate(); // for redirecting to login
    const [createdBy, setCreatedBy] = useState("");

    // Get superuser details from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userDetails"));
        if (storedUser?.username) {
            setCreatedBy(storedUser.username);
        } else {
            alert("Superuser not found. Please log in again.");
            navigate("/login"); // redirect to login
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.firstName && user.lastName && user.username && user.email && createdBy) {
            try {
                const userData = {
                    ...user,
                    createdBy: createdBy,
                    userType: "USER"
                };
                const response = await fetch('http://192.168.1.12:9000/superUser/createSuperuserAndUser', {
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
