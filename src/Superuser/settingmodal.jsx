import React, { useState } from "react";
import './settingmodal.css';

const SettingsModal = ({ show, onClose }) => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const [isEnabled, setIsEnabled] = useState(false);

    const toggleState = () => {
        setIsEnabled(!isEnabled);
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog  modal-lg modal-dialog-centered">
                <div className="modal-content modal-content-settings">
                    <div className="modal-header">
                        <h5 className="modal-title">Settings</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="accordion settings-body">
                            <div className="accordion-item">
                                <h2 className="accordion-header ">
                                    <button
                                        className={`accordion-button notif-btn ${openSection === 'notificationPreferences' ? '' : 'collapsed'}`}
                                        type="button"
                                        onClick={() => toggleSection('notificationPreferences')}
                                    >
                                        Notification Preferences
                                    </button>
                                </h2>
                                {openSection === 'notificationPreferences' && (
                                    <div className="accordion-collapse">
                                        <div className="accordion-body">
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input email-notification" id="emailNotifications" />
                                                <label className="form-check-label email-notif" htmlFor="emailNotifications">
                                                    Email Notifications
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className={`accordion-button notif-btn ${openSection === 'customesettings' ? '' : 'collapsed'}`}
                                        type="button"
                                        onClick={() => toggleSection('customesettings')}
                                    >
                                        Custom Settings
                                    </button>
                                </h2>
                                {openSection === 'customesettings' && (
                                    <div className="accordion-collapse">
                                        <div className="accordion-body">
                                            <div className="form-check form-check-settings mb-2 d-flex gap-2">
                                                <button
                                                    id="customConfigButton"
                                                    className={`btn ed-btn ${isEnabled ? "btn-success" : "btn-danger"} ms-2`} // Red when disabled
                                                    onClick={toggleState}
                                                >
                                                    {isEnabled ? "Enabled" : "Disabled"}
                                                </button>
                                                <label className="form-check-label email-notif" htmlFor="emailNotifications">
                                                    Custom Configuration
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className={`accordion-button privacy-btn ${openSection === 'privacySettings' ? '' : 'collapsed'}`}
                                        type="button"
                                        onClick={() => toggleSection('privacySettings')}
                                    >
                                        Privacy Settings
                                    </button>
                                </h2>
                                {openSection === 'privacySettings' && (
                                    <div className="accordion-collapse">
                                        <div className="accordion-body">
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input sppto" id="showProfilePicture" />
                                                <label className="form-check-label privacy-list" htmlFor="showProfilePicture">
                                                    Show Profile Picture to Others
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input sas" id="shareActivityStatus" />
                                                <label className="form-check-label privacy-list" htmlFor="shareActivityStatus">
                                                    Share Activity Status
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="savech-btn" onClick={onClose}>
                            Save Changes
                        </button>
                        <button className="cancelch-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
