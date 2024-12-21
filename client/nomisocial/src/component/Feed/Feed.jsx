import React, { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar"; // Import LoadingBar
import "./Feed.css";
import FollowUserCard from "../Followers/FollowUserCard";
import UserCard from "../PRofilecard/UserCard";
import PostForm from "../Submitpost/PostForm";
import AXiosClient from "../../Utils/Axiosclient";
import Post from "../Post/Post";

const Feed = ({ loadingBarRef }) => {
    const [usersToFollow, setUsersToFollow] = useState([]);
    const [stories, setStories] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                loadingBarRef.current.continuousStart(); // Start loading bar
                const response = await AXiosClient.get("/user/people");
                setUsersToFollow(response.result || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                loadingBarRef.current.complete(); // Complete loading bar
            }
        };

        const fetchStories = async () => {
            try {
                loadingBarRef.current.continuousStart(); // Start loading bar
                const response = await AXiosClient.get("/story");
                if (response && response.stories) {
                    setStories(response.stories);
                    console.log("Fetched stories:", response.stories);
                } else {
                    console.error("Unexpected API response:", response);
                }
            } catch (err) {
                console.error("Error fetching stories:", err);
            } finally {
                loadingBarRef.current.complete(); // Complete loading bar
            }
        };

        const fetchUserData = async () => {
            try {
                loadingBarRef.current.continuousStart(); // Start loading bar
                const response = await AXiosClient.get("/user/Myaccount");
                if (response.status === "ok") {
                    setUserData(response.result);
                } else {
                    console.error("Error fetching user data");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                loadingBarRef.current.complete(); // Complete loading bar
            }
        };

        fetchUsers();
        fetchStories();
        fetchUserData();
    }, [loadingBarRef]); // Dependency array ensures ref is available

    return (
        <div className="home">
            <div className="feed">
                <div className="right-container">
                    {userData && <UserCard userData={userData} />}
                </div>
                <div className="middle-container">
                    {userData && (
                        <PostForm userImage={userData.images?.url || "https://via.placeholder.com/300x200"} />
                    )}
                    {stories.length > 0 ? (
                        stories.map((story) => <Post key={story._id} story={story} />)
                    ) : (
                        <p>No stories available.</p>
                    )}
                </div>
                <div className="left-container">
                    <h3>Who to Follow</h3>
                    <hr />
                    {usersToFollow.length > 0 ? (
                        usersToFollow.map((user) => <FollowUserCard key={user._id} user={user} />)
                    ) : (
                        <p>No users to follow.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feed;
