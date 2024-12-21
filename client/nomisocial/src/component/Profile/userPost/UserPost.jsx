import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import './UserPost.css';
import AXiosClient from '../../../Utils/Axiosclient';

const UserPost = ({ post, onDelete }) => {
    const { content = '', images = {}, likes = [], likeCount = 0, comments = [], createdAt = '', owner = {}, _id } = post;

    const [isLiked, setIsLiked] = useState(likes.some(like => like._id === localStorage.getItem('userId')));
    const isAuthor = owner._id === localStorage.getItem('userId');

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                const response = await AXiosClient.delete('/story', {
                    data: { storyid: _id },
                });

                if (response.status === 200) {
                    console.log(response.data.message);
                    if (onDelete) onDelete(_id);
                }
            } catch (error) {
                console.error('Error deleting story:', error);
            }
        }
    };

    return (
        <div className="post">
            <div className="heading">
                <Avatar src={owner.images?.url || ''} className="avatar">
                    {owner.username?.[0]}
                </Avatar>
                <div className="user-info">
                    <h4>{owner.username}</h4>
                    <p className="time">{new Date(createdAt).toLocaleString()}</p>
                </div>
                {isAuthor && (
                    <div className="author-actions">
                        <button className="action-button view" onClick={() => alert('View action')}>
                            <VisibilityOutlinedIcon />
                            View
                        </button>


                    </div>
                )}
            </div>

            <div className="content">
                <p>{content}</p>
                {images.url && (
                    <div className="image-wrapper">
                        <img src={images.url} alt="Post image" className="post-image" />
                    </div>
                )}
            </div>

            <div className="footer">
                <div className="like" onClick={handleLike} style={{ cursor: 'pointer' }}>
                    {isLiked ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderOutlinedIcon />}
                    <p>{isLiked ? likeCount + 1 : likeCount}</p>
                </div>

                <div className="comments">
                    <ModeCommentOutlinedIcon />
                    <p>{comments.length}</p>
                </div>
            </div>
            <button className="action-button delete" onClick={handleDelete}>
                <DeleteOutlinedIcon />
                Delete
            </button>
        </div>
    );
};

export default UserPost;
