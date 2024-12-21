const User=require('../model/user');
const Story=require('../model/Story');
const { error, successful } = require('../util/resWaper');
const cloudinary = require('../cloudinary'); // Import Cloudinary config
const multer = require('multer'); // For handling file uploads
const upload = multer({ storage: multer.memoryStorage() });
const GetUser = async (req, res) => {
  const userId = req._id; // Ensure `req._id` is being set in `Varifaction`
  try {
      const user = await User.findById(userId)
          .populate('followers', 'username Avatar') // Populate followers if needed
          .populate('following', 'username Avatar'); // Populate following if needed

      if (!user) {
          return res.status(404).json({ status: "error", message: "User not found" });
      }

      return res.status(200).json({ status: "ok", result: user });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Server error" });
  }
};

const GetMyStory = async (req, res) => {
  try {
    const userid = req._id;  // Get the logged-in user ID from the token

    if (!userid) {
      return res.status(400).json({
        status: "error",
        message: "User ID is not valid"
      });
    }

    // Fetch the posts/stories for the logged-in user
    const posts = await Story.find({ owner: userid })
      .populate('owner')  // Populate owner's username and profile picture
      .populate('likes', '_id')  // Populate likes (adjust fields as needed)
      .sort({ createdAt: -1 });  // Sort by creation date (newest first)

    return res.status(200).json({
      status: "success",
      message: "Stories fetched successfully",
      data: posts
    });

  } catch (err) {
    console.error("Error fetching stories:", err);
    return res.status(500).json({
      status: "error",
      message: 'Internal server error: ' + err.message
    });
  }
};


const DeleteUser = async (req, res) => {
    try {
      const userid = req._id; // ID of the user to be deleted
      console.log(userid);
  
      // Find the user to be deleted
      const deleteuser = await User.findById(userid);
      if (!deleteuser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      // Remove the user from followers' "following" lists
      if (deleteuser.followers && deleteuser.followers.length > 0) {
        await User.updateMany(
          { _id: { $in: deleteuser.followers } }, // All followers
          { $pull: { following: userid } } // Remove from their "following"
        );
      }
  
      // Remove the user from followings' "followers" lists
      if (deleteuser.following && deleteuser.following.length > 0) {
        await User.updateMany(
          { _id: { $in: deleteuser.following } }, // All followings
          { $pull: { followers: userid } } // Remove from their "followers"
        );
      }
      // web cookies clear
      res.clearCookie('jwt', {
        httpOnly: true, secure: false
    });
      // Delete all the user's stories
      await Story.deleteMany({ owner: userid });
  
      // Delete the user
      await User.findByIdAndDelete(userid);
  
      return res.status(200).json({
        message: "User and associated data deleted successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  
  const UpdateProfile = async (req, res) => {
    const userId = req._id; // User ID from the authenticated token
    const { username, bio } = req.body; // Extract fields to update
    const DEFAULT_IMAGE = "https://example.com/default-avatar.png";

    try {
        // Find the user to update
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let imageData = null;

        if (req.file) {
          // Use a Promise to handle Cloudinary upload properly
          imageData = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'stories' }, // Specify the folder in Cloudinary
              (error, result) => {
                if (error) return reject(new Error('Cloudinary upload failed'));
                resolve({
                  publicId: result.public_id, // Extract public_id
                  url: result.secure_url,    // Extract secure_url
                });
              }
            );
    
            stream.end(req.file.buffer); // Send the file buffer to Cloudinary
          });
        }
      console.log(imageData);
        

        // Update the user's information
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (imageData) {
            user.images = imageData; // Update images with Cloudinary data
        } else if (!user.images || !user.images.url) {
            user.images = { publicId: null, url: DEFAULT_IMAGE }; // Assign default if no image exists
        }

        // Save the updated user to the database
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUser: {
                username: user.username,
                bio: user.bio,
                images: user.images,
            },
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            details: err.message,
        });
    }
};


  
module.exports={
    GetMyStory,
    GetUser,
    DeleteUser,
    UpdateProfile
    
}
