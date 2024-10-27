const mongoose = require("mongoose");

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
  {
    imagetext: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Sets the default value to the current date and time
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    likes: {
      type: Array,
      default: [], // Initializes likes count to zero
    },
    comments: [
      {
        commentText: {
          type: String,
          required: true,
          trim: true, // Removes whitespace from both ends
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields for the post itself
  }
);

// Create the Post model from the schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model for use in other parts of your application
module.exports = Post;
