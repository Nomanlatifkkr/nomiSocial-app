import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Divider, Button } from '@mui/material';
import AXiosClient from '../../Utils/Axiosclient';
import { Access_token, getitem, removeitem } from '../../Utils/Localstorage';
import ProfilePopup from '../Popup/ProfilePopup';
import { useNavigate } from 'react-router-dom';

const UserSidebar = () => {
    const [userData, setUserData] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = getitem(Access_token);
                if (!accessToken) {
                    console.error('No access token found.');
                    return;
                }
                const response = await AXiosClient.get('/user/Myaccount', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (response.status === 'ok') {
                    setUserData(response.result);
                } else {
                    console.error('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleDelete = async () => {
        try {
            const accessToken = getitem(Access_token);
            await AXiosClient.delete('/user/Myaccount', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            removeitem(Access_token);
            navigate('/login');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                width: '100%',
                boxShadow: '1px 1px 18px black',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 3,
                borderRadius: '10px',
                backgroundColor: '#fff',
            }}
        >
            <Avatar
                alt={userData.username}
                src={userData.images?.url || 'https://via.placeholder.com/150'}
                sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Typography variant="h6" gutterBottom>
                {userData.username || 'Username'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                {userData.bio || 'User bio here'}
            </Typography>

            <Divider sx={{ width: '100%', marginY: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userData.posts?.length || 0}</Typography>
                    <Typography variant="body2">Posts</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userData.followers?.length || 0}</Typography>
                    <Typography variant="body2">Followers</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{userData.following?.length || 0}</Typography>
                    <Typography variant="body2">Following</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="contained" color="primary" onClick={() => setIsPopupOpen(true)}>
                    Update
                </Button>
            </Box>

            {isPopupOpen && <ProfilePopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />}
        </Box>
    );
};

export default UserSidebar;
