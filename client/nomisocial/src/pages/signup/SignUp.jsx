import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AXiosClient from '../../Utils/Axiosclient';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            alert("All fields are required.");
            return;
        }

        try {
            // Call the signup API
            await AXiosClient.post('/signup', {
                username,
                email,
                password,
            });

            console.log('Signup successful!');
            // Navigate to the login page after successful signup
            navigate('/login');
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error('Signup error:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="body">
            <div className="login-container">
                <div className="login-box">
                    <div className="logo">
                        <div className="logo-circle">
                            <span>[ ]</span>
                        </div>
                    </div>
                    <h2>NomiSocial</h2>
                    <p>Explore the World</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="login-button">
                            Sign up
                        </button>
                    </form>
                    <p className="signup-link">
                        Already have an account? <Link to='/login'>Login here</Link>
                    </p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
