import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup.css';
import './common.css';
import { Link } from "react-router-dom";

const SignupForm = () => {




    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        companyname: ""
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

        <div className="signup background">
            <div className="container ">
                <h1>CodinoHub.</h1>

                <div className="signup-form">
                    <h4 className="text-white">Create An Account</h4>


                    <form onSubmit={handleSubmit}>
                        {/* firstname */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                id="firstname"
                                name="firstname"
                                placeholder="Enter firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* lastname */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                id="username"
                                name="username"
                                placeholder="Enter lastname"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* username */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="fields"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* email */}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="fields"
                                id="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* companyname */}
                        <div className="mb-3">
                            <input
                                type="companyname"
                                className="fields"
                                id="companyname"
                                name="companyname"
                                placeholder="Enter companyname"
                                value={formData.companyname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="container signup-container">
                            <Link to="/verification"><button type="submit" className=" btn-signup">Sign Up</button></Link>
                        </div>

                    </form>
                    <div className="login-link">
                        <p className="text-white">Already have an account? <Link to={"/"}>Login here</Link></p>
                    </div>
                    <div>
                        <Link>term & conditions</Link>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default SignupForm;
