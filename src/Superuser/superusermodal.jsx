import React, { useState, useEffect } from "react";
import "./superusermodal.css";

const SuperUserModal = ({ isOpen, onClose }) => {
    const [superuser, setSuperUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        companyName: ""
    });

    const [createdBy, setCreatedBy] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem("superuserDetails");

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                const name = parsed?.username || parsed?.user?.username || "";
                setCreatedBy(name);
            } catch (err) {
                console.error("Invalid localStorage format:", err);
                setCreatedBy("");
            }
        } else {
            console.warn("No superuserDetails found in localStorage");
            setCreatedBy("");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuperUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, username, email, companyName } = superuser;

        if (!createdBy) {
            alert("Creator info is missing. Please log in again.");
            return;
        }

        if (firstName && lastName && username && email && companyName) {
            try {
                const superuserData = {
                    ...superuser,
                    createdBy,
                    userType: "SuperUser"
                };

                const response = await fetch("http://192.168.1.12:9000/superUser/createSuperuserAndUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(superuserData),
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

                    alert(data.message || "SuperUser created successfully!");

                    setSuperUser({
                        firstName: '',
                        lastName: '',
                        username: '',
                        email: '',
                        companyName: ''
                    });

                    onClose();
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        } else {
            alert("All fields except description are required!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Create Super User</h2>
                <form onSubmit={handleSubmit}>
                    <table className="user-form-table">
                        <tbody>
                            <tr>
                                <td><label>First Name:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={superuser.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={superuser.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Username:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="username"
                                        value={superuser.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Email ID:</label></td>
                                <td>
                                    <input
                                        type="email"
                                        name="email"
                                        value={superuser.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Company Name:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={superuser.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
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

export default SuperUserModal;