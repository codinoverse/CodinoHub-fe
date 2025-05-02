import React, { useState, useEffect } from "react";
import profileimg from "../assets/profile.png";

const ProfileModal = ({ show, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        company: ""
    });

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        if (userDetails) {
            setProfileData({
                name: userDetails.username || "Not available",
                email: userDetails.email || "Not available",
                company: userDetails.companyName || "Not available"
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false); // Exit edit mode after saving
        localStorage.setItem("userDetails", JSON.stringify(profileData)); // Save the updated details in localStorage
    };

    if (!show) return null; // If not visible, return nothing

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Profile Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <img src={profileimg} className="rounded-circle mb-3" style={{ width: "80px", height: "80px" }} alt="Profile" />

                        {/* Name */}
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="name" 
                                value={profileData.name} 
                                onChange={handleChange} 
                                className="form-control mb-2"
                            />
                        ) : (
                            <h5 className="mb-1">{profileData.name}</h5>
                        )}

                        {/* Email */}
                        {isEditing ? (
                            <input 
                                type="email" 
                                name="email" 
                                value={profileData.email} 
                                onChange={handleChange} 
                                className="form-control mb-2"
                            />
                        ) : (
                            <p className="text-muted">{profileData.email}</p>
                        )}

                        {/* Company */}
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="company" 
                                value={profileData.company} 
                                onChange={handleChange} 
                                className="form-control mb-2"
                            />
                        ) : (
                            <p className="text-muted">{profileData.company}</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        {isEditing ? (
                            <button className="btn btn-success" onClick={handleSave}>Save</button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Modify</button>
                        )}
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
