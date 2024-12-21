import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingBar from 'react-top-loading-bar'; // Import the loading bar
import './Navbar.css'; // CSS file for styling
import AXiosClient from '../../Utils/Axiosclient'; // Assuming AxiosClient is already set up
import { Access_token, removeitem } from '../../Utils/Localstorage';

const Navbar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const loadingBarRef = useRef(null); // Reference for loading bar

    // Fetch user data for the logged-in user
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                loadingBarRef.current.continuousStart(); // Start loading bar before request
                const response = await AXiosClient.get("/user/Myaccount");
                if (response.status === "ok") {
                    setUserData(response.result); // Set user data to state
                } else {
                    console.error("Error fetching user data");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                loadingBarRef.current.complete(); // Complete the loading bar after request
            }
        };

        fetchUserData(); // Fetch user data
    }, []); // Empty dependency array to run only once when the component mounts

    // Logout handler
    const handleLogout = async () => {
        try {
            loadingBarRef.current.continuousStart(); // Start loading bar
            const response = await AXiosClient.post('/logout'); // Call the logout API
            if (response.statuscode === 200) {
                console.log(response.result.message);
                removeitem(Access_token); // Show logout success message
                navigate('/login'); // Redirect to login page
            } else {
                console.error('Failed to logout:', response.result?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            loadingBarRef.current.complete(); // Complete the loading bar after logout
        }
    };

    return (
        <>
            <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Loading Bar Component */}
            <nav className="navbar">
                {/* Logo Section */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={`/logo.jpg`} alt="Logo" className="navbar-logo-img" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/people">People</Link>
                </div>

                {/* Profile Avatar with Logout */}
                <div className="navbar-profile">
                    <Link to="/Profile" className="navbar-avatar-link">
                        <Avatar src={userData?.images?.url || 'https://via.placeholder.com/150'}>
                            User
                        </Avatar>
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>
                        <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
