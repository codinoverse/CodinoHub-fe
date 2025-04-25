import React, { useState, useEffect } from "react";
import axios from "axios";
import "./superuser.css";
import Navbar from "./sunavbar";
import Sidebar from "./susidebar";
import UserModal from "./usermodal";
import AssignDataModal from "./assigndatamodel";
import ProfileModal from "./profilemodal";
import SuperUserModal from "./superusermodal";
import UserDetailsModal from "./superuserdetailsmodal";
import UpdateRoleModal from "./updatedRolemodal";

const SuperUser = () => {
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isSuperUserModalOpen, setSuperUserModalOpen] = useState(false);
    const [isAssignDataModalOpen, setAssignDataModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [superusers, setSuperUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [selectedSuperUser, setSelectedSuperUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axios.get("http://192.168.1.12:9000/user/getAssignedUsersDetails");
                setAssignedUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch initial assigned users:", error);
            }
        };

        fetchInitialData();

        const socket = new WebSocket("ws://192.168.1.12:9000/ws/updates");

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const updatedData = JSON.parse(event.data);
            console.log("Received update:", updatedData);
            setAssignedUsers(updatedData);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => socket.close(); // Cleanup on component unmount
    }, []);

    const handleCreateUser = (user) => setUsers([...users, user]);

    const handleCreateSuperUser = (superuser) => setSuperUsers([...superusers, superuser]);

    const handleAssignUser = async (assignment) => {
        try {
            await axios.post("http://192.168.1.12:9000/user/assignRole", {
                userId: assignment.userId,
                roleType: assignment.roleType,
                roleName: assignment.roleName,
            });
        } catch (error) {
            console.error("Error assigning user:", error);
        }
    };

    const handleUpdateRole = async (updatedUser) => {
        try {
            await axios.put(`http://192.168.1.12:9000/user/updateRole/${updatedUser.id}`, {
                roleType: updatedUser.roleType,
                roleName: updatedUser.roleName,
            });
            setUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating role:", error.response || error.message);
        }
    };

    return (
        <>
            <Navbar onViewProfile={() => setShowProfileModal(true)} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2 p-0">
                        <Sidebar
                            onCreateUser={() => setUserModalOpen(true)}
                            onCreateSuperUser={() => setSuperUserModalOpen(true)}
                            onAssignData={() => setAssignDataModalOpen(true)}
                            onSelectSuperUser={setSelectedSuperUser}
                        />
                    </div>
                    <div className="col-md-9 col-lg-10 p-4">
                        <h2>Assigned Users</h2>
                        {assignedUsers.length > 0 ? (
                            <div className="assigned-table-container">
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>User ID</th>
                                            <th>Username</th>
                                            <th>Role Type</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedUsers.map((assigned) => (
                                            <tr key={assigned.id}>
                                                <td>{assigned.id}</td>
                                                <td>{assigned.username}</td>
                                                <td>{assigned.roleType}</td>
                                                <td>{assigned.role}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setUserToUpdate(assigned);
                                                            setUpdateModalOpen(true);
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No users assigned yet.</p>
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
            <UserDetailsModal
                isOpen={!!selectedSuperUser}
                onClose={() => setSelectedSuperUser(null)}
                user={selectedSuperUser}
            />
            <UpdateRoleModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                user={userToUpdate}
                onSave={handleUpdateRole}
            />
        </>
    );
};

export default SuperUser;
