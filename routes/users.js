require('dotenv').config();
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect(process.env.MONGODB_URI).then(
  console.log("connected")
).catch
((error)=>{
  console.log("error")
});



// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures that usernames are unique
      trim: true, // Removes whitespace from both ends
    },
    password: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    dp: {
      type: String, // URL or path to the display picture
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures that emails are unique
      trim: true,
      lowercase: true, // Converts email to lowercase
    },
    fullName: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
userSchema.plugin(plm);
// Create the User model from the schema
const Users = mongoose.model("Users", userSchema);

// Export the User model for use in other parts of your application
module.exports = Users;
