const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    membershipType: {
      type: String,
    },

    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png"
      },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;