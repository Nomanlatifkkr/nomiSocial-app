const User = require("../model/user");
const { error, successful } = require("../util/resWaper");

const Peopletofollow = async (req, res) => {
    try {
        const loggedInUserId = req._id; // Get the logged-in user's ID from the request

        // Fetch the logged-in user's data to get their following list
        const loggedInUser = await User.findById(loggedInUserId).select('following');
        if (!loggedInUser) {
            return res.status(404).json(error(404, "Logged-in user not found"));
        }

        // Fetch all other users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } });

        // Map the users to include the `isFollowed` property
        const usersWithFollowStatus = users.map((user) => ({
            _id: user._id,
            username: user.username,
            bio: user.bio || '', // Use an empty string if bio is not set
            images: user.images?.url || "https://via.placeholder.com/150", // Default avatar
            isFollowed: loggedInUser.following.includes(user._id.toString()), // Check if the user is followed
        }));

        // Respond with the formatted user data
        return res.status(200).json(successful(200, usersWithFollowStatus));
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json(error(500, "Error fetching users: " + err.message));
    }
};

module.exports = { Peopletofollow };
