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

    const createdBy = JSON.parse(localStorage.getItem('superuserDetails'))?.username || '';

    const handleChange = (e) => {
        setsuperUser({ ...superuser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (superuser.firstname && superuser.lastname && superuser.username && superuser.email && superuser.companyname && createdBy) {
            try {
                const superuserData = {
                    ...superuser,
                    createdBy:createdBy
                };
                const response = await fetch("http://192.168.1.17:9000/superUser/createSuperUser", {
                    method:"POST",
                    headers: {
                        "Content-Type" : 'application/json',
                    },
                    body:JSON.stringify(superuserData),
                });
                if (response.ok) {
                    const text = await response.text();
                    let data = {};

                    if (text) {
                        try {
                            data = JSON.parse(text);
                        }catch(err) {
                            console.error("Failed to parse JSON", err);
                        }
                    }
                    alert(data.message  || "SuperUser created successfuly!");
                    setsuperUser({
                        firstName:'',
                        lastName:'',
                        username:'',
                        email:'',
                        companyName:''
                    });
                    onclose();
                }else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            }catch (error) {
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
                                <td><input type="text" name="firstNme" value={superuser.firstName} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td><input type="text" name="lastName" value={superuser.lastName} onChange={handleChange} required /></td>
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
                                <td><input type="text" name="companyName" value={superuser.companyName} onChange={handleChange} required /></td>
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
