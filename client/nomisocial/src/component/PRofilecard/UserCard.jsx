import React from "react";
import "./UserCard.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const UserCard = ({ userData }) => {
    // If data is not yet fetched, show a loading message
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-card">
            <div className="card-image-container">
                <img
                    src={userData.images?.url || "https://via.placeholder.com/300x200"} // Use the profile image from the response
                    alt="profile"
                    className="card-image"
                />
            </div>
            <div className="card-content">
                <h3 className="card-name">{userData.username}</h3> {/* Display the user's username */}
                <p className="card-title">{userData.bio}</p> {/* Static for now, replace as needed */}
                <hr className="card-divider" />
                <div className="card-stats">
                    <div>
                        <span className="stat-number">{userData.posts?.length || 0}</span> {/* Display posts count */}
                        <span className="stat-label">Posts</span>
                    </div>
                    <div>
                        <span className="stat-number">{userData.followers?.length || 0}</span> {/* Display followers count */}
                        <span className="stat-label">Followers</span>
                    </div>
                    <div>
                        <span className="stat-number">{userData.following?.length || 0}</span> {/* Display following count */}
                        <span className="stat-label">Following</span>
                    </div>
                </div>
                <div className="card-actions">
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className="profile-btn"
                    >
                        <Link style={{ textDecoration: "none" }} to="/Profile">
                            See Profile
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
