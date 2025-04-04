import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './verification.css';
import './common.css';
import { Link, useLocation } from "react-router-dom";

const Verification = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";

    return (
        <div className="verification background">
            <div className="container">
                <h1>CodinoHub.</h1>

                <div className="signup-form">
                    <h4 className="text-white">Verify Your Account</h4>

                    <div>
                        <p className="text-white">
                            A verification email has been sent to <strong>{email}</strong>. <br />
                            Please check your inbox.
                        </p>
                    </div>

                    <div>
                        <Link className="text-white">Terms & Conditions</Link>
                    </div>

                    <Link to="/">
                        <button className="verified-btn">Verified</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Verification;
