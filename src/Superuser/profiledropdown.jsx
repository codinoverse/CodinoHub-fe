import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import profileimg from '../assets/profile.png';
import '../Superuser/profiledropdown.css'

const ProfileDropdown = ({ onViewProfile }) => {
    return (
        <div className="dropdown">
            {/* Profile Image as Dropdown Button */}
            <button 
                className="btn dropdown-toggle" 
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: 'none', border: 'none', padding: 0 }}
            >
                <img src={profileimg} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="Profile" />
            </button>

            {/* Dropdown Menu */}
            <ul className="dropdown-menu dropdown-menu-end mt-3" aria-labelledby="profileDropdown">
                <li><div className="dropdown-item" onClick={onViewProfile}>VIEW PROFILE</div></li>
                <li><div className="dropdown-item">SETTINGS</div></li>
                <li><Link to="/" className="dropdown-item">LOGOUT</Link></li>
            </ul>
        </div>
    );
};

export default ProfileDropdown;
