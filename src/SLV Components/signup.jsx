import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup.css';
import './common.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        companyName: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            userType: "SUPERUSER"
        };

        try {
            const response = await axios.post(
                "http://192.168.1.12:9000/superUser/createSuperuserAndUser",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                toast.success('User created successfully!');
                navigate('/verification', { state: { email: formData.email } });
            } else {
                toast.error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Error ${error.response.status}: ${error.response.data?.message || "Internal server error"}`);
            } else {
                toast.error("Something went wrong! Check network and backend.");
            }
        }
    };

    return (
        <div className="signup background">
            <div className="container signup-main-container">
                <h1>CodinoHub.</h1>

                <div className="signup-form">
                    <h4 className="text-white">Create An Account</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                name="firstName"
                                placeholder="Enter firstname"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                name="lastName"
                                placeholder="Enter lastname"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="fields"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                name="companyName"
                                placeholder="Enter company name"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="container signup-container">
                            <button type="submit" className="btn-signup">Sign Up</button>
                        </div>
                    </form>

                    <div className="login-link">
                        <p className="text-white">Already have an account? <Link to="/">Login here</Link></p>
                    </div>
                    <div>
                        <Link className="text-white">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignupForm;
