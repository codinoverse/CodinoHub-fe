import React, { useState } from "react";
import "./superusermodal.css";

const SuperUserModal = ({ isOpen, onClose, onCreateSuperUser }) => {
    const [superuser, setsuperUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        companyname: ""
    });

    const handleChange = (e) => {
        setsuperUser({ ...superuser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (superuser.firstname && superuser.lastname && superuser.username && superuser.email && superuser.companyname) {
            onCreateSuperUser(superuser);
            setsuperUser({ firstname: "", lastname: "", username: "", email: "", companyname: "" });
            onClose();
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
                                <td><input type="text" name="firstname" value={superuser.firstname} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td><input type="text" name="lastname" value={superuser.lastname} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Username:</label></td>
                                <td><input type="text" name="username" value={superuser.username} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Email ID:</label></td>
                                <td><input type="email" name="email" value={superuser.email} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Company Name:</label></td>
                                <td><input type="text" name="companyname" value={superuser.companyname} onChange={handleChange} required /></td>
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
