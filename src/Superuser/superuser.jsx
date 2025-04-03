import React, { useState } from "react";
import "./superuser.css";
import Navbar from "./sunavbar";
import Sidebar from "./susidebar";
import UserModal from "./usermodal";
import AssignDataModal from "./assigndatamodel"; 
import ProfileModal from "./profilemodal"; 

const SuperUser = () => {
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isAssignDataModalOpen, setAssignDataModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]); // Store assigned users
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false); // Profile modal state

    const handleCreateUser = (user) => {
        setUsers([...users, user]);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleAssignUser = (assignedData) => {
        setAssignedUsers([...assignedUsers, assignedData]); // Store assigned user data
        setAssignDataModalOpen(false); // Close modal after assignment
    };

    return (
        <>
            <Navbar onViewProfile={() => setShowProfileModal(true)} />

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar Component */}
                    <Sidebar
                        onCreateUser={() => setUserModalOpen(true)}
                        onAssignData={() => setAssignDataModalOpen(true)}
                        users={users}
                        onSelectUser={handleSelectUser}
                    />

                    {/* Modals */}
                    <UserModal
                        isOpen={isUserModalOpen}
                        onClose={() => setUserModalOpen(false)}
                        onCreateUser={handleCreateUser}
                    />

                    <AssignDataModal
                        isOpen={isAssignDataModalOpen}
                        onClose={() => setAssignDataModalOpen(false)}
                        users={users}
                        onAssignUser={handleAssignUser}
                    />

                    {/* ✅ Profile Modal Added Here ✅ */}
                    <ProfileModal 
                        show={showProfileModal} 
                        onClose={() => setShowProfileModal(false)} 
                    />

                    {/* Assigned Users Table */}
                    <div className="col-md-9 col-lg-10 p-4">
                        <h2>Assigned Users</h2>
                        {assignedUsers.length > 0 ? (
                            <div className="assigned-table-container">
                                <table className="assigned-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Role Type</th>
                                            <th>Role</th>
                                            <th>Permission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedUsers.map((assigned, index) => (
                                            <tr key={index}>
                                                <td>{assigned.username}</td>
                                                <td>{assigned.roleType}</td>
                                                <td>{assigned.role}</td>
                                                <td>{assigned.permission}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="no-assigned-message">No users assigned yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperUser;
