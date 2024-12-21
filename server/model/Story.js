
const mongoose = require('mongoose');

// Story Schema
const StorySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    images: {
        publicId: {
            type: String,
        
        },
        url: {
            type: String,
            
        }
    },
    content: {
        type: String, 
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Users who liked the story
    }],
    likeCount: {
        type: Number,
        default: 0 // Number of likes
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Story model
const Story = mongoose.model('Story', StorySchema);
module.exports = Story;
