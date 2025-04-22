import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import './common.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        userType: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userType) {
            alert("Please select a user type.");
            return;
        }

        try {
            const response = await axios.post("http://192.168.1.12:9000/login", {
                username: formData.username,
                password: formData.password,
                userType: formData.userType
            });

            const data = response.data;

            if (response.status === 200) {
                if (formData.userType === "superuser") {
                    const superUserResponse = await axios.get(`http://192.168.1.12:9000/superUser/getSuperUserProfile?username=${formData.username}`);
                    const superUserData = superUserResponse.data;

                    if (superUserResponse.status === 200) {
                        const superUserDetails = {
                            username: superUserData.username,
                            email: superUserData.email,
                            companyName: superUserData.companyName
                        };
                        localStorage.setItem("userDetails", JSON.stringify(superUserDetails));
                        navigate("/superuser");
                    } else {
                        alert(superUserData.message || "Failed to fetch superuser data.");
                    }
                } else {
                    localStorage.setItem("userDetails", JSON.stringify({ username: data.username }));
                    navigate("/user");
                }
            } else {
                alert(data.message || "Login failed.");
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login background">
            <div className="container login-form-main">
                <h1>CodinoHub.</h1>

                <div className="login-form">
                    <h4 className="text-white">Login</h4>
                    <form onSubmit={handleSubmit}>
                        {/* Username */}
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

                        {/* Password */}
                        <div className="mb-3">
                            <input
                                type="password"
                                className="fields"
                                name="password"
                                placeholder="Enter valid password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* User Type Selection */}
                        <div className="container login-container">
                            <div>
                                <input
                                    type="radio"
                                    id="superUser"
                                    name="userType"
                                    value="superuser"
                                    onChange={handleChange}
                                />
                                <label htmlFor="superUser" className="text-white">SuperUser</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    id="user"
                                    name="userType"
                                    value="user"
                                    onChange={handleChange}
                                />
                                <label htmlFor="user" className="text-white">User</label>
                            </div>

                            <button type="submit" className="btn-signup">Login</button>
                        </div>
                    </form>

                    <div className="login-link">
                        <p className="text-white">
                            Don't have an account? <Link to="/signup">Signup here</Link>
                        </p>
                    </div>

                    <div>
                        <Link className="text-white">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
