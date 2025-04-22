import React, { useState } from "react";
import "./superuser.css";
import Navbar from "./sunavbar";
import Sidebar from "./susidebar";
import UserModal from "./usermodal";
import AssignDataModal from "./assigndatamodel";
import ProfileModal from "./profilemodal";
import SuperUserModal from "./superusermodal";
import UserDetailsModal from "./superuserdetailsmodal";

const SuperUser = () => {
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isSuperUserModalOpen, setSuperUserModalOpen] = useState(false);
    const [isAssignDataModalOpen, setAssignDataModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [superusers, setSuperUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [selectedSuperUser, setSelectedSuperUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [assignedUsersByRoleType, setAssignedUsersByRoleType] = useState({});

    const handleCreateUser = (user) => {
        setUsers([...users, user]);
    };

    const handleCreateSuperUser = (superuser) => {
        setSuperUsers([...superusers, superuser]);
    };

    const handleSelectSuperUser = (superuserData) => {
        setSelectedSuperUser(superuserData);
    };

    const handleAssignUser = (assignment) => {
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
                    permission: assignment.permission,
                });
            }

            return updated;
        });

        setAssignedUsers((prev) => {
            const exists = prev.some(
                (u) =>
                    u.username === assignment.username &&
                    u.roleType === assignment.roleType
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
                    <div className="col-md-3 col-lg-2 p-0">
                        <div className="sidebar">
                            <Sidebar
                                onCreateUser={() => setUserModalOpen(true)}
                                onCreateSuperUser={() => setSuperUserModalOpen(true)}
                                onAssignData={() => setAssignDataModalOpen(true)}
                                onSelectSuperUser={handleSelectSuperUser}
                            />
                        </div>
                    </div>

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
            <ProfileModal
                show={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />

            {/* Single modal only */}
            <UserDetailsModal
                isOpen={!!selectedSuperUser}
                onClose={() => setSelectedSuperUser(null)}
                user={selectedSuperUser}
            />
        </>
    );
};

export default SuperUser;
