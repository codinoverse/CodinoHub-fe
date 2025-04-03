import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './verification.css';
import './common.css';
import { Link } from "react-router-dom";

const Verification = () => {




    return (
        <div className="verification background">
            <div className="container">
                <h1>CodinoHub.</h1>

                <div className="signup-form">
                    <h4 className="text-white">Verify Your Account</h4>

                    <div>
                        <p className="text-white "> A verification email has been sent to "maild id" Please check your inbox. <br />
                        </p>
                    </div>

                    <div>
                        <Link>term & conditions</Link>
                    </div>
                    <Link to="/"><button className="verified-btn">
                        Verified
                    </button></Link>
                </div>
            </div>
        </div>
    );
};

export default Verification;
