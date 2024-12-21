const User = require("../model/user");
const { successful, error } = require("../util/resWaper");

const followOrUnfollow = async (req, res) => {
  const { followid } = req.body;
  const userid = req._id; // Assume this is set by middleware (e.g., from token)

  console.log("User ID from request:", userid);

  try {
    // Validate if both users exist
    const follower = await User.findById(followid);
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json(error(404, "User not found"));
    }

    if (!follower) {
      return res.status(404).json(error(404, "Follower not found"));
    }

    // Prevent a user from following themselves
    if (follower._id.toString() === user._id.toString()) {
      return res.status(409).json(error(409, "You can't follow yourself"));
    }

    // Check if the user is already following
    if (user.following.includes(followid)) {
      // Unfollow logic
      user.following = user.following.filter((id) => id.toString() !== followid);
      follower.followers = follower.followers.filter((id) => id.toString() !== userid);

      await user.save();
      await follower.save();

      return res.status(200).json(
        successful(200, {
          message: "Successfully unfollowed the user",
        })
      );
    } else {
      // Follow logic
      user.following.push(followid);
      follower.followers.push(userid);

      await user.save();
      await follower.save();

      return res.status(200).json(
        successful(200, {
          message: "Successfully followed the user",
        })
      );
    }
  } catch (err) {
    console.error("Error in follow/unfollow:", err);
    return res.status(500).json(error(500, "Internal server error", err.message));
  }
};

module.exports = { followOrUnfollow };
