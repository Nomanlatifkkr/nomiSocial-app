import React, { useState } from "react";
import "./Post.css";
import { Avatar, TextField, Button } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import AXiosClient from "../../Utils/Axiosclient";

const Post = ({ story }) => {
    const [isLiked, setIsLiked] = useState(story.isLiked || false);
    const [likeCount, setLikeCount] = useState(story.likeCount || 0);
    const [comments, setComments] = useState(story.comments || []);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    // Handle like toggle
    const handleLikeToggle = async () => {
        try {
            const response = await AXiosClient.post("/story/like", { storyid: story._id });
            setIsLiked(!isLiked);
            setLikeCount(response.data.likeCount || likeCount);
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    // Handle posting a new comment
    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        // Optimistic update
        const newComment = {
            _id: `temp-${Date.now()}`, // Temporary ID
            comment: commentText,
            user: {
                username: "You",
                images: { url: "" }, // Optional placeholder avatar
            },
        };

        setComments([newComment, ...comments]);
        setCommentText("");

        try {
            const response = await AXiosClient.post("/comment", {
                storyId: story._id,
                commentText,
            });
            setComments(response.data.comments || []);
        } catch (err) {
            console.error("Error posting comment:", err);
            setComments(comments.filter((c) => c._id !== newComment._id)); // Revert optimistic update
        }
    };

    return (
        <div className="post">
            {/* Post Header */}
            <div className="post-header" style={{ display: "flex", gap: "5px" }}>
                <Avatar src={story.owner?.images || ""}>
                    {story.owner?.username?.[0] || "U"}
                </Avatar>
                <div className="post-user-info">
                    <h4>{story.owner?.username || "Unknown"}</h4>
                    <p className="time">{new Date(story.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
                <p>{story.content}</p>
                {story.images && <img src={story.images.url} alt="Post" className="post-image" />}
            </div>

            {/* Post Footer */}
            <div className="post-footer" style={{ display: "flex", gap: "10px" }}>
                <div className="post-action" onClick={handleLikeToggle}>
                    {isLiked ? (
                        <FavoriteIcon style={{ color: "red" }} />
                    ) : (
                        <FavoriteBorderOutlinedIcon />
                    )}
                    <p>{likeCount} Likes</p>
                </div>
                <div className="post-action" onClick={() => setShowComments(!showComments)}>
                    <ModeCommentOutlinedIcon />
                    <p>{comments.length} Comments</p>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="post-comments">
                    {comments.map((comment, index) => {
                        const user = comment?.user || {}; // Default to an empty object
                        const userAvatar = user.images?.url || ""; // Safe access for avatar
                        const username = user.username || "Unknown"; // Default username

                        return (
                            <div key={comment._id || `temp-${index}`} className="comment">
                                <Avatar src={userAvatar}>{username[0]}</Avatar>
                                <div className="comment-content">
                                    <h5>{username}</h5>
                                    <p>{comment.comment || "No comment provided"}</p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Comment Section */}
                    <form className="comment-input" onSubmit={handlePostComment}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Post
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Post;
