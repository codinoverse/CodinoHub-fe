import React, { useState, useEffect, useRef } from "react";
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
    const [roleTypes, setRoleTypes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedSuperUser, setSelectedSuperUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const wsRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    const fetchAssignedUsers = async () => {
        try {
            const response = await axios.get("http://192.168.1.12:9000/user/getAssignedUsersDetails");
            setAssignedUsers([...response.data]);
            console.log("Fetched assigned users:", response.data);
        } catch (error) {
            console.error("Failed to fetch assigned users:", error);
        }
    };

    const fetchRoleTypes = async () => {
        try {
            const response = await axios.get("http://192.168.1.12:9000/getAllRoleTypes");
            setRoleTypes([...response.data]);
            console.log("Fetched role types:", response.data);
        } catch (error) {
            console.error("Failed to fetch role types:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://192.168.1.12:9000/getAllRoles");
            setRoles([...response.data]);
            console.log("Fetched roles:", response.data);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://192.168.1.12:9000/user/getAllUsers");
            setUsers([...response.data]);
            console.log("Fetched users:", response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const connectWebSocket = () => {
        wsRef.current = new WebSocket("ws://192.168.1.12:9000/ws/updates");

        wsRef.current.onopen = () => {
            console.log("WebSocket connection established");
        };

        wsRef.current.onmessage = (event) => {
            try {
                const updatedData = JSON.parse(event.data);
                console.log("Received WebSocket update:", updatedData);
                if (Array.isArray(updatedData)) {
                    if (updatedData[0]?.type === "assignedUsers") {
                        setAssignedUsers([...updatedData]);
                    } else if (updatedData[0]?.type === "roleTypes") {
                        setRoleTypes([...updatedData]);
                    } else if (updatedData[0]?.type === "roles") {
                        setRoles([...updatedData]);
                    } else if (updatedData[0]?.type === "users") {
                        setUsers([...updatedData]);
                    } else {
                        console.warn("Unknown WebSocket data type:", updatedData);
                        fetchAssignedUsers();
                        fetchRoleTypes();
                        fetchRoles();
                        fetchUsers();
                    }
                } else {
                    console.warn("Invalid WebSocket data format:", updatedData);
                    fetchAssignedUsers();
                    fetchRoleTypes();
                    fetchRoles();
                    fetchUsers();
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket connection closed. Reconnecting...");
            setTimeout(connectWebSocket, 5000);
        };
    };

    useEffect(() => {
        fetchAssignedUsers();
        fetchRoleTypes();
        fetchRoles();
        fetchUsers();
        connectWebSocket();
        pollingIntervalRef.current = setInterval(() => {
            fetchAssignedUsers();
            fetchRoleTypes();
            fetchRoles();
            fetchUsers();
        }, 10000);

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
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
            console.log("User assigned successfully");
            await fetchAssignedUsers();
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
            console.log("Role updated successfully");
            setUpdateModalOpen(false);
            await fetchAssignedUsers();
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
                        <h3 className="text-center dashboard-heading">Dashboard</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="col-md-6">
                                    <h5>Assigned Users</h5>
                                </div>
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
                                                                className="icon-button"
                                                                onClick={() => {
                                                                    setUserToUpdate(assigned);
                                                                    setUpdateModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fas fa-pencil-alt"></i>
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
                            <div className="col-md-6">
                                <div className="col-md-6">
                                    <h5 className=" mb-4">Users</h5>
                                </div>
                                {users.length > 0 ? (
                                    <div className="users-table-container">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Created By</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.id}</td>
                                                        <td>{user.firstName}</td>
                                                        <td>{user.lastName}</td>
                                                        <td>{user.createdBy}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${user.status?.toLowerCase() === "active" ? "text-success" : "text-danger"
                                                                    }`}
                                                            >
                                                                ● {user.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No users available.</p>
                                )}
                            </div>

                        </div>
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <h5>Role</h5>
                                {roles.length > 0 ? (
                                    <div className="role-table-container">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Role ID</th>
                                                    <th>Role Name</th>
                                                    <th>Description</th>
                                                    <th>CreatedBy</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roles.map((role) => (
                                                    <tr key={role.id}>
                                                        <td>{role.id}</td>
                                                        <td>{role.name}</td>
                                                        <td>{role.description}</td>
                                                        <td>{role.createdBy}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No roles available.</p>
                                )}
                            </div>
                            <div className="col-md-6">
                                <h5>Role Type</h5>
                                {roleTypes.length > 0 ? (
                                    <div className="role-type-table-container">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Role Type ID</th>
                                                    <th>Role Type Name</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roleTypes.map((type) => (
                                                    <tr key={type.id}>
                                                        <td>{type.id}</td>
                                                        <td>{type.name}</td>
                                                        <td>{type.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No role types available.</p>
                                )}
                            </div>
                        </div>
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