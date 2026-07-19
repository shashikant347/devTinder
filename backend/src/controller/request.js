const Request = require("../model/request");
const User = require("../model/user");

const sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.userId;
    const toUserId = req.params.id;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status not allowed",
      });
    }

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    const existingRequest = await Request.findOne({
      $or: [
        {
          fromUser: fromUserId,
          toUser: toUserId,
        },
        {
          fromUser: toUserId,
          toUser: fromUserId,
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Connection request already exists",
      });
    }

    const request = await Request.create({
      fromUser: fromUserId,
      toUser: toUserId,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendConnectionRequest,
};