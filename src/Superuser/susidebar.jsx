import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./susidebar.css";
import { useState, useEffect } from "react";
import axios from "axios";
import DeveloperModal from './Teams/DeveloperModal';
import QAModal from './Teams/QAModal';
import DevOpsModal from './Teams/DevOpsModal';
import DataModal from './Teams/DataModal';
import SecurityModal from './Teams/SecurityModal';
import ProductModal from './Teams/ProductModal';
import AIExpertModal from './Teams/AIExpertModal';

const Sidebar = ({
    onCreateUser,
    onCreateSuperUser,
    onAssignData,
    onCutomAssignData,
    onSelectSuperUser,
    onSelectUser,
    onCustomRoleTypeClick,
    onCustomRoleClick,
    onCustomPermissionTypeClick,
    onCustomPermissionClick,
    onAssignCustomPermissionToCustomRole,
    onCustomTeamTypeClick,
    onAssignCustomUserToCustomTeam,
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [superusers, setSuperusers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeveloperModal, setShowDeveloperModal] = useState(false);
    const [showQAModal, setShowQAModal] = useState(false);
    const [showDevOpsModal, setShowDevOpsModal] = useState(false);
    const [showDataModal, setShowDataModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showAIExpertModal, setShowAIExpertModal] = useState(false);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const fetchSuperUsers = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const res = await axios.get(`${baseURL}/superUser/getAllSuperUsers`);
            setSuperusers(res.data);
        } catch (error) {
            console.error("Error fetching superusers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const res = await axios.get(`${baseURL}/user/getAllUsers`);
            console.log("Users API response:", res.data); // Debug: Log API response
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuperUserClick = async (username) => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const res = await axios.get(`${baseURL}/superUser/getSuperUser`, {
                params: { username },
            });
            if (res.data) {
                onSelectSuperUser(res.data);
            }
        } catch (error) {
            console.error("Error fetching superuser details:", error);
        }
    };


    const handleUserClick = async (id) => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const res = await axios.get(`${baseURL}/user/getUser`, {
                params: { id },
            });
            console.log("handleUserClick - API response:", res.data); 
            if (res.data) {
                onSelectUser(res.data);
                console.log("handleUserClick - Calling onSelectUser with:", res.data); // Debug onSelectUser call
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleUserDoubleClick = (user) => {
        console.log("handleUserDoubleClick - User:", user); // Debug double-click
        onSelectUser(user);
    };

    useEffect(() => {
        fetchSuperUsers();
        fetchUsers();
        console.log("Users state:", users);
    }, []);

    return (
        <div className="col-md-3 col-lg-2 sidebar-main text-white p-3 min-vh-100">
            <div className="sidebar d-flex flex-column gap-1">
                {/* SuperUsers Accordion */}
                <div className="accordion" id="superuserAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header d-flex justify-content-between align-items-center">
                            <button
                                className="accordion-button collapsed w-100"
                                type="button"
                                onClick={() => toggleDropdown("superusers")}
                                aria-expanded={openDropdown === "superusers"}
                            >
                                SuperUsers
                            </button>
                            <button
                                className="superuser"
                                onClick={onCreateSuperUser}
                                type="button"
                            >
                                +
                            </button>
                        </h2>
                        {openDropdown === "superusers" && (
                            <div className="accordion-collapse collapse show">
                                <div className="accordion-body p-2">
                                    <ul className="list-group">
                                        {!loading && superusers.length > 0 ? (
                                            superusers.map((superuser, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item list-group-item-action p-1"
                                                >
                                                    <button
                                                        className="btn text-start w-100 text-decoration-none"
                                                        onClick={() => handleSuperUserClick(superuser.username)}
                                                    >
                                                        {superuser.username}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">
                                                No superusers found
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Accordion */}
                <div className="accordion" id="userAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header d-flex justify-content-between align-items-center">
                            <button
                                className="accordion-button collapsed w-100"
                                type="button"
                                onClick={() => toggleDropdown("users")}
                                aria-expanded={openDropdown === "users"}
                            >
                                Users
                            </button>
                            <button
                                className="superuser"
                                onClick={onCreateUser}
                                type="button"
                            >
                                +
                            </button>
                        </h2>
                        {openDropdown === "users" && (
                            <div className="accordion-collapse collapse show">
                                <div className="accordion-body p-2">
                                    <ul className="list-group">
                                        {!loading && users.length > 0 ? (
                                            users
                                                .filter((user) => user.firstName || user.lastName) // Ensure at least one name field exists
                                                .map((user, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item list-group-item-action p-1"
                                                    >
                                                        <button
                                                            className="btn text-start w-100 text-decoration-none text-dark"
                                                            onClick={() => handleUserClick(user.id)}
                                                            onDoubleClick={() => handleUserDoubleClick(user)}
                                                        >
                                                            {user.firstName && user.lastName
                                                                ? `${user.firstName} ${user.lastName}`
                                                                : user.firstName || user.lastName || "Unnamed User"}
                                                        </button>
                                                    </li>
                                                ))
                                        ) : (
                                            <li className="list-group-item text-muted">
                                                No users found
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Teams Accordion */}
                <div className="accordion" id="teamsAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed w-100"
                                type="button"
                                onClick={() => toggleDropdown("teams")}
                                aria-expanded={openDropdown === "teams"}
                            >
                                Teams
                            </button>
                        </h2>
                        {openDropdown === "teams" && (
                            <div className="accordion-collapse collapse show">
                                <div className="accordion-body p-2">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowDeveloperModal(true)}
                                            >
                                                Developer Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowQAModal(true)}
                                            >
                                                QA Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowDevOpsModal(true)}
                                            >
                                                DevOps Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowDataModal(true)}
                                            >
                                                Data Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowSecurityModal(true)}
                                            >
                                                Security Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowProductModal(true)}
                                            >
                                                Product Team
                                            </button>
                                        </li>
                                        <li className="list-group-item list-group-item-action p-1">
                                            <button
                                                className="btn text-start w-100 text-decoration-none"
                                                onClick={() => setShowAIExpertModal(true)}
                                            >
                                                AI Expert Team
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Settings Accordion */}
                <div className="accordion" id="customSettingsAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header d-flex justify-content-between align-items-center">
                            <button
                                className="accordion-button collapsed w-100"
                                type="button"
                                onClick={() => toggleDropdown("customsettings")}
                                aria-expanded={openDropdown === "customsettings"}
                            >
                                Custom Settings
                            </button>
                        </h2>
                        {openDropdown === "customsettings" && (
                            <div className="accordion-collapse collapse show">
                                <div className="accordion-body p-2">
                                    <ul className="list-group">
                                        <li className="list-group-item text-muted" onClick={onCustomRoleTypeClick}>
                                            Custom Role Type
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onCustomRoleClick}>
                                            Custom Role
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onCustomPermissionTypeClick}>
                                            Custom Permission Type
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onCustomPermissionClick}>
                                            Custom Permission
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onAssignCustomPermissionToCustomRole}>
                                            Assign Permission to Role
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onCustomTeamTypeClick}>
                                            Custom Team Type
                                        </li>
                                        <li className="list-group-item text-muted" onClick={onAssignCustomUserToCustomTeam}>
                                            Assign User To Team
                                        </li>
                                        <li className="list-group-item text-muted">Custom Team</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button className="assign-btn" onClick={onAssignData}>
                    Configuration
                </button>
                <button className="assign-btn" onClick={onCutomAssignData}>
                    Custom Configuration
                </button>
            </div>

            {/* Team Modals */}
            <DeveloperModal 
                show={showDeveloperModal} 
                handleClose={() => setShowDeveloperModal(false)} 
            />
            <QAModal 
                show={showQAModal} 
                handleClose={() => setShowQAModal(false)} 
            />
            <DevOpsModal 
                show={showDevOpsModal} 
                handleClose={() => setShowDevOpsModal(false)} 
            />
            <DataModal 
                show={showDataModal} 
                handleClose={() => setShowDataModal(false)} 
            />
            <SecurityModal 
                show={showSecurityModal} 
                handleClose={() => setShowSecurityModal(false)} 
            />
            <ProductModal 
                show={showProductModal} 
                handleClose={() => setShowProductModal(false)} 
            />
            <AIExpertModal 
                show={showAIExpertModal} 
                handleClose={() => setShowAIExpertModal(false)} 
            />
        </div>
    );
};

export default Sidebar;