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



const reviewRequest = async (req,res)=>{
  try{
    const id =  req.userId;
    const { status } = req.params;
    const requestId = req.params.id;

    const allowState = ["accepted", "rejected"];

    if(!allowState.includes(status)){
      return res.status(400).json({message:"status are not allowed"})
    }

    const connectionRequest = await Request.findOne({
      _id : requestId,
      toUser: id,
      status: 'interested'
    })

    if(!connectionRequest){
      return res.status(404).json({message:"connection reqest not  found "})
    }

    connectionRequest.status =  status;

    const data = await  connectionRequest.save()

     res.json({message:"connect request "+status, data:data})


  }catch(err){
    return  res.status(500).json({succes:false , message:`intarnal sever error :${err.message}` })
  }
}
module.exports = {
  sendConnectionRequest,
  reviewRequest
};