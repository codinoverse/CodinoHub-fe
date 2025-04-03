import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import './common.css';
import { Link } from "react-router-dom";

const LoginForm = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
    };

    return (
        <div className="login background">
            <div className="container">
                <h1>CodinoHub.</h1>

                <div className="login-form">
                    <h4 className="text-white">Login</h4>
                    <form onSubmit={handleSubmit}>
                        {/* username */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* password*/}
                        <div className="mb-3">
                            <input
                                type="password"
                                className="fields"
                                id="password"
                                name="password"
                                placeholder="Enter your valid password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="container login-container" >
                            <div>
                                <input type="checkbox" />
                                <label className="text-white">SuperUser</label>
                            </div>

                            <div>
                                <input type="checkbox" />
                                <label className="text-white">User</label>
                            </div>
                            <Link to="/superuser"><button type="submit" className=" btn-signup">Login</button></Link>
                        </div>

                    </form>
                    <div className="login-link">
                        <p className="text-white">Don't have an account? <a href={"/signup"}>Signup here</a></p>
                    </div>
                    <div>
                        <Link>term & conditions</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
