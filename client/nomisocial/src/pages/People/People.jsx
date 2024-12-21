import React, { useState, useEffect } from 'react';
import PeopleCard from '../../component/PeopleCard/PeopleCard';
import { Box } from '@mui/material';
import AXiosClient from '../../Utils/Axiosclient';
import './People.css'; // Import the CSS file

const People = () => {
    const [usersToFollow, setUsersToFollow] = useState([]);

    // Fetch users to follow
    const fetchUsers = async () => {
        try {
            const response = await AXiosClient.get("/user/people");
            console.log(response.result);
            if (response.statuscode === 200) {
                setUsersToFollow(response.result); // Assuming `result` contains the user list
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []);

    return (
        <Box className="people-container">
            <Box className="people-grid">
                {usersToFollow.map((user) => (
                    <PeopleCard
                        key={user._id}
                        user={user} // Pass the entire user object
                    />
                ))}
            </Box>
        </Box>
    );
};

export default People;

