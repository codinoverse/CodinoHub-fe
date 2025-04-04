import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import './common.css';
import { Link, useNavigate } from "react-router-dom";

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
            const response = await fetch("http://192.168.1.12:9000/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    userType: formData.userType  
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login Success:", data);
                if (formData.userType === "superuser") {
                    navigate("/superuser");
                } else {
                    navigate("/user");
                }
            } else {
                alert(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="login background">
            <div className="container">
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
                                placeholder="Enter your username"
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
                                placeholder="Enter your valid password"
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
                                    required
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
