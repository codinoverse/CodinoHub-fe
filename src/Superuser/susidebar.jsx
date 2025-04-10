import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './susidebar.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const Sidebar = ({
    onCreateUser,
    onCreateSuperUser,
    onSelectUser,
    onSelectSuperUser,
    onAssignData,
    assignedUsersByRoleType = {}
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [users, setUsers] = useState([]);
    const [superusers, setSuperusers] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [dataTable, setDataTable] = useState(null);

    // Function to fetch data from backend APIs
    const fetchData = async (type) => {
        try {
            let response;

            switch (type) {
                case "users":
                    response = await axios.get('/user/getUser');
                    setUsers(response.data);
                    break;
                case "superusers":
                    response = await axios.get('/user/getSuperUser');
                    setSuperusers(response.data);
                    break;
                case "roles":
                    response = await axios.get('/user/getRoles');
                    setRoles(response.data);
                    break;
                case "roleType":
                    response = await axios.get('/user/getRoleType');
                    setRoleTypes(response.data);
                    break;
                case "permissions":
                    response = await axios.get('/user/getPermission');
                    setPermissions(response.data);
                    break;
                case "permissionType":
                    response = await axios.get('/user/getPermissionType');
                    break;
                default:
                    return;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const renderTable = () => {
        if (!dataTable) return null;

        return (
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {dataTable.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    useEffect(() => {
        // Fetch initial data when the component mounts
        fetchData("users");
        fetchData("superusers");
        fetchData("roles");
        fetchData("roleType");
        fetchData("permissions");
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <div className="col-md-3 col-lg-2 sidebar-main text-white p-3 min-vh-100">
            <h5 className="text-center mb-4">User Management</h5>
            <div className="sidebar d-flex flex-column gap-3">

                <button className="sidebar-btn" onClick={onCreateSuperUser}>Create SuperUser +</button>

                {/* SuperUsers Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("superusers")}>
                        SuperUsers ▾
                    </button>
                    {openDropdown === "superusers" && (
                        <ul className="dropdown-content">
                            {superusers.map((superuser, index) => (
                                <li key={index} onDoubleClick={() => onSelectSuperUser(superuser)}>
                                    {superuser.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button className="sidebar-btn" onClick={onCreateUser}>Create User +</button>

                {/* Users Dropdown */}
                <div className="dropdown">
                    <button className="sidebar-btn" onClick={() => toggleDropdown("users")}>
                        Users ▾
                    </button>
                    {openDropdown === "users" && (
                        <ul className="dropdown-content">
                            {users.map((user, index) => (
                                <li key={index} onDoubleClick={() => { onSelectUser(user); fetchData("users"); }}>
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
                                <li key={idx} onDoubleClick={() => fetchData("roleType")}>
                                    {type.name} {/* Assuming `type` has `name` */}
                                </li>
                            ))}
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
                            {permissions.map((permission, idx) => (
                                <li key={idx} onDoubleClick={() => fetchData("permissions")}>
                                    {permission.name} {/* Assuming `permission` has `name` */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Render the table when data is fetched */}
                {renderTable()}

                <button className="sidebar-btn assign-btn" onClick={onAssignData}>
                    Assign Data
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
