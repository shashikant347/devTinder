const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
 
dotenv.config()

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

const login = async (req,res)=>{
  try{

    const {emailId,password}= req.body;
   
    const existsUser = await User.findOne({emailId})
  
    if(!existsUser){
      return res.status(400).json({seccess:false,message:"Invalid credentials"})
    }
  
     const checkPasswrod =  await bcrypt.compare(password,existsUser.password)
     
     if(!checkPasswrod){
       return res.status(400).json({success:false,message:"Invalid credentials "})
     }
  
     const token = jwt.sign({userId : existsUser._id},process.env.JWT_SECRET,{
      expiresIn:"1d"
     })
  
     res.cookie("token",token,{
      maxAge:60*60*1000
     })

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
  }catch (error ){
    res.status(500).json({succes:false,message:"internal server error",error})
  }
}

const getuser = async (req,res)=>{
try{

  const userid = req.userId;

   const userdata = await User.findById(userid).select("-password");


   return res.status(200).json({success:true,data:userdata})
  

} catch(error){
  return res.status(500).json({succes:false,message:"internal server error",error})
}

  
}


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
    const allowedFields = [
      "skills",
      "about",
      "photoUrl",
      "gender",
      "age",
    ];

    const isAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field)
    );

    if (!isAllowed) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

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

module.exports = {
  signin,
  login,
  getuser,
  logout,
  updateProfile
};
