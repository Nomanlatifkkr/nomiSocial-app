import React, { useState } from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import AXiosClient from '../../Utils/Axiosclient';

const PeopleCard = ({ user }) => {
    const [isFollowed, setIsFollowed] = useState(user.isFollowed);

    const handleFollowClick = async (e) => {
        e.preventDefault();
        try {
            const endpoint = "/user/follow";
            const response = await AXiosClient.post(endpoint, { followid: user._id });


            // Toggle the follow state
            setIsFollowed((prev) => !prev);
        } catch (err) {
            console.error("Error in follow/unfollow:", err);
        }
    };

    return (
        <Box
            sx={{
                width: '250px',
                padding: 2,
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Circular Avatar */}
            <Avatar
                alt={user.username}
                src={user.images || 'https://via.placeholder.com/150'}
                sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    marginBottom: 2,
                }}
            />

            {/* Name */}
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {user.username}
            </Typography>

            {/* Bio */}
            <Typography variant="body2" sx={{ marginBottom: 2, color: 'gray' }}>
                {user.bio || 'No bio available'}
            </Typography>

            {/* Follow/Unfollow Button */}
            <Button
                variant="contained"
                color={isFollowed ? 'error' : 'primary'}
                onClick={handleFollowClick}
                sx={{
                    textTransform: 'capitalize',
                    width: '100px',
                    margin: '0 auto',
                }}
            >
                {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
        </Box>
    );
};

export default PeopleCard;
