import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './susidebar.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const Sidebar = ({ onCreateUser, onCreateSuperUser, onAssignData, onSelectSuperUser }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [superusers, setSuperusers] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
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
    }, []);

    return (
        <div className="col-md-3 col-lg-2 sidebar-main text-white p-3 min-vh-100">
            <h5 className="text-center mb-4">User Management</h5>
            <div className="sidebar d-flex flex-column gap-3">
                <button className="sidebar-btn" onClick={onCreateSuperUser}>
                    Create SuperUser +
                </button>

                <div className="dropdown">
                    <button
                        className="sidebar-btn dropdown-toggle w-100"
                        onClick={() => toggleDropdown("superusers")}
                    >
                        SuperUsers
                    </button>
                    {openDropdown === "superusers" && (
                        <ul className="list-group mt-2">
                            {!loading && superusers.length > 0 ? (
                                superusers.map((superuser, index) => (
                                    <li key={index} className="list-group-item list-group-item-action p-1">
                                        <button
                                            className="btn  text-start w-100 text-decoration-none"
                                            onClick={() => handleSuperUserClick(superuser.username)}
                                        >
                                            {superuser.username}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-muted">No superusers found</li>
                            )}
                        </ul>
                    )}
                </div>

                <button className="sidebar-btn " onClick={onCreateUser}>
                    Create User +
                </button>
                <button className="assign-btn" onClick={onAssignData}>
                    Assign Data
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
