import { Link } from 'react-router-dom';
import './sunavbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notifications from './notificationdropdown';
import DropdownSelect from './dropdown';
import ProfileDropdown from './profiledropdown';

const Navbar = ({ onViewProfile }) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    const companyName = userDetails ? userDetails.companyName : "Default Company";
    const username = userDetails ? userDetails.username : "Guest";

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Left Section */}
                <div className="d-flex align-items-center">
                    <Link to="/" className="logo-link">CodinoHub</Link>
                    <span className="company-name">{companyName}</span>
                </div>
                <h5 className="text-center mt-2 mx-5 usermanagement">User Management</h5>


                {/* Navbar Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Right Section */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <div className="right-section ms-auto">
                        <div className="notification-dropdown">
                            <Notifications />
                        </div>

                        {/* User Info */}
                        <div className="d-flex align-items-center">
                            <span className="username">{username}</span>
                            <span className="divider mx-2">|</span>
                            <DropdownSelect />
                        </div>

                        {/* Profile Dropdown */}
                        <ProfileDropdown onViewProfile={onViewProfile} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
