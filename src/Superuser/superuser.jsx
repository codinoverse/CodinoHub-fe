import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./superuser.css";
import Navbar from "./sunavbar";
import Sidebar from "./susidebar";
import UserModal from "./usermodal";
import AssignDataModal from "./assigndatamodel";
import ProfileModal from "./profilemodal";
import SettingsModal from "./settingmodal";
import SuperUserModal from "./superusermodal";
import UserDetailsModal from "./superuserdetailsmodal";
import UpdateRoleModal from "./updatedRolemodal";
import UpdatedCustomRoleType from "../custom-compo/updatedCustomRolemodal";
import CustomRoleModal from "../custom-compo/customRoleModal";
import CustomConfiguration from "./CostomConfiguration";
import CustomPermissionType from "../custom-compo/customPermissionType";
import CustomPermission from "../custom-compo/customPermission";
import CustomTeamType  from "../custom-compo/customTeamType";
import AssignCustomUserToCustomTeam from "../custom-compo/assignUserToTeam"
import AssignCustomPermissionToCustomRole from "../custom-compo/assignCustomPermissionToCustomRole";

const SuperUser = () => {
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isSuperUserModalOpen, setSuperUserModalOpen] = useState(false);
  const [isAssignDataModalOpen, setAssignDataModalOpen] = useState(false);
  const [isCustomAssignedModalOpen, setCustomAssignedModalOpen] = useState(false);
  const [isCustomRoleTypeModalOpen, setIsCustomRoleTypeModalOpen] = useState(false);
  const [isCutomRoleModalOpen, setIsCutomRoleModalOpen] = useState(false);
  const [isCustomPermissionTypeModalOpen, setIsCustomPermissionTypeModalOpen] = useState(false);
  const [isCustomPermissionModalOpen, setIsCustomPermissionModalOpen] = useState(false);
  const [isAssignCustomUserToCustomTeamModalOpen, setAssignCustomUserToCustomTeamModalOpen] = useState(false);
  const [isCustomTeamTypeModalOpen, setCustomTeamTypeModalOpen] = useState(false);
  const [isAssignCustomPermissionToCustomRoleModalOpen, setIsAssignCustomPermissionToCustomRoleModalOpen] = useState(false);
  const [selectedCustomRoleType, setSelectedCustomRoleType] = useState(null);
  const [users, setUsers] = useState([]);
  const [superusers, setSuperUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customRoleType, setCustomRoleType] = useState([]);
  const [customRole, setCustomRole] = useState([]);
  const [customPermissionTypes, setCustomPermissionTypes] = useState([]);
  const [customPermissions, setCustomPermissions] = useState([]);
  const [selectedSuperUser, setSelectedSuperUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const wsRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    console.log("isCustomPermissionTypeModalOpen changed:", isCustomPermissionTypeModalOpen);
  }, [isCustomPermissionTypeModalOpen]);

  const fetchAssignedUsers = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/user/getAssignedUsersDetails`);
      if (Array.isArray(response.data)) {
        setAssignedUsers([...response.data]);
        console.log("Fetched assigned users:", response.data);
      } else {
        console.warn("Unexpected response format for assigned users:", response.data);
        setAssignedUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch assigned users:", error);
      setAssignedUsers([]);
    }
  };

  const fetchRoleTypes = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/getAllRoleTypes`);
      if (Array.isArray(response.data)) {
        setRoleTypes([...response.data]);
        console.log("Fetched role types:", response.data);
      } else {
        console.warn("Unexpected response format for role types:", response.data);
        setRoleTypes([]);
      }
    } catch (error) {
      console.error("Failed to fetch role types:", error);
      setRoleTypes([]);
    }
  };

  const customfetchRoleTypes = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/customUserManagement/role-types/all`);
      if (Array.isArray(response.data)) {
        setCustomRoleType([...response.data]);
        console.log("Fetched custom role types:", response.data);
      } else {
        console.warn("Unexpected response format for custom role types:", response.data);
        setCustomRoleType([]);
      }
    } catch (error) {
      console.error("Failed to fetch custom role types:", error);
      setCustomRoleType([]);
    }
  };

  const fetchCutomRole = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/customUserManagement/CustomRoleTable/all`);
      if (Array.isArray(response.data)) {
        setCustomRole([...response.data]);
        console.log("Fetched custom role types:", response.data);
      } else {
        console.warn("Unexpected response format for custom role types:", response.data);
        setCustomRole([]);
      }
    } catch (error) {
      console.error("Failed to fetch custom role types:", error);
      setCustomRole([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/getAllRoles`);
      if (Array.isArray(response.data)) {
        setRoles([...response.data]);
        console.log("Fetched roles:", response.data);
      } else {
        console.warn("Unexpected response format for roles:", response.data);
        setRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/user/getAllUsers`);
      if (Array.isArray(response.data)) {
        setUsers([...response.data]);
        console.log("Fetched users:", response.data);
      } else {
        console.warn("Unexpected response format for users:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const fetchCustomPermissionTypes = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/customUserManagement/customPermissionType/all`);
      if (Array.isArray(response.data)) {
        setCustomPermissionTypes([...response.data]);
        console.log("Fetched custom permission types:", response.data);
      } else {
        console.warn("Unexpected response format for custom permission types:", response.data);
        setCustomPermissionTypes([]);
      }
    } catch (error) {
      console.error("Failed to fetch custom permission types:", error);
      setCustomPermissionTypes([]);
    }
  };

  const fetchCustomPermissions = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseURL}/customUserManagement/customPermissions/all`);
      if (Array.isArray(response.data)) {
        setCustomPermissions([...response.data]);
        console.log("Fetched custom permissions:", response.data);
      } else {
        console.warn("Unexpected response format for custom permissions:", response.data);
        setCustomPermissions([]);
      }
    } catch (error) {
      console.error("Failed to fetch custom permissions:", error);
      setCustomPermissions([]);
    }
  };

  const connectWebSocket = () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      wsRef.current = new WebSocket(`${baseURL}/ws/updates`);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const updatedData = JSON.parse(event.data);
          console.log("Received WebSocket update:", updatedData);
          if (Array.isArray(updatedData) && updatedData.length > 0 && updatedData[0]?.type) {
            if (updatedData[0].type === "assignedUsers") {
              setAssignedUsers([...updatedData]);
            } else if (updatedData[0].type === "roleTypes") {
              setRoleTypes([...updatedData]);
            } else if (updatedData[0].type === "customroletype") {
              setCustomRoleType([...updatedData]);
            } else if (updatedData[0].type === "customrole") {
              setCustomRole([...updatedData]);
            } else if (updatedData[0].type === "roles") {
              setRoles([...updatedData]);
            } else if (updatedData[0].type === "users") {
              setUsers([...updatedData]);
            } else if (updatedData[0].type === "customPermissionTypes") {
              setCustomPermissionTypes([...updatedData]);
            } else if (updatedData[0].type === "customPermissions") {
              setCustomPermissions([...updatedData]);
            } else {
              console.warn("Unknown WebSocket data type:", updatedData);
              fetchAssignedUsers();
              fetchRoleTypes();
              customfetchRoleTypes();
              fetchCutomRole();
              fetchRoles();
              fetchUsers();
              fetchCustomPermissionTypes();
              fetchCustomPermissions();
            }
          } else {
            console.warn("Invalid WebSocket data format:", updatedData);
            fetchAssignedUsers();
            fetchRoleTypes();
            customfetchRoleTypes();
            fetchCutomRole();
            fetchRoles();
            fetchUsers();
            fetchCustomPermissionTypes();
            fetchCustomPermissions();
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          fetchAssignedUsers();
          fetchRoleTypes();
          customfetchRoleTypes();
          fetchCutomRole();
          fetchRoles();
          fetchUsers();
          fetchCustomPermissionTypes();
          fetchCustomPermissions();
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 5000);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
    fetchRoleTypes();
    customfetchRoleTypes();
    fetchCutomRole();
    fetchRoles();
    fetchUsers();
    fetchCustomPermissionTypes();
    fetchCustomPermissions();
    connectWebSocket();
    pollingIntervalRef.current = setInterval(() => {
      fetchAssignedUsers();
      fetchRoleTypes();
      customfetchRoleTypes();
      fetchCutomRole();
      fetchRoles();
      fetchUsers();
      fetchCustomPermissionTypes();
      fetchCustomPermissions();
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
      const baseURL = import.meta.env.VITE_BASE_URL;
      await axios.post(`${baseURL}/user/assignRole`, {
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

  const handleCustomAssignUser = async (CustomAssignment) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      await axios.post(`${baseURL}/customUserManagement/users/:userId/roles/:roleId`, {
        userId: CustomAssignment.userId,
        roleId: CustomAssignment.roleId,
      });
      console.log("User assigned successfully");
      await fetchAssignedUsers();
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  const handleUpdateRole = async (updatedUser) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      await axios.put(`${baseURL}/user/updateRole/${updatedUser.id}`, {
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

  const handleViewSettingsModal = () => {
    console.log("Opening Settingsmodal");
    setShowSettingsModal(true);
  };

  const handleOpenCustomRoleTypeModal = (roleType = null) => {
    setSelectedCustomRoleType(roleType);
    setIsCustomRoleTypeModalOpen(true);
  };

  const handleOpenCustomPermissionTypeModal = () => {
    console.log("Opening CustomPermissionTypeModal");
    setIsCustomPermissionTypeModalOpen(true);
  };

  const handleOpenCustomPermissionModal = () => {
    console.log("Opening CustomPermissionModal");
    setIsCustomPermissionModalOpen(true);
  };

  const handleOpenAssignCustomUserToCustomTeamModal = () => {
    setAssignCustomUserToCustomTeamModalOpen(true);
  }

  const handleCloseAssignCustomUserToCustomTeamModal = () => {
    setAssignCustomUserToCustomTeamModalOpen(false);
  }

  const handleOpenCustomTeamTypeModal = () => {
    setCustomTeamTypeModalOpen(true);
  }

  const handleCloseCustomTeamTypeModal = () => {
    setCustomTeamTypeModalOpen(false);
  }

  const handleOpenAssignCustomPermissionToCustomRoleModal = () => {
    setIsAssignCustomPermissionToCustomRoleModalOpen(true);
  }

  const handleCloseAssignCustomPermissionToCustomRoleModal = () => {
    setIsAssignCustomPermissionToCustomRoleModalOpen(false);
  }

  const handleCloseCustomPermissionModal = () => {
    setIsCustomPermissionModalOpen(false);
  };

  const handleCloseCustomPermissionTypeModal = () => {
    setIsCustomPermissionTypeModalOpen(false);
  };

  const handleOpenCustomRoleModal = () => {
    setIsCutomRoleModalOpen(true);
  };

  const handleCloseCustomRoleModal = () => {
    setIsCutomRoleModalOpen(false);
  };

  const handleCloseCustomRoleTypeModal = () => {
    setIsCustomRoleTypeModalOpen(false);
    setSelectedCustomRoleType(null);
  };

  return (
    <>
      <div>
        <Navbar
          onViewProfile={() => setShowProfileModal(true)}
          onSettingsModal={handleViewSettingsModal}
        />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 col-lg-2 p-0">
            <div className="sidebar">
              <Sidebar
                onCreateUser={() => setUserModalOpen(true)}
                onCreateSuperUser={() => setSuperUserModalOpen(true)}
                onAssignData={() => setAssignDataModalOpen(true)}
                onCutomAssignData={() => setCustomAssignedModalOpen(true)}
                onSelectSuperUser={setSelectedSuperUser}
                onCustomRoleTypeClick={() => handleOpenCustomRoleTypeModal()}
                onCustomRoleClick={() => handleOpenCustomRoleModal()}
                onCustomPermissionTypeClick={() => handleOpenCustomPermissionTypeModal()}
                onCustomPermissionClick={() => handleOpenCustomPermissionModal()}
                onAssignCustomPermissionToCustomRole = {() => handleOpenAssignCustomPermissionToCustomRoleModal()}
                onCustomTeamTypeClick = {() => handleOpenCustomTeamTypeModal()}
                onAssignCustomUserToCustomTeam = {() => handleOpenAssignCustomUserToCustomTeamModal()}
              />
            </div>
          </div>
          <div className="col-md-8 col-lg-10 p-4 dashboard">
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
                          <th>ID</th>
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
                                  console.log("Opening UpdateRoleModal for:", assigned);
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
                  <h5 className="mb-4">Users</h5>
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
                                className={`badge ${user.status?.toLowerCase() === "active" ? "text-success" : "text-danger"}`}
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
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Custom Role</h5>
                {customRole.length > 0 ? (
                  <div className="role-table-container">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Role Name</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customRole.map((customRole) => (
                          <tr key={customRole.id}>
                            <td>{customRole.id}</td>
                            <td>{customRole.name}</td>
                            <td>{customRole.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No custom roles available.</p>
                )}
              </div>
              <div className="col-md-6">
                <h5>Custom Role Type</h5>
                {customRoleType.length > 0 ? (
                  <div className="role-table-container">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Role Name</th>
                          <th>Description</th>
                          <th>CreatedBy</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customRoleType.map((role) => (
                          <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>{role.name}</td>
                            <td>{role.description}</td>
                            <td>{role.createdBy}</td>
                            <td>
                              <button
                                type="button"
                                className="icon-button"
                                onClick={() => handleOpenCustomRoleTypeModal(role)}
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
                  <p>No custom role types available.</p>
                )}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Custom Permission Type</h5>
                {customPermissionTypes.length > 0 ? (
                  <div className="permission-type-table-container">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customPermissionTypes.map((permission) => (
                          <tr key={permission.id}>
                            <td>{permission.id}</td>
                            <td>{permission.name}</td>
                            <td>{permission.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No custom permission types available.</p>
                )}
              </div>
              <div className="col-md-6">
                <h5>Custom Permission</h5>
                {customPermissions.length > 0 ? (
                  <div className="permission-table-container">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Permission Type ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customPermissions.map((permission) => (
                          <tr key={permission.id}>
                            <td>{permission.id}</td>
                            <td>{permission.name}</td>
                            <td>{permission.permissionTypeId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No custom permissions available.</p>
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
      <CustomConfiguration
        isOpen={isCustomAssignedModalOpen}
        onClose={() => setCustomAssignedModalOpen(false)}
      />
      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <UserDetailsModal
        isOpen={!!selectedSuperUser}
        onClose={() => setSelectedSuperUser(null)}
        user={selectedSuperUser}
      />
      <CustomPermissionType
        isOpen={isCustomPermissionTypeModalOpen}
        onClose={handleCloseCustomPermissionTypeModal}
      />
      <CustomPermission
        isOpen={isCustomPermissionModalOpen}
        onClose={handleCloseCustomPermissionModal}
      />
      <CustomTeamType 
        isOpen={isCustomTeamTypeModalOpen}
        onClose={handleCloseCustomTeamTypeModal}
      />
      <AssignCustomPermissionToCustomRole 
        isOpen={isAssignCustomPermissionToCustomRoleModalOpen}
        onClose={handleCloseAssignCustomPermissionToCustomRoleModal}
      />
      <UpdateRoleModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        user={userToUpdate}
        onSave={handleUpdateRole}
      />
      <UpdatedCustomRoleType
        isOpen={isCustomRoleTypeModalOpen}
        onClose={handleCloseCustomRoleTypeModal}
        roleType={selectedCustomRoleType}
        onSave={() => {
          customfetchRoleTypes();
          handleCloseCustomRoleTypeModal();
        }}
      />
      <AssignCustomUserToCustomTeam 
        isOpen={isAssignCustomUserToCustomTeamModalOpen}
        onClose={handleCloseAssignCustomUserToCustomTeamModal}
      />
      <CustomRoleModal
        isOpen={isCutomRoleModalOpen}
        onClose={handleCloseCustomRoleModal}
      />
    </>
  );
};

export default SuperUser;