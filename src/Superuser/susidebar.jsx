import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './susidebar.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const Sidebar = ({ onCreateUser, onCreateSuperUser, onAssignData, onSelectSuperUser }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [superusers, setSuperusers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name)); 
    };

    const fetchSuperUsers = async () => {
        try {
            const res = await axios.get('http://192.168.1.12:9000/superUser/getAllSuperUsers');
            setSuperusers(res.data);
        } catch (error) {
            console.error("Error fetching superusers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://192.168.1.12:9000/user/getAllUsernames');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuperUserClick = async (username) => {
        try {
            const res = await axios.get('http://192.168.1.12:9000/superUser/getSuperUser', {
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
            <h5 className="text-center mb-4">User Management</h5>
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

                <button className="assign-btn" onClick={onAssignData}>
                    Assign Data
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
