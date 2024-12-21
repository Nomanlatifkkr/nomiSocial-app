import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import AXiosClient from "../../Utils/Axiosclient";

const FollowUserCard = ({ user }) => {
    const [isFollowed, setIsFollowed] = useState(user.isFollowed);

    const handleFollowClick = async (e) => {
        e.preventDefault();
        try {
            const endpoint = "/user/follow";
            const response = await AXiosClient.post(endpoint, { followid: user._id });
            console.log(response);

            // Toggle the follow state
            setIsFollowed((prev) => !prev);
        } catch (err) {
            console.error("Error in follow/unfollow:", err);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: 350,
                    padding: "10px",
                    borderRadius: "12px",
                    backgroundColor: "#fdfdfd", // Cream white
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
                }}
            >
                <Avatar
                    alt={user.username}
                    src={user.images || "https://via.placeholder.com/150"} // Replace with user's avatar URL
                    sx={{
                        flex: 1,
                        width: 56,
                        height: 56,
                        marginRight: "15px",
                    }}
                />
                <CardContent
                    sx={{
                        flex: 1,
                        padding: "0px",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", marginBottom: "4px", marginRight: '10px', fontSize: "14px" }}
                    >
                        {user.username}
                    </Typography>
                </CardContent>
                <Button
                    variant="contained"
                    color={isFollowed ? "secondary" : "primary"}
                    startIcon={isFollowed ? <PersonRemoveIcon sx={{ fontSize: "10px" }} /> : <PersonAddIcon sx={{ fontSize: "10px" }} />}
                    onClick={handleFollowClick}
                    sx={{
                        flex: '1',
                        textTransform: "none",
                        minWidth: "80px",  // Fixed width
                        minHeight: "35px", // Fixed height
                        fontWeight: "bold",
                        borderRadius: "20px",
                        paddingX: "20px",
                        fontSize: "12px",
                    }}
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
            </Card>
        </Box>
    );
};

export default FollowUserCard;
