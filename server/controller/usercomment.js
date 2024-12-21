const Story = require("../model/Story");


// userComment - Function to allow users to comment on a story
const userComment = async (req, res) => {
    try {
        const { storyId, commentText } = req.body;  // Get storyId and commentText from the request body
        const userId = req._id;  // Assuming the user ID is stored in req.user from middleware

        if (!storyId || !commentText) {
            return res.status(400).json({ message: 'Story ID and comment text are required.' });
        }

        // Find the story by ID
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found.' });
        }

        // Create the comment object
        const newComment = {
            user: userId,
            comment: commentText,
        };

        // Add the comment to the story's comments array
        story.comments.push(newComment);

        // Increment the comment count (if you want to track the number of comments)
        // story.commentCount = story.comments.length;

        // Save the updated story
        await story.save();

        // Populate the user data in the comments (username and images)
        const populatedStory = await Story.findById(storyId)
            .populate({
                path: 'comments.user',
                select: 'username images', // Only populate username and images fields
            });

        // Return the populated story with the new comment
        res.status(200).json({
            message: 'Comment added successfully',
            story: populatedStory,  // Send back the updated story with populated comments
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error while adding comment.' });
    }
};
module.exports={userComment};
