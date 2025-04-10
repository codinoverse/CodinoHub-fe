import React, { useState } from "react";
import "./superuser.css";
import Navbar from "./sunavbar";
import Sidebar from "./susidebar";
import UserModal from "./usermodal";
import AssignDataModal from "./assigndatamodel";
import ProfileModal from "./profilemodal";
import SuperUserModal from "./superusermodal";

const SuperUser = () => {
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isSuperUserModalOpen, setSuperUserModalOpen] = useState(false);

    const [isAssignDataModalOpen, setAssignDataModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [superusers, setsuperUsers] = useState([]);

    const [assignedUsers, setAssignedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSuperUser, setSelectedSuperUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [assignedUsersByRoleType, setAssignedUsersByRoleType] = useState({});


    const handleCreateSuperUser = (superuser) => {
        setsuperUsers([...superusers, superuser]);
    };


    const handleSelectSuperUser = (superuser) => {
        setsuperUsers([...superusers, superUser])
    }


    const handleCreateUser = (user) => {
        setUsers([...users, user]);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleAssignUser = (assignment) => {
        // Update assigned users by role type (for Sidebar)
        setAssignedUsersByRoleType((prev) => {
            const updated = { ...prev };
            if (!updated[assignment.roleType]) {
                updated[assignment.roleType] = [];
            }

            const isAlreadyAssigned = updated[assignment.roleType].some(
                (user) => user.username === assignment.username
            );

            if (!isAlreadyAssigned) {
                updated[assignment.roleType].push({
                    username: assignment.username,
                    role: assignment.role,
                    permission: assignment.permission
                });
            }

            return updated;
        });

        // Update general assigned users list (for Assigned Users Table)
        setAssignedUsers((prev) => {
            const exists = prev.some(
                (u) => u.username === assignment.username && u.roleType === assignment.roleType
            );

            if (!exists) {
                return [...prev, assignment];
            }

            return prev;
        });
    };

    return (
        <>
            <Navbar onViewProfile={() => setShowProfileModal(true)} />

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar Component */}
                    <Sidebar
                        onCreateUser={() => setUserModalOpen(true)}
                        onCreateSuperUser={() => setSuperUserModalOpen(true)}
                        onAssignData={() => setAssignDataModalOpen(true)}
                        users={users}
                        superusers={superusers}
                        onSelectSuperUser={handleSelectSuperUser}
                        onSelectUser={handleSelectUser}
                        assignedUsersByRoleType={assignedUsersByRoleType}
                    />

                    {/* Modals */}
                    <UserModal
                        isOpen={isUserModalOpen}
                        onClose={() => setUserModalOpen(false)}
                        onCreateUser={handleCreateUser}
                    />
                    
                     <SuperUserModal
                        isOpen={isSuperUserModalOpen}
                        onClose={() => setSuperUserModalOpen(false)}
                        onCreateSuperUser={handleCreateSuperUser}
                    />

                    <AssignDataModal
                        isOpen={isAssignDataModalOpen}
                        onClose={() => setAssignDataModalOpen(false)}
                        users={users}
                        onAssignUser={handleAssignUser}
                    />

                    {/* Profile Modal */}
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedUsers.map((assigned, index) => (
                                            <tr key={index}>
                                                <td>{assigned.username}</td>
                                                <td>{assigned.roleType}</td>
                                                <td>{assigned.role}</td>
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
