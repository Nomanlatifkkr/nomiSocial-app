import React, { useState } from "react";
import { Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./PostForm.css";
import AXiosClient from "../../Utils/Axiosclient";
import SuccessPopup from "../Successpop/SuccessPopup";

const PostForm = ({ userImage }) => {
  const [content, setContent] = useState(""); // State for post content
  const [image, setImage] = useState(null); // State for image preview
  const [file, setFile] = useState(null); // State for storing the actual file
  const [showPopup, setShowPopup] = useState(false); // State for showing success popup

  // Handle image selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // For preview
      };
      reader.readAsDataURL(file);
      setFile(file); // Store the actual file
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send content and image
    const formData = new FormData();
    formData.append("content", content); // Add text content
    if (file) formData.append("image", file); // Add image file if it exists

    try {
      // Send data to backend using your Axios client
      const response = await AXiosClient.post("/Story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post submitted successfully:", response.data);
      setContent(""); // Clear content input
      setImage(null); // Clear image preview
      setFile(null); // Clear file
      setShowPopup(true); // Show success popup

      // Automatically hide the popup after 3 seconds
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error submitting post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="postcard">
      <div className="left">
        <Avatar src={userImage || "https://via.placeholder.com/300x200"} className="avatar" /> {/* Display user image */}
      </div>
      <div className="right">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="content"
            id="con"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)} // Update content state
            required
          />
          {/* Image preview */}
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
          )}
          <div className="buttons">
            <button type="submit">
              <SendIcon />
            </button>

            {/* Custom image upload button */}
            <label className="label-upload">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="custom-upload-button">
                <CloudUploadIcon />
                <span>Upload Image</span>
              </div>
            </label>
          </div>
        </form>
        {/* Render SuccessPopup conditionally */}
        {showPopup && <SuccessPopup />}
      </div>
    </div>
  );
};

export default PostForm;
