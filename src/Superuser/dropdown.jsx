import { useState } from "react";
import './dropdown.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const DropdownSelect = () => {
    const [selectedItem, setSelectedItem] = useState("Switch Mode");
    const options = ["SUPER-USER", "DEVELOPER", "QA", "DATA", "SECURITY", "PRODUCT", "DEVOPS", "NEWBEE/INTERN"];

    const handleSelect = (option) => {
        setSelectedItem(option);
    };

    return (
        <div>
            <div className="dropdown">
                <button
                    className="dropdown-toggle mode-btn"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: '14px' }}>
                    {selectedItem}
                </button>
                <ul className="dropdown-menu mt-3" aria-labelledby="dropdownMenuButton">
                    {options.map((option, index) => (
                        <li key={index}>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSelect(option);
                                }}>
                                {option}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropdownSelect;



