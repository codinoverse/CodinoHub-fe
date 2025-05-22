import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import './susidebar.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const Sidebar = ({ onCreateUser,
    onCreateSuperUser,
    onAssignData,
    onCutomAssignData,
    onSelectSuperUser,
    onCustomRoleTypeClick,
    onCustomRoleClick,
    onCustomPermissionTypeClick,
    onCustomPermissionClick,
    onAssignCustomPermissionToCustomRole,
    onCustomTeamTypeClick,
    onAssignCustomUserToCustomTeam
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [superusers, setSuperusers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);



    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const fetchSuperUsers = async () => {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL;
            const fetchSuperUsersURL = baseURL;
            const res = await axios.get(`${fetchSuperUsersURL}/superUser/getAllSuperUsers`);
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
            const fetchUsersURL = baseURL;
            const res = await axios.get(`${fetchUsersURL}/user/getAllUsernames`);
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
            const handleSuperUserClickURL = baseURL;
            const res = await axios.get(`${handleSuperUserClickURL}/superUser/getSuperUser`, {
                params: { username }
            });
            if (res.data) {
                onSelectSuperUser(res.data);
            }
        } catch (error) {
            console.error("Error fetching superuser details:", error);
        }
    };


    useEffect(() => {
        fetchSuperUsers();
        fetchUsers();
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
                                                        onClick={() =>
                                                            handleSuperUserClick(superuser.username)
                                                        }
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
                                            users.map((user, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item list-group-item-action p-1"
                                                >
                                                    <button
                                                        className="btn text-start w-100 text-decoration-none"
                                                        onClick={() => handleSuperUserClick(user.username)}
                                                    >
                                                        {user.username}
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
                <div className="accordion" id="teamAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header d-flex justify-content-between align-items-center">
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
                                        <li className="list-group-item text-muted">
                                            Developer
                                        </li><li className="list-group-item text-muted">
                                            Quality Assurance
                                        </li>
                                        <li className="list-group-item text-muted">
                                            Data
                                        </li>
                                        <li className="list-group-item text-muted">
                                            Security
                                        </li>
                                        <li className="list-group-item text-muted">
                                            Product
                                        </li><li className="list-group-item text-muted">
                                            Devops
                                        </li>
                                        <li className="list-group-item text-muted">
                                            Newbee/Intern
                                        </li>
                                        <li className="list-group-item text-muted">
                                            Ai Expert
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="accordion" id="teamAccordion">
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
                                        <li className="list-group-item text-muted">
                                            Custom Team
                                        </li>
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
        </div>
    );
};

export default Sidebar;
