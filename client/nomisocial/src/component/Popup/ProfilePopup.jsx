import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Button,
    Avatar,
    Typography,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AXiosClient from '../../Utils/Axiosclient';
// Assuming you have AxiosClient set up

const ProfilePopup = ({ open, onClose }) => {
    const [profileImage, setProfileImage] = useState(null); // Store the selected file
    const [profileImagePreview, setProfileImagePreview] = useState(''); // Store the preview URL
    const [userName, setUserName] = useState('');
    const [bio, setBio] = useState(''); // Add Bio state

    // Handle profile image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(file); // Store the file for backend
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImagePreview(reader.result); // Set image preview
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (profileImage) {
            formData.append('images', profileImage); // Append image file
        }
        formData.append('username', userName);
        formData.append('bio', bio);

        try {
            const response = await AXiosClient.put('/user/Myaccount', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile Updated:', response.data);

            onClose(); // Close popup after successful submission
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* Dialog Header */}
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Update Profile</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                >
                    {/* Avatar and Upload Icon */}
                    <Box sx={{ position: 'relative', marginBottom: 2 }}>
                        <Avatar
                            src={
                                profileImagePreview ||
                                'https://via.placeholder.com/150' // Default avatar
                            }
                            sx={{ width: 100, height: 100 }}
                        />
                        <label htmlFor="upload-button">
                            <IconButton
                                component="span"
                                sx={{
                                    position: 'absolute',
                                    bottom: -10,
                                    right: -10,
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#115293' },
                                }}
                            >
                                <UploadFileIcon />
                            </IconButton>
                        </label>
                        <input
                            type="file"
                            id="upload-button"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </Box>

                    {/* Username Input */}
                    <TextField
                        label="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />

                    {/* Bio Input */}
                    <TextField
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                    />
                </Box>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfilePopup;
