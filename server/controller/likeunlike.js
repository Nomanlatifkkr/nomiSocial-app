const Story = require('../model/Story');
const User = require('../model/user');
const {successful, error}=require('../util/resWaper')
const LikeandUnlike = async (req, res) => {
    try {
      const { storyid } = req.body; // Get story ID from the request body
      const currentUser = req._id; // Get the current user ID from middleware (assumes valid token)
  
      // Find the story by ID
      const story = await Story.findById(storyid); // Fixed syntax
      if (!story) {
        return res.status(404).json(error(404, "Story not found"));
      }
  
      // Check if the current user already liked the story
      if (story.likes.includes(currentUser)) {
        // If the user already liked the story, remove the like and decrement the like count
        const index = story.likes.indexOf(currentUser);
        story.likes.splice(index, 1); // Remove user from likes array
        story.likeCount = Math.max(0, story.likeCount - 1); // Ensure likeCount doesn't go below 0
        await story.save();
  
        return res.status(200).json(
          successful(200, {
            message: "Post unliked successfully",
            likeCount: story.likeCount,
          })
        );
      } else {
        // If the user hasn't liked the story, add the like and increment the like count
        story.likes.push(currentUser);
        story.likeCount = (story.likeCount || 0) + 1; 
        await story.save();
  
        return res.status(200).json(
          successful(200, {
            message: "Post liked successfully",
            likeCount: story.likeCount,
          })
        );
      }
    } catch (err) {
      console.error("Error in LikeandUnlike API:", err);
    res.status(500).json(error(500, "Internal server error", err.message));
    }
  }
  
  module.exports={LikeandUnlike}
  
