import React from 'react';
import "./mailverification.css"
import { Toast } from 'bootstrap';

function SidemailVerification() {
    return (
        <div className='Verify-container'>
            <div className='emailCard'>
                <div className='header'>
                    <img src="./src/assets/Logo.png" alt="Sidemail Logo" className='logo' />
                    <h2 className='headerText'>CODINOHUB</h2>
                </div>
                <p className='thankyou'>Hi, Nived M</p>
                <p className='verificationText'>To get started, please verify your email address. shorlty you will recieve password</p>
                <button className='activateButton' onClick={() => Toast("Account Activated")}>Activate your account</button>
                <p className='didNotCreate'>
                    If you didn't create account with this email address, please let us know.
                </p>
                <p className='contact'>Contact: contact@codinoverse.com</p>
            </div>
        </div>
    );
}


export default SidemailVerification;