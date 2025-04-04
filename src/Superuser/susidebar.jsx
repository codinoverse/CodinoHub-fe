import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './susidebar.css';
import { useState } from "react";

const Sidebar = ({
    onCreateUser,
    users,
    onSelectUser,
    onAssignData,
    assignedUsersByRoleType = {}
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const roleTypes = [
        "Developer",
        "QA",
        "DevOps",
        "Data",
        "Security",
        "Product",
        "AI Expert",
        "Custom Team",
        "NEWBEE/INTERN"
    ];

    return (
        <div className="col-md-3 col-lg-2 sidebar-main text-white p-3 min-vh-100">
            <h5 className="text-center mb-4">User Management</h5>
            <div className="sidebar d-flex flex-column gap-3">

                <button className="sidebar-btn" onClick={onCreateUser}>Create User +</button>

                {/* Users Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("users")}>
                        Users ▾
                    </button>
                    {openDropdown === "users" && (
                        <ul className="dropdown-content">
                            {users.map((user, index) => (
                                <li key={index} onDoubleClick={() => onSelectUser(user)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Role Type Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("roleType")}>
                        Role Type ▾
                    </button>
                    {openDropdown === "roleType" && (
                        <ul className="dropdown-content">
                            {roleTypes.map((type, idx) => (
                                <li key={idx}>{type}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Roles Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("roles")}>
                        Roles ▾
                    </button>
                    {openDropdown === "roles" && (
                        <ul className="dropdown-content">
                            <li>BE</li>
                            <li>FE</li>
                            <li>Tester</li>
                        </ul>
                    )}
                </div>

                {/* Permissions Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("permissions")}>
                        Permissions ▾
                    </button>
                    {openDropdown === "permissions" && (
                        <ul className="dropdown-content">
                            <li>Write</li>
                            <li>Read</li>
                            <li>Execute</li>
                        </ul>
                    )}
                </div>

                {/* Role Type Specific User Dropdowns */}
                {roleTypes.map((type, idx) => (
                    <div className="dropdown" key={idx}>
                        <button className="sidebar-btn" onClick={() => toggleDropdown(type)}>
                            {type} ▾
                        </button>
                        {openDropdown === type && (
                            <ul className="dropdown-content">
                                {(assignedUsersByRoleType[type] || []).map((user, index) => (
                                    <li key={index}>{user.username}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                <button className="sidebar-btn assign-btn" onClick={onAssignData}>
                    Assign Data
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
