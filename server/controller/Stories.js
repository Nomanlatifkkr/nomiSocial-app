const Story = require('../model/Story');
const User = require('../model/user');
const { error, successful } = require('../util/resWaper');
const cloudinary = require('../cloudinary'); // Import Cloudinary config
const multer = require('multer'); // For handling file uploads
const upload = multer({ storage: multer.memoryStorage() });
const CreateStory = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req._id; // Assume user ID is extracted from middleware

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
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

    // Save the story to the database
    const newStory = new Story({
      content,
      owner: userId,
      images: imageData, // Store the image data object in the `images` field
    });

    await newStory.save();

    res.status(201).json({
      message: 'Story created successfully!',
      story: newStory,
    });
  } catch (error) {
    console.error('Error creating story:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getstorybyfollow = async (req, res) => {
  try {
    const userid = req._id; // Get the logged-in user ID from middleware (from token)

    console.log("User ID:", userid); // Debugging line

    // Find the user
    const user = await User.findById(userid);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log("User found:", user); // Debugging line

    // Combine the logged-in user's ID and the IDs of users they follow
    const targetUserIds = [...user.following, userid];
    console.log("Target User IDs:", targetUserIds); // Debugging line

    // Find the stories from both the logged-in user and their following
    const stories = await Story.find({
      owner: { $in: targetUserIds },
    })
      .populate('owner', 'username email images.url') // Correct populate for owner
      .populate({
        path: 'comments',
        populate: {
          path: 'user', // Populate user details in comments
          select: 'username images.url', // Include images and username in the comment's user
        },
        select: 'content createdAt user', // Select required comment fields
      })
      .sort({ createdAt: -1 });

    console.log("Stories found:", stories); // Debugging line

    // Map stories with additional fields like `isLiked`
    const formattedStories = stories.map((story) => {
      const owner = story.owner || {}; // Default to an empty object if owner is null
      const ownerImages = owner.images ? owner.images.url : ''; // Safe check for owner images
    
      return {
        _id: story._id,
        content: story.content,
        images: story.images,
        createdAt: story.createdAt,
        owner: {
          _id: owner._id || '', // Safe fallback for _id
          username: owner.username || 'Unknown',
          email: owner.email || 'N/A',
          images: ownerImages,
        },
        likes: story.likes.map((like) => ({
          _id: like._id,
          username: like.username,
          images: like.images,
        })),
        likeCount: story.likeCount,
        isLiked: story.likes.some((like) => like._id.toString() === userid.toString()), // Check if the logged-in user liked the story
        comments: story.comments.map((comment) => ({
          _id: comment._id,
          comment: comment.comment,
          createdAt: comment.createdAt,
          user: comment.user,
        })),
      };
    });
    

    return res.status(200).json({
      success: true,
      message: 'Stories fetched successfully.',
      stories: formattedStories,
    });
  } catch (err) {
    console.error('Error in getstorybyfollow API:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


const updateStory = async (req, res) => {
  try {
    const { storyid, content } = req.body; // Extract story id and content from the request body
    const userId = req._id; // Get the current user ID from the middleware (assumes valid token)

    // Validate that the required fields are provided
    if (!storyid || !content) {
      return res.status(400).json(error(400, "Story ID and content are required"));
    }

    // Find the story by its ID
    const story = await Story.findById(storyid);
    if (!story) {
      return res.status(404).json(error(404, "Story not found"));
    }

    // Ensure the current user is the owner of the story
    if (story.owner.toString() !== userId) {
      return res.status(403).json(error(403, "You can only update your own stories"));
    }

    // Handle image upload (if provided)
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

    // Update the story's content
    story.content = content; // Always update the content
    if (imageData) {
      story.images = imageData; // Update the image data if a new image is uploaded
    }

    // Save the updated story
    await story.save();

    // Return success response
    return res.status(200).json(successful(200, {
      story,
      message: "Story updated successfully"
    }));
  } catch (err) {
    console.error("Error in updateStory API:", err);
    return res.status(500).json(error(500, "Internal server error", err.message));
  }
};




const deletestory = async (req, res) => {
  const { storyid } = req.body;
  const userid = req._id;

  try {
    
    const story = await Story.findById(storyid);
    const user = await User.findById(userid);

   
    if (!story) {
      return res.status(404).json(error(404, "The story was not found"));
    }

    // If user doesn't exist
    if (!user) {
      return res.status(404).json(error(404, "The user was not found"));
    }

    // Check if the user is the owner of the story
    if (story.owner.toString() !== userid.toString()) {
      return res.status(403).json(error(403, "The user is not the owner of the story"));
    }


    const index = user.story.indexOf(storyid);
    if (index !== -1) {
      user.story.splice(index, 1);
      await user.save(); // Save user after updating their stories list
    }

    // If the story has likes, remove the story from the liked posts of all users
    if (story.likes.length > 0) {
      await User.updateMany(
        { _id: { $in: story.likes } },
        { $pull: { likedPosts: storyid } }
      );
    }

    // Finally, delete the story
    await user.save();
    await Story.findByIdAndDelete(storyid);

    // Send success response
    return res.status(200).json(successful(200, { message: "Story deleted successfully" }));

  } catch (err) {
    console.error("Error in deleting story:", err);
    return res.status(500).json(error(500, "Internal server error", err.message));
  }
};



  
  module.exports = { CreateStory,getstorybyfollow,updateStory,deletestory};

