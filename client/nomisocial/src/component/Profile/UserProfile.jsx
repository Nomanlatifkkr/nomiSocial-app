import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import UserPost from './userPost/UserPost';
import UserSidebar from './UserSidebar';
import './UserProfile.css';
import AXiosClient from '../../Utils/Axiosclient';

const UserProfile = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await AXiosClient.get("/user/Mystory", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setStories(response.data);
                } else {
                    console.error("Unexpected API response format:", response);
                }
            } catch (err) {
                console.error("Error fetching stories:", err.response ? err.response.data : err.message);
            }
        };

        fetchStories();
    }, []);

    return (
        <div className="home">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
                    minHeight: '100vh',
                    minWidth: '100vw',
                    overflowX: 'hidden',
                    backgroundColor: '#f9f9f9',
                }}
            >
                {/* Main Content Area */}
                <Box
                    sx={{
                        flex: 3,
                        padding: { xs: 1, sm: 2 }, // Adjust padding for small screens
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        order: { xs: 2, sm: 1 }, // Display posts below sidebar on small screens
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: { xs: '70vh', sm: '85vh' },
                            overflowY: 'auto',
                            padding: 2,
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            boxShadow: { xs: '0px 2px 5px rgba(0, 0, 0, 0.1)', sm: 'none' }, // Add shadow on small screens
                        }}
                    >
                        {stories.length > 0 ? (
                            stories.map((post, index) => (
                                <UserPost key={index} post={post} />
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </Box>
                </Box>

                {/* Right Sidebar */}
                <Box
                    sx={{
                        flex: 1,
                        padding: { xs: 1, sm: 3 }, // Adjust padding for small screens
                        display: 'flex',
                        justifyContent: 'center',
                        order: { xs: 1, sm: 2 }, // Display sidebar above posts on small screens
                        backgroundColor: { xs: '#fff', sm: 'transparent' }, // Add background for sidebar on small screens
                    }}
                >
                    <UserSidebar />
                </Box>
            </Box>
        </div>
    );
};

export default UserProfile;
