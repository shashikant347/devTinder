const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Request = require("../model/request");

dotenv.config();

const signin = async (req, res) => {
  try {
    const { firstname, lastname, emailId, password } = req.body;
    const email = await User.findOne({ emailId });
    if (email) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      firstname,
      lastname,
      password: hashPassword,
      emailId,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const existsUser = await User.findOne({ emailId });

    if (!existsUser) {
      return res
        .status(400)
        .json({ seccess: false, message: "Invalid credentials" });
    }

    const checkPasswrod = await bcrypt.compare(password, existsUser.password);

    if (!checkPasswrod) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials " });
    }

    const token = jwt.sign({ userId: existsUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        id: existsUser._id,
        firstname: existsUser.firstname,
        lastname: existsUser.lastname,
        emailId: existsUser.emailId,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ succes: false, message: "internal server error", error });
  }
};

const getuser = async (req, res) => {
  try {
    const userid = req.userId;

    const userdata = await User.findById(userid).select("-password");

    return res.status(200).json({ success: true, data: userdata });
  } catch (error) {
    return res
      .status(500)
      .json({ succes: false, message: "internal server error", error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["skills", "about", "photoUrl", "gender", "age"];

    const isAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field),
    );

    if (!isAllowed) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllConnectionRequest = async (req, res) => {
  try {
    const id = req.userId;
    const connectionRequest = await Request.find({
      toUser: id,
      status: "interested",
    }).populate("fromUser", ["firstname", "lastname"]);

    res.status(200).json({ success: true, data: connectionRequest });
  } catch (err) {
    return res
      .status(505)
      .json({ succes: false, message: "internal server error:", err });
  }
};

const acceptedConnectonRequest = async (req, res) => {
  try {
    const id = req.userId;

    const connectionRequest = await Request.find({
      $or: [
        { fromUser: id, status: "accepted" },
        { toUser: id, status: "accepted" },
      ],
    })
      .populate("fromUser", "firstname lastname photoUrl age skills")
      .populate("toUser", "firstname lastname photoUrl age skills");
    const data = connectionRequest.map((row) => {
      if (row.fromUser._id.equals(id)) {
        return row.toUser;
      }
      return row.fromUser;
    });
    res.status(200).json({ data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const getFeed = async (req, res) => {
  try {
    const loginUser = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const connections = await Request.find({
      $or: [
        { fromUser: loginUser },
        { toUser: loginUser }
      ]
    }).select("fromUser toUser");

    const hideUsers = new Set([loginUser.toString()]);

    connections.forEach((connection) => {
      hideUsers.add(connection.fromUser.toString());
      hideUsers.add(connection.toUser.toString());
    });

    const users = await User.find({
      _id: {
        $nin: [...hideUsers]
      }
    })
      .select("firstName lastName age gender skills photoUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signin,
  login,
  getuser,
  logout,
  updateProfile,
  getAllConnectionRequest,
  acceptedConnectonRequest,
  getFeed,
};
