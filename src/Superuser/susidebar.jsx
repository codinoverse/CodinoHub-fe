import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './susidebar.css'
import { useState } from "react";

const Sidebar = ({ onCreateUser, users, onSelectUser, onAssignData }) => {

    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isRoleTypeDropdownOpen, setRoleTypeDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [isPermissionDropdownOpen, setPermissionDropdownOpen] = useState(false);



    return (
        <>
            <div className="col-md-3 col-lg-2 sidebar-main text-white p-3 min-vh-100">
                <h5 className="text-center">User Management</h5>
                <hr />
                <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    <button onClick={onCreateUser}>Create User</button>
                    <div className="dropdown">
                        <button onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}>
                            Create User +
                        </button>
                        {isUserDropdownOpen && (
                            <ul>
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
                        <button onClick={() => setRoleTypeDropdownOpen(!isRoleTypeDropdownOpen)}>
                            Role Type
                        </button>
                        {isRoleTypeDropdownOpen && (
                            <ul>
                                <li>Developer</li>
                                <li>QA</li>
                            </ul>
                        )}
                    </div>

                    {/* Roles Dropdown */}
                    <div className="dropdown">
                        <button onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}>
                            Roles
                        </button>
                        {isRoleDropdownOpen && (
                            <ul>
                                <li>BE</li>
                                <li>FE</li>
                                <li>Tester</li>
                            </ul>
                        )}
                    </div>

                    {/* Permissions Dropdown */}
                    <div className="dropdown">
                        <button onClick={() => setPermissionDropdownOpen(!isPermissionDropdownOpen)}>
                            Permissions
                        </button>
                        {isPermissionDropdownOpen && (
                            <ul>
                                <li>Write</li>
                                <li>Read</li>
                                <li>Execute</li>
                            </ul>
                        )}
                    </div>

                    {/* Assign Data */}
                    <button onClick={onAssignData}>Assign Data</button>
                </div>
            </div>
        </>
    );
};


export default Sidebar;