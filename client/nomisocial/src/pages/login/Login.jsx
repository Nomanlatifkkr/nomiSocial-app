import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import AXiosClient from '../../Utils/Axiosclient';
import { Access_token, setitem } from '../../Utils/Localstorage';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [flashMessage, setFlashMessage] = useState(null); // State for the flash message
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setFlashMessage('Please fill in both fields.');
            return;
        }

        try {
            const response = await AXiosClient.post('/login', { email, password });
            const token = response.result.token; // Replace with the correct field name
            setitem(Access_token, token); // Store the token
            console.log("Access token stored:", token);
            navigate('/');
            setemail('');
            setpassword('');
            setFlashMessage(null); // Clear the flash message on success
        } catch (error) {
            setFlashMessage('Invalid email or password. Please try again.'); // Show error message
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="body">
            {flashMessage && (
                <div className="flash-message">
                    {flashMessage}
                </div>
            )}
            <div className="login-container">
                <div className="login-box">
                    <div className="logo">
                        <div className="logo-circle">
                            <span>[ ]</span>
                        </div>
                    </div>
                    <h2>NomiSocial</h2>
                    <p>Explore the Worlds</p>
                    <form className="login-form" onSubmit={handlesubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-button">LOGIN</button>
                    </form>
                    <p className="signup-link">
                        New to Black NomiSocial? <Link to="/signup">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
